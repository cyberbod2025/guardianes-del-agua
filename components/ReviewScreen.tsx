import React, { useEffect, useState } from 'react';
import { MODULES } from '../constants';
import type { Database, FormInput, StoredFile, Team, TeamProgress } from '../types';

interface ReviewScreenProps {
  teamId: string;
  onBack: () => void;
}

const isStoredFile = (value: unknown): value is StoredFile => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  if (value instanceof File) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return typeof candidate.name === 'string';
};

const ReviewScreen: React.FC<ReviewScreenProps> = ({ teamId, onBack }) => {
  const [team, setTeam] = useState<Team | null>(null);
  const [progress, setProgress] = useState<TeamProgress | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const stored = localStorage.getItem(`progress-${teamId}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as TeamProgress;
          setProgress(parsed);
          setFeedback(parsed.teacherFeedback ?? '');
        } catch (error) {
          console.warn('No se pudo leer el progreso almacenado', error);
        }
      }

      try {
        const response = await fetch('/database.json');
        if (response.ok) {
          const database = (await response.json()) as Database;
          let found: Team | null = null;
          for (const [groupId, teams] of Object.entries(database)) {
            const match = teams.find((candidate) => candidate.id === teamId);
            if (match) {
              found = { ...match, groupId };
              break;
            }
          }
          setTeam(found);
        }
      } catch (error) {
        console.warn('No se pudo cargar la base de datos', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [teamId]);

  const handleApprove = () => {
    if (!progress) {
      return;
    }
    const updated: TeamProgress = {
      ...progress,
      approvalStatus: 'approved',
      teacherFeedback: '',
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(`progress-${teamId}`, JSON.stringify(updated));
    alert('Plan aprobado. El equipo recibira la notificacion.');
    onBack();
  };

  const handleReject = () => {
    if (!progress) {
      return;
    }
    const updated: TeamProgress = {
      ...progress,
      approvalStatus: 'rejected',
      teacherFeedback: feedback,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(`progress-${teamId}`, JSON.stringify(updated));
    alert('Plan rechazado. El equipo podra ver tus observaciones.');
    onBack();
  };

  const renderModuleAnswers = (moduleId: number) => {
    const module = MODULES.find((item) => item.id === moduleId);
    const data = progress?.data[moduleId];

    if (!module) {
      return <p key={moduleId}>Modulo no encontrado.</p>;
    }

    return (
      <div key={moduleId} className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 border-b border-blue-200 pb-2 mb-4">{module.title}</h3>
        <div className="space-y-4">
          {module.content
            .filter((field) => field.type !== 'header' && field.type !== 'info')
            .map((field) => {
              const inputField = field as FormInput;
              const answer = data?.[inputField.id];
              return (
                <div key={inputField.id} className="rounded-lg bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-800">{inputField.label}</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                    {Array.isArray(answer) ? (
                      answer.join(', ')
                    ) : answer instanceof File ? (
                      answer.name
                    ) : isStoredFile(answer) ? (
                      <span>
                        {answer.name}{' '}
                        {answer.url ? (
                          <a
                            href={answer.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Ver archivo
                          </a>
                        ) : (
                          <span className="italic text-slate-500">(archivo pendiente)</span>
                        )}
                      </span>
                    ) : typeof answer === 'string' && answer ? (
                      answer
                    ) : answer != null ? (
                      String(answer)
                    ) : (
                      <span className="text-slate-400">Sin respuesta</span>
                    )}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  if (isLoading || !progress || !team) {
    return <div className="p-8 text-center text-slate-700">Cargando datos del equipo...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <button type="button" onClick={onBack} className="mb-6 text-blue-600 hover:underline">{'<'} Volver al panel</button>
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-lg">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">Revision del plan: {progress.teamName}</h1>
          <p className="text-sm text-slate-600">Grupo {team.groupId}</p>
        </header>

        <section className="mt-8">
          {renderModuleAnswers(1)}
          {renderModuleAnswers(2)}
          {renderModuleAnswers(3)}
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">Observaciones del profesor</h2>
          <textarea
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            rows={5}
            className="h-32 w-full rounded-md border border-slate-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Escribe comentarios y sugerencias para el equipo..."
          />
        </section>

        <footer className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleReject}
            className="rounded-md bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            Rechazar y enviar observaciones
          </button>
          <button
            type="button"
            onClick={handleApprove}
            className="rounded-md bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            Aprobar plan
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ReviewScreen;
