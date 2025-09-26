import React, { useCallback, useEffect, useState } from 'react';
import { MODULES } from '../constants';
import type { SessionLogEntry, TeamProgress } from '../types';

interface TeacherDashboardProps {
  onReviewTeam: (teamId: string) => void;
  onClose: () => void;
}

const SESSION_LOG_KEY = 'teacher-session-log';

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onReviewTeam, onClose }) => {
  const [allProgress, setAllProgress] = useState<TeamProgress[]>([]);
  const [sessionHistory, setSessionHistory] = useState<SessionLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(() => {
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

    try {
      const rawLog = localStorage.getItem(SESSION_LOG_KEY);
      if (!rawLog) {
        setSessionHistory([]);
      } else {
        const parsed = JSON.parse(rawLog);
        if (Array.isArray(parsed)) {
          const history = (parsed as SessionLogEntry[])
            .filter((entry) => Boolean(entry) && typeof entry === 'object')
            .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
          setSessionHistory(history);
        } else {
          setSessionHistory([]);
        }
      }
    } catch (error) {
      console.warn('No se pudo leer el historial de sesiones.', error);
      setSessionHistory([]);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    loadData();
  }, [loadData]);

  const handleExportHistory = useCallback(() => {
    if (sessionHistory.length === 0) {
      if (typeof window !== 'undefined') {
        window.alert('No hay sesiones guardadas para exportar.');
      }
      return;
    }

    const headers = ['Equipo', 'Grupo', 'Modulos completados', 'Estatus', 'Guardado en'];
    const rows = sessionHistory.map((entry) => [
      entry.teamName,
      entry.groupId,
      `${entry.completedModules}`,
      entry.approvalStatus,
      new Date(entry.savedAt).toLocaleString(),
    ]);

    const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const csvLines = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => escapeCsv(cell)).join(',')),
    ];

    const csvContent = csvLines.join('\n');
    if (typeof window === 'undefined') {
      return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'historial_sesiones.csv';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, [sessionHistory]);

  const pendingReview = allProgress.filter(progress => progress.approvalStatus === 'pending');
  const approvedTeams = allProgress.filter(progress => progress.approvalStatus === 'approved');
  const withoutSubmission = allProgress.filter(progress => progress.approvalStatus !== 'pending' && progress.approvalStatus !== 'approved');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-cyan-100">
        Cargando datos de los equipos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="bg-slate-900/80 backdrop-blur border-b border-cyan-500/30">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-3xl font-semibold text-white">Panel de supervision</h1>
            <p className="text-sm text-cyan-100/80">Revisa el avance, aprueba planes y consulta el historial de sesiones.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="rounded-full border border-cyan-300/60 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200 hover:text-white"
            >
              Actualizar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Cerrar sesion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-10 px-6 py-8">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Planes pendientes de revision</h2>
          {pendingReview.length === 0 ? (
            <p className="rounded-lg border border-amber-400/20 bg-slate-900/60 p-4 text-cyan-100/70 shadow">No hay planes pendientes.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {pendingReview.map((progress) => (
                <article key={progress.teamId} className="rounded-lg border border-amber-400/30 bg-slate-900/60 p-4 shadow">
                  <h3 className="text-lg font-semibold text-white">{progress.teamName}</h3>
                  <p className="text-sm text-cyan-100/80">Grupo: {progress.groupId}</p>
                  <p className="text-xs text-cyan-200/60">Ultima actualizacion: {new Date(progress.lastUpdated).toLocaleString()}</p>
                  <button
                    type="button"
                    onClick={() => onReviewTeam(progress.teamId)}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
                  >
                    Revisar plan
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Planes aprobados</h2>
          {approvedTeams.length === 0 ? (
            <p className="rounded-lg border border-emerald-400/20 bg-slate-900/60 p-4 text-cyan-100/70 shadow">Aun no hay planes aprobados.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {approvedTeams.map((progress) => (
                <article key={progress.teamId} className="rounded-lg border border-emerald-400/40 bg-slate-900/60 p-4 shadow">
                  <h3 className="text-lg font-semibold text-white">{progress.teamName}</h3>
                  <p className="text-sm text-cyan-100/80">Grupo: {progress.groupId}</p>
                  <p className="text-xs text-cyan-200/60">Ultima revision: {new Date(progress.lastUpdated).toLocaleDateString()}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Equipos sin enviar plan</h2>
          {withoutSubmission.length === 0 ? (
            <p className="rounded-lg border border-slate-500/20 bg-slate-900/60 p-4 text-cyan-100/70 shadow">Todos los equipos han enviado su plan o estan en revision.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {withoutSubmission.map((progress) => (
                <article key={progress.teamId} className="rounded-lg border border-slate-500/30 bg-slate-900/60 p-4 shadow">
                  <h3 className="text-lg font-semibold text-white">{progress.teamName}</h3>
                  <p className="text-sm text-cyan-100/80">Grupo: {progress.groupId}</p>
                  <p className="text-xs text-cyan-200/60">Avance: {progress.completedModules} de {MODULE_COUNT}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Historial de sesiones guardadas</h2>
            <button
              type="button"
              onClick={handleExportHistory}
              className="rounded-full border border-cyan-300/60 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200 hover:text-white"
            >
              Descargar CSV
            </button>
          </div>
          {sessionHistory.length === 0 ? (
            <p className="rounded-lg border border-slate-500/20 bg-slate-900/60 p-4 text-cyan-100/70 shadow">Aun no se han registrado sesiones finalizadas por los equipos.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-cyan-500/20 bg-slate-900/60 shadow">
              <table className="min-w-full divide-y divide-slate-700 text-left text-sm text-cyan-100">
                <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-cyan-300">
                  <tr>
                    <th className="px-4 py-3">Equipo</th>
                    <th className="px-4 py-3">Grupo</th>
                    <th className="px-4 py-3">Modulos</th>
                    <th className="px-4 py-3">Estatus</th>
                    <th className="px-4 py-3">Guardado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {sessionHistory.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-900/70">
                      <td className="px-4 py-2 font-semibold text-white">{entry.teamName}</td>
                      <td className="px-4 py-2 text-cyan-100/80">{entry.groupId}</td>
                      <td className="px-4 py-2 text-cyan-100/80">{entry.completedModules}</td>
                      <td className="px-4 py-2 capitalize text-cyan-100/80">{entry.approvalStatus}</td>
                      <td className="px-4 py-2 text-cyan-100/80">{new Date(entry.savedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const MODULE_COUNT = MODULES.length;

export default TeacherDashboard;

