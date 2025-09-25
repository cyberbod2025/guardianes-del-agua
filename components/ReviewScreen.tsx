import React, { useState, useEffect } from 'react';
import { Team, TeamProgress, FormInput } from '../types';
import { MODULES } from '../constants';

interface ReviewScreenProps {
  teamId: string;
  onBack: () => void;
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({ teamId, onBack }) => {
  const [team, setTeam] = useState<Team | null>(null);
  const [progress, setProgress] = useState<TeamProgress | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const progressData = localStorage.getItem(`progress-${teamId}`);
      if (progressData) {
        const parsedProgress = JSON.parse(progressData);
        setProgress(parsedProgress);
        setFeedback(parsedProgress.teacherFeedback || '');
      }

      const dbResponse = await fetch('/database.json');
      const db = await dbResponse.json();
      let foundTeam: Team | null = null;
      for (const group in db) {
        const teamInGroup = db[group].find((t: Team) => t.id === teamId);
        if (teamInGroup) {
          foundTeam = teamInGroup;
          break;
        }
      }
      setTeam(foundTeam);
      setIsLoading(false);
    };

    fetchData();
  }, [teamId]);

  const handleApprove = () => {
    if (!progress) return;
    const updatedProgress = { ...progress, approvalStatus: 'approved' as const, teacherFeedback: '' };
    localStorage.setItem(`progress-${teamId}`, JSON.stringify(updatedProgress));
    alert('Plan aprobado. El equipo será notificado.');
    onBack();
  };

  const handleReject = () => {
    if (!progress) return;
    const updatedProgress = { 
        ...progress, 
        approvalStatus: 'rejected' as const,
        teacherFeedback: feedback
    };
    localStorage.setItem(`progress-${teamId}`, JSON.stringify(updatedProgress));
    alert('Plan rechazado. El equipo será notificado y podrá ver tus observaciones.');
    onBack();
  };

  const renderModuleAnswers = (moduleId: number) => {
    const module = MODULES.find(m => m.id === moduleId);
    const moduleData = progress?.data[moduleId];

    if (!module) return <p>Módulo no encontrado.</p>;

    return (
      <div key={moduleId} className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4">{module.title}</h3>
        <div className="space-y-4">
          {module.content
            .filter(field => field.type !== 'header' && field.type !== 'info')
            .map(field => {
              const inputField = field as FormInput;
              const answer = moduleData?.[inputField.id];
              return (
                <div key={inputField.id}>
                  <p className="font-semibold text-gray-700">{inputField.label}</p>
                  <p className="text-gray-800 bg-gray-50 p-2 rounded-md whitespace-pre-wrap">
                    {answer ? (Array.isArray(answer) ? answer.join(', ') : answer) : <span className="text-gray-400">Sin respuesta</span>}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  if (isLoading || !progress || !team) {
    return <div className="p-8">Cargando datos del equipo...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <button onClick={onBack} className="mb-6 text-blue-500 hover:underline">{'<'} Volver al Panel</button>
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Revisión del Plan: {progress.teamName}</h1>
            <p className="text-lg text-gray-600 mb-6">Grupo: {team.teamNumber}</p>
            
            <div className="my-8">
              {renderModuleAnswers(1)}
              {renderModuleAnswers(2)}
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-3">Observaciones del Profesor</h2>
                <textarea 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={5}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Escribe aquí tus comentarios y sugerencias para el equipo..."
                />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
                <button 
                    onClick={handleReject}
                    className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition-colors"
                >
                    Rechazar y Enviar Observaciones
                </button>
                <button 
                    onClick={handleApprove}
                    className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition-colors"
                >
                    Aprobar Plan
                </button>
            </div>
        </div>
    </div>
  );
};
