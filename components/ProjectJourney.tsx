import React, { useMemo } from 'react';
import type { ModuleContent, ModuleData, ModuleStatus, StoredFile, Team, TeamProgress } from '../types';
import Module from './Module';
import ProgressBar from './ProgressBar';

interface ProjectJourneyProps {
  team: Team;
  progress: TeamProgress;
  modules: ModuleContent[];
  onProgressChange: (updater: (current: TeamProgress) => TeamProgress) => void;
  onLogout: () => void;
}

const isStoredFileCandidate = (value: unknown): value is StoredFile => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  if (value instanceof File) {
    return false;
  }
  const candidate = value as Partial<StoredFile>;
  return typeof candidate.name === 'string' && typeof candidate.status === 'string';
};

const sanitizeModuleData = (data: ModuleData): ModuleData => {
  const sanitized: ModuleData = {};
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof File) {
      const fileMetadata: StoredFile = {
        name: value.name,
        mimeType: value.type,
        size: value.size,
        status: 'pending',
      };
      sanitized[key] = fileMetadata;
    } else if (isStoredFileCandidate(value)) {
      sanitized[key] = value;
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

const getStatusLabel = (status: TeamProgress['approvalStatus']) => {
  switch (status) {
    case 'approved':
      return { label: 'Plan aprobado', tone: 'bg-green-100 text-green-800 border border-green-200' };
    case 'pending':
      return { label: 'Plan enviado. Esperando revision del profesor.', tone: 'bg-yellow-50 text-yellow-800 border border-yellow-200' };
    case 'rejected':
      return { label: 'El profesor pidio ajustes. Revisa sus comentarios y vuelve a enviar.', tone: 'bg-red-50 text-red-800 border border-red-200' };
    default:
      return { label: 'Avanza paso a paso y envia tu plan cuando completes los modulos.', tone: 'bg-blue-50 text-blue-800 border border-blue-200' };
  }
};

const ProjectJourney: React.FC<ProjectJourneyProps> = ({ team, progress, modules, onProgressChange, onLogout }) => {
  const clampedCompleted = Math.min(progress.completedModules, modules.length);

  const moduleStatuses: ModuleStatus[] = useMemo(() => {
    return modules.map((module, index) => {
      if (index < clampedCompleted) {
        return 'COMPLETED';
      }
      if (index === clampedCompleted && clampedCompleted < modules.length) {
        return 'ACTIVE';
      }
      return 'LOCKED';
    });
  }, [clampedCompleted, modules]);

  const handleSaveProgress = (moduleId: number, data: ModuleData) => {
    const sanitized = sanitizeModuleData(data);
    onProgressChange((current) => ({
      ...current,
      data: {
        ...current.data,
        [moduleId]: sanitized,
      },
      lastUpdated: new Date().toISOString(),
    }));
  };

  const handleCompleteModule = (moduleId: number, data: ModuleData) => {
    const sanitized = sanitizeModuleData(data);
    const targetIndex = modules.findIndex((module) => module.id === moduleId);

    onProgressChange((current) => {
      const completedModules = targetIndex >= 0 ? Math.max(current.completedModules, targetIndex + 1) : current.completedModules;
      const nextStatus = current.approvalStatus === 'rejected' ? 'pending' : current.approvalStatus;

      return {
        ...current,
        data: {
          ...current.data,
          [moduleId]: sanitized,
        },
        completedModules,
        approvalStatus: nextStatus,
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  const handleSubmitForReview = () => {
    if (clampedCompleted < modules.length) {
      return;
    }
    onProgressChange((current) => ({
      ...current,
      approvalStatus: 'pending',
      lastUpdated: new Date().toISOString(),
    }));
  };

  const statusDisplay = getStatusLabel(progress.approvalStatus);
  const canSubmit = clampedCompleted >= modules.length && progress.approvalStatus !== 'pending' && progress.approvalStatus !== 'approved';

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Bienvenido equipo</p>
            <h1 className="text-2xl font-bold text-slate-900">{progress.teamName}</h1>
            <p className="text-sm text-slate-500">Grupo: {team.groupId} &bull; Integrantes: {team.members.length}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Cerrar sesion
          </button>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 pt-6">
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <ProgressBar modules={modules} completedModules={clampedCompleted} />
          <div className={`mt-4 rounded-lg px-4 py-3 text-sm font-medium ${statusDisplay.tone}`}>
            {statusDisplay.label}
            {progress.teacherFeedback && (
              <p className="mt-2 text-sm font-normal text-slate-700">Observaciones del profesor: {progress.teacherFeedback}</p>
            )}
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">Ultima actualizacion: {new Date(progress.lastUpdated).toLocaleString()}</p>
            <button
              type="button"
              onClick={handleSubmitForReview}
              disabled={!canSubmit}
              className="inline-flex items-center justify-center rounded-md px-5 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-400 bg-blue-600 hover:bg-blue-700"
            >
              Enviar plan para revision
            </button>
          </div>
        </section>

        <section className="space-y-6">
          {modules.map((module, index) => (
            <Module
              key={module.id}
              module={module}
              status={moduleStatuses[index]}
              savedData={progress.data[module.id]}
              onSaveProgress={handleSaveProgress}
              onComplete={handleCompleteModule}
            />
          ))}
        </section>
      </main>
    </div>
  );
};

export default ProjectJourney;
