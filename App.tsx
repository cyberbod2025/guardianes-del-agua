import React, { useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import type { TeamProgress, ModuleData, ModuleStatus, ApprovalStatus, Team } from './types';
import { MODULES } from './constants';
import ProgressBar from './components/ProgressBar';
import Module from './components/Module';
import LoginScreen from './components/LoginScreen';
import TeacherDashboard from './components/TeacherDashboard';
import ReviewScreen from './components/ReviewScreen';
import { TrophyIcon, ClockIcon, ExclamationIcon } from './components/Icons';

type AppState = 'login' | 'projectJourney' | 'teacherDashboard' | 'reviewScreen';

function App() {
  const [appState, setAppState] = useState<AppState>('login');
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [reviewingTeamId, setReviewingTeamId] = useState<string | null>(null);
  const [teamProgress, setTeamProgress] = useLocalStorage<TeamProgress | null>(null);

  const handleLogin = (team: Team, progress: TeamProgress) => {
    setCurrentTeam(team);
    setTeamProgress(progress, `progress-${team.id}`);
    setAppState('projectJourney');
  };

  const handleTeacherLogin = () => {
    setAppState('teacherDashboard');
  };

  const handleSelectTeamForReview = (teamId: string) => {
    setReviewingTeamId(teamId);
    setAppState('reviewScreen');
  };

  const handleBackToDashboard = () => {
    setReviewingTeamId(null);
    setAppState('teacherDashboard');
  };

  const handleModuleComplete = (moduleId: number, data: ModuleData) => {
    if (!teamProgress) return;
    setTeamProgress(prev => {
      if (!prev) return null;
      const newData = { ...prev.data, [moduleId]: data };
      const newCompletedModules = Math.max(prev.completedModules, moduleId);
      let newApprovalStatus: ApprovalStatus = prev.approvalStatus;

      if (moduleId === 2) {
        newApprovalStatus = 'pending';
      }

      return {
        ...prev,
        completedModules: newCompletedModules,
        approvalStatus: newApprovalStatus,
        data: newData,
      };
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveProgress = (moduleId: number, data: ModuleData) => {
    if (!teamProgress) return;
    setTeamProgress(prev => {
      if (!prev) return null;
      const newData = { ...prev.data, [moduleId]: data };
      return {
        ...prev,
        data: newData,
      };
    });
    alert("¡Progreso guardado!");
  };

  const handleLogout = () => {
    setCurrentTeam(null);
    setTeamProgress(null);
    setAppState('login');
  };

  const handleExport = () => {
    if (!currentTeam || !teamProgress) return;
    let content = `Bitácora del Equipo: ${teamProgress.teamName}\n`;
    content += `Grupo: ${currentTeam.teamNumber}\n`;
    content += `----------------------------------------------------\n\n`;

    MODULES.forEach(module => {
      const moduleData = teamProgress.data[module.id];
      content += `MÓDULO ${module.id}: ${module.title}\n`;
      content += `--------------------------------------\n`;
      if (moduleData) {
        const moduleFields = MODULES.find(m => m.id === module.id)?.content.filter(f => f.type !== 'header' && f.type !== 'info') || [];
        moduleFields.forEach(field => {
            const answer = moduleData[(field as any).id];
            if(answer !== undefined) {
                content += `${(field as any).label}:\n${Array.isArray(answer) ? answer.join(', ') : answer}\n\n`;
            }
        });
      } else {
        content += "Módulo no completado o sin datos guardados.\n\n";
      }
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bitacora_${teamProgress.teamName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderProjectJourney = () => {
    if (!currentTeam || !teamProgress) {
      if(appState !== 'login') handleLogout();
      return null;
    }

    const isProjectComplete = teamProgress.completedModules >= MODULES.length && teamProgress.approvalStatus === 'approved';

    const getStatusForModule = (moduleIndex: number): ModuleStatus => {
      const { completedModules, approvalStatus } = teamProgress;
      const planModuleIndex = 1;

      if (approvalStatus === 'pending' && moduleIndex > planModuleIndex) {
        return 'LOCKED';
      }

      if (approvalStatus === 'rejected') {
        if (moduleIndex === planModuleIndex) return 'ACTIVE';
        if (moduleIndex > planModuleIndex) return 'LOCKED';
      }
      
      if (moduleIndex < completedModules) {
        return 'COMPLETED';
      }
      
      if (moduleIndex === completedModules) {
        return 'ACTIVE';
      }

      return 'LOCKED';
    }

    return (
      <div className="min-h-screen bg-[#F7F9FC] text-[#333333]">
                <div>
                  <h3 className="font-bold">El plan necesita ajustes</h3>
                  <p className="text-sm">Tu profesor ha enviado observaciones. Por favor, revisa los comentarios, ajusta tu Módulo 2 y vuelve a enviarlo.</p>
                  {teamProgress.teacherFeedback && (
                    <div className="mt-2 p-3 bg-red-50 rounded-md border border-red-200">
                        <p className="text-sm font-semibold">Comentarios del profesor:</p>
                        <p className="text-sm whitespace-pre-wrap">{teamProgress.teacherFeedback}</p>
                    </div>
                  )}
                </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (appState) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} onTeacherLogin={handleTeacherLogin} />;
      case 'projectJourney':
        return renderProjectJourney();
      case 'teacherDashboard':
        return <TeacherDashboard onReviewTeam={handleSelectTeamForReview} />;
      case 'reviewScreen':
        if (!reviewingTeamId) return <p>Error: No team selected for review.</p>;
        return <ReviewScreen teamId={reviewingTeamId} onBack={handleBackToDashboard} />;
      default:
        return <p>Cargando...</p>;
    }
  };

  return renderContent();
}

export default App;
