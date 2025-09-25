import React, { useState, useEffect } from 'react';
import { TeamProgress } from '../types';

interface TeacherDashboardProps {
  onReviewTeam: (teamId: string) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onReviewTeam }) => {
  const [allProgress, setAllProgress] = useState<TeamProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllProgress = () => {
      const progressData: TeamProgress[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('progress-')) {
          const item = localStorage.getItem(key);
          if (item) {
            try {
              progressData.push(JSON.parse(item));
            } catch (e) {
              console.error(`Failed to parse progress for key: ${key}`, e);
            }
          }
        }
      }
      setAllProgress(progressData);
      setIsLoading(false);
    };

    fetchAllProgress();
  }, []);

  const pendingReview = allProgress.filter(p => p.approvalStatus === 'pending');
  const otherTeams = allProgress.filter(p => p.approvalStatus !== 'pending');

  if (isLoading) {
    return <div className="p-8">Cargando datos de los equipos...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Panel de Supervisión</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-10">
          {/* Section for Pending Reviews */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Planes Pendientes de Revisión</h2>
            {pendingReview.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingReview.map(progress => (
                  <div key={progress.teamId} className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                    <h3 className="font-bold text-lg">{progress.teamName}</h3>
                    {/* Assuming group info is stored somewhere accessible, for now, it's not in TeamProgress */}
                    {/* <p className="text-sm text-gray-500">Grupo: {progress.group}</p> */}
                    <p className="text-sm text-gray-600 mt-2">Estado: <span className="font-medium text-yellow-600">Esperando Aprobación</span></p>
                    <button 
                      onClick={() => onReviewTeam(progress.teamId)}
                      className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                      Revisar Plan
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay planes pendientes de revisión en este momento.</p>
            )}
          </div>

          {/* Section for All Other Teams */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Todos los Equipos</h2>
            {otherTeams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherTeams.map(progress => (
                  <div key={progress.teamId} className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-bold text-lg">{progress.teamName}</h3>
                    <p className="text-sm text-gray-600 mt-2">Módulos Completados: {progress.completedModules}</p>
                    <p className="text-sm text-gray-600">Estado del Plan: 
                      <span className={`font-medium ${progress.approvalStatus === 'approved' ? 'text-green-600' : 'text-gray-500'}`}>
                        {progress.approvalStatus === 'approved' ? 'Aprobado' : 'No enviado'}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No se encontraron otros equipos.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
