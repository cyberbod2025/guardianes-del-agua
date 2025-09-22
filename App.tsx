import React from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import type { TeamProgress, ModuleData, ModuleStatus } from './types';
import { MODULES } from './constants';
import ProgressBar from './components/ProgressBar';
import Module from './components/Module';
import { TrophyIcon } from './components/Icons';

const INITIAL_PROGRESS: TeamProgress = {
  completedModules: 0,
  data: {},
};

function App() {
  const [teamProgress, setTeamProgress] = useLocalStorage<TeamProgress>('team-progress', INITIAL_PROGRESS);

  const handleModuleComplete = (moduleId: number, data: ModuleData) => {
    setTeamProgress(prev => {
      const newData = { ...prev.data, [moduleId]: data };
      const newCompletedModules = Math.max(prev.completedModules, moduleId);
      return {
        completedModules: newCompletedModules,
        data: newData,
      };
    });
     // Scroll to the top to see the new active module
     window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleReset = () => {
    if(window.confirm("¿Estás seguro de que quieres borrar todo tu progreso? Esta acción no se puede deshacer.")) {
        setTeamProgress(INITIAL_PROGRESS);
    }
  }

  const currentModuleIndex = teamProgress.completedModules;
  const isProjectComplete = currentModuleIndex >= MODULES.length;

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#333333]">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-[#007BFF]">Guardianes del Agua</h1>
            <p className="text-gray-500 mt-1 text-sm">Proyecto STEAM | Mentor Aqua 🤖</p>
          </div>
          <button 
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-red-600 hover:underline"
          >
            Reiniciar Progreso
          </button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-xl shadow-md p-6 mb-12">
            <ProgressBar modules={MODULES} completedModules={teamProgress.completedModules} />
        </div>
        
        {isProjectComplete ? (
          <div className="text-center p-10 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg shadow-lg border-l-4 border-[#28A745] flex flex-col items-center">
            <TrophyIcon className="h-24 w-24 text-yellow-400 animate-pulse" />
            <h2 className="text-4xl font-bold text-[#28A745] mt-4 mb-4">¡Misión Cumplida!</h2>
            <p className="text-lg text-slate-700 mb-6 max-w-2xl">¡Felicidades, Guardianes del Agua! Han completado todos los módulos del proyecto. Han demostrado ser excelentes científicos, ingenieros y comunicadores.</p>
            <p className="text-md text-slate-600 max-w-2xl">Ahora tienen un proyecto increíble basado en evidencia para compartir con su comunidad. ¡El mundo necesita más mentes curiosas como las suyas!</p>
          </div>
        ) : (
            <div className="space-y-8">
            {MODULES.map((module, index) => {
                let status: ModuleStatus = 'LOCKED';
                if (index < currentModuleIndex) {
                status = 'COMPLETED';
                } else if (index === currentModuleIndex) {
                status = 'ACTIVE';
                }

                return (
                <Module
                    key={module.id}
                    module={module}
                    status={status}
                    savedData={teamProgress.data[module.id]}
                    onComplete={handleModuleComplete}
                />
                );
            })}
            </div>
        )}
      </main>
    </div>
  );
}

export default App;