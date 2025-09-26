import React, { useEffect, useState } from 'react';
import { MODULES } from '../constants';
import type { TeamProgress } from '../types';

interface TeacherDashboardProps {
  onReviewTeam: (teamId: string) => void;
  onClose: () => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onReviewTeam, onClose }) => {
  const [allProgress, setAllProgress] = useState<TeamProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllProgress = () => {
      const collected: TeamProgress[] = [];
      for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index);
        if (!key || !key.startsWith('progress-')) {
          continue;
        }
        const raw = localStorage.getItem(key);
        if (!raw) {
          continue;
        }
        try {
          const parsed = JSON.parse(raw) as TeamProgress;
          collected.push(parsed);
        } catch (error) {
          console.warn(`No se pudo leer el progreso almacenado para ${key}`, error);
        }
      }
      collected.sort((a, b) => a.teamName.localeCompare(b.teamName));
      setAllProgress(collected);
      setIsLoading(false);
    };

    fetchAllProgress();
  }, []);

  const pendingReview = allProgress.filter(progress => progress.approvalStatus === 'pending');
  const approvedTeams = allProgress.filter(progress => progress.approvalStatus === 'approved');
  const withoutSubmission = allProgress.filter(progress => progress.approvalStatus !== 'pending' && progress.approvalStatus !== 'approved');

  if (isLoading) {
    return <div className="p-8 text-center text-slate-700">Cargando datos de los equipos...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Panel de supervision</h1>
            <p className="text-sm text-slate-500">Revisa el avance y aprueba los planes de los equipos.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cerrar sesion
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-10 px-6 py-8">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">Planes pendientes de revision</h2>
          {pendingReview.length === 0 ? (
            <p className="rounded-lg bg-white p-4 text-slate-500 shadow-sm">No hay planes pendientes.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {pendingReview.map((progress) => (
                <article key={progress.teamId} className="rounded-lg border-l-4 border-yellow-400 bg-white p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">{progress.teamName}</h3>
                  <p className="text-sm text-slate-600">Grupo: {progress.groupId}</p>
                  <p className="text-xs text-slate-500">Ultima actualizacion: {new Date(progress.lastUpdated).toLocaleString()}</p>
                  <button
                    type="button"
                    onClick={() => onReviewTeam(progress.teamId)}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Revisar plan
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">Planes aprobados</h2>
          {approvedTeams.length === 0 ? (
            <p className="rounded-lg bg-white p-4 text-slate-500 shadow-sm">Aun no hay planes aprobados.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {approvedTeams.map((progress) => (
                <article key={progress.teamId} className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-green-200">
                  <h3 className="text-lg font-semibold text-slate-900">{progress.teamName}</h3>
                  <p className="text-sm text-slate-600">Grupo: {progress.groupId}</p>
                  <p className="text-xs text-slate-500">Ultima revision: {new Date(progress.lastUpdated).toLocaleDateString()}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">Equipos sin enviar plan</h2>
          {withoutSubmission.length === 0 ? (
            <p className="rounded-lg bg-white p-4 text-slate-500 shadow-sm">Todos los equipos han enviado su plan o estan en revision.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {withoutSubmission.map((progress) => (
                <article key={progress.teamId} className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">{progress.teamName}</h3>
                  <p className="text-sm text-slate-600">Grupo: {progress.groupId}</p>
                  <p className="text-xs text-slate-500">Avance: {progress.completedModules} de {MODULE_COUNT}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const MODULE_COUNT = MODULES.length;

export default TeacherDashboard;
