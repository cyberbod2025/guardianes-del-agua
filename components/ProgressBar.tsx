import React from 'react';
import type { ModuleContent } from '../types';

interface ProgressBarProps {
  modules: ModuleContent[];
  completedModules: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ modules, completedModules }) => {
  const totalModules = modules.length;
  const progressPercentage = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
  
  const isProjectComplete = completedModules >= totalModules;
  const currentModule = isProjectComplete ? null : modules[completedModules];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-[#007BFF]">
          {isProjectComplete || !currentModule
            ? "PROYECTO COMPLETO" 
            : `MÓDULO ${currentModule.id}: ${currentModule.title.split(': ')[1].toUpperCase()}`
          }
        </h3>
        <span className="text-lg font-bold text-[#007BFF]">{Math.round(progressPercentage)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-[#28A745] h-4 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

export default ProgressBar;