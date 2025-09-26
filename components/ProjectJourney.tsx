import React, { useMemo } from 'react';
import type { ModuleContent, ModuleData, ModuleStatus, StoredFile, Team, TeamProgress } from '../types';
import type { ProjectDefinition } from '../constants';

import Module from './Module';
import ProgressBar from './ProgressBar';

interface ProjectJourneyProps {
  team: Team;
  progress: TeamProgress;
  modules: ModuleContent[];
  project?: ProjectDefinition | null;
  onProgressChange: (updater: (current: TeamProgress) => TeamProgress) => void;
  onLogout: () => void;
  onFinishSession: () => void;
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
      return {
        label: 'Plan aprobado. Tienen luz verde para seguir construyendo.',
        tone: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
      };
    case 'pending':
      return {
        label: 'Plan enviado. Esperen la luz verde del profesor antes de continuar.',
        tone: 'bg-amber-50 text-amber-800 border border-amber-200',
      };
    case 'rejected':
      return {
        label: 'El profesor pidio ajustes. Revisen sus comentarios y vuelvan a enviar.',
        tone: 'bg-rose-50 text-rose-800 border border-rose-200',
      };
    default:
      return {
        label: 'Avanza paso a paso y envia tu plan cuando completes los modulos.',
        tone: 'bg-sky-50 text-sky-800 border border-sky-200',
      };
  }
};

const ProjectJourney: React.FC<ProjectJourneyProps> = ({ team, progress, modules, project, onProgressChange, onLogout, onFinishSession }) => {
  const clampedCompleted = Math.min(progress.completedModules, modules.length);
  const isAwaitingApproval = progress.approvalStatus === 'pending';
  const isApproved = progress.approvalStatus === 'approved';
  const isFrozen = isAwaitingApproval || isApproved;

  const projectAccentStyle = project ? { borderColor: project.color } : undefined;

  const moduleStatuses: ModuleStatus[] = useMemo(() => {
    return modules.map((module, index) => {
      if (isFrozen) {
        return index < clampedCompleted ? 'COMPLETED' : 'LOCKED';
      }
      if (index < clampedCompleted) {
        return 'COMPLETED';
      }
      if (index === clampedCompleted && clampedCompleted < modules.length) {
        return 'ACTIVE';
      }
      return 'LOCKED';
    });
  }, [clampedCompleted, isFrozen, modules]);

  const handleSaveProgress = (moduleId: number, data: ModuleData) => {
    if (isFrozen) {
      return;
    }
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
    if (isFrozen) {
      return;
    }
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
    if (isFrozen) {
      return;
    }
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
  const canSubmit = !isFrozen && clampedCompleted >= modules.length && progress.approvalStatus !== 'pending' && progress.approvalStatus !== 'approved';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 pb-16">
      <header className="bg-slate-900/80 backdrop-blur shadow-lg border-b border-cyan-500/30">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-6 text-slate-100 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">Bienvenido equipo</p>
            <h1 className="text-3xl font-semibold text-white">{progress.teamName}</h1>
            <p className="text-sm text-cyan-100/80">Grupo: {team.groupId} &bull; Integrantes: {team.members.length}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onFinishSession}
              className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-cyan-300"
            >
              Terminar y guardar
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center justify-center rounded-full border border-cyan-300/60 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200 hover:text-white"
            >
              Salir sin guardar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 pt-10 pb-12">
        <section className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-6 shadow-xl backdrop-blur">
          {project ? (
            <div
              className="mb-6 rounded-xl border px-4 py-3 text-sm text-cyan-100/80"
              style={projectAccentStyle}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Proyecto seleccionado</p>
              <h2 className="mt-2 text-xl font-semibold text-white">{project.title}</h2>
              <p className="mt-1 text-sm text-cyan-100/80">{project.mission}</p>
              <p className="mt-2 text-xs text-cyan-100/60">{project.summary}</p>
            </div>
          ) : (
            <div className="mb-6 rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              Seleccionen su proyecto con la autorizacion del docente para ver las misiones especiales.
            </div>
          )}
          <ProgressBar modules={modules} completedModules={clampedCompleted} />
          <div className={`mt-4 rounded-lg px-4 py-3 text-sm font-medium ${statusDisplay.tone}`}>
            {statusDisplay.label}
            {progress.teacherFeedback && (
              <p className="mt-2 text-sm font-normal text-slate-700">
                Observaciones del profesor: {progress.teacherFeedback}
              </p>
            )}
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-cyan-200/70">Ultima actualizacion: {new Date(progress.lastUpdated).toLocaleString()}</p>
            <button
              type="button"
              onClick={handleSubmitForReview}
              disabled={!canSubmit}
              className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-slate-950 transition disabled:cursor-not-allowed disabled:bg-slate-600 bg-cyan-400 hover:bg-cyan-300"
            >
              Enviar plan para revision
            </button>
          </div>
          {isAwaitingApproval && (
            <p className="mt-3 rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              Mentor Aqua recuerda: esperen la luz verde del profesor antes de seguir construyendo.
            </p>
          )}
          {isApproved && (
            <p className="mt-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              Tienen aprobacion docente. Pueden avanzar a la coevaluacion cuando esten listos.
            </p>
          )}
        </section>

        <section className="space-y-6">
          {modules.map((module, index) => (
            <Module
              key={module.id}
              module={module}
              status={moduleStatuses[index]}
              team={team}
              progress={progress}
              savedData={progress.data[module.id]}
              isFrozen={isFrozen}
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

