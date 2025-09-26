import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './style.css';
import IntroSequence from './components/IntroSequence';
import LoginScreen from './components/LoginScreen';
import ProjectJourney from './components/ProjectJourney';
import TeacherDashboard from './components/TeacherDashboard';
import ReviewScreen from './components/ReviewScreen';
import { getModulesForProject, getProjectDefinition } from './constants';
import type { SessionLogEntry, Team, TeamProgress } from './types';

type AppView = 'intro' | 'login' | 'journey' | 'teacherDashboard' | 'teacherReview';

const SESSION_LOG_KEY = 'teacher-session-log';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('intro');
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);
  const [activeProgress, setActiveProgress] = useState<TeamProgress | null>(null);
  const [teamUnderReview, setTeamUnderReview] = useState<string | null>(null);

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.info(`Vista actual: ${view}`);
    }
  }, [view]);

  const persistProgress = useCallback((progress: TeamProgress) => {
    localStorage.setItem(`progress-${progress.teamId}`, JSON.stringify(progress));
  }, []);

  const appendSessionLog = useCallback((progress: TeamProgress) => {
    const entry: SessionLogEntry = {
      id: `session-${progress.teamId}-${Date.now()}`,
      teamId: progress.teamId,
      teamName: progress.teamName,
      groupId: progress.groupId,
      completedModules: progress.completedModules,
      approvalStatus: progress.approvalStatus,
      savedAt: new Date().toISOString(),
      progressSnapshot: progress,
    };

    try {
      const raw = localStorage.getItem(SESSION_LOG_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const history: SessionLogEntry[] = Array.isArray(parsed) ? parsed.filter(Boolean) : [];
      history.push(entry);
      localStorage.setItem(SESSION_LOG_KEY, JSON.stringify(history));
    } catch (error) {
      console.warn('No se pudo actualizar el historial de sesiones del profesor.', error);
      localStorage.setItem(SESSION_LOG_KEY, JSON.stringify([entry]));
    }
  }, []);

  const handleLogin = useCallback((team: Team, progress: TeamProgress) => {
    setActiveTeam(team);
    const hydrated: TeamProgress = {
      ...progress,
      groupId: progress.groupId || team.groupId,
      lastUpdated: progress.lastUpdated || new Date().toISOString(),
    };
    setActiveProgress(hydrated);
    persistProgress(hydrated);
    setView('journey');
  }, [persistProgress]);

  const updateActiveProgress = useCallback((updater: (current: TeamProgress) => TeamProgress) => {
    setActiveProgress((current) => {
      if (!current) {
        return current;
      }
      const next = updater(current);
      persistProgress(next);
      return next;
    });
  }, [persistProgress]);

  const handleFinishSession = useCallback(() => {
    if (!activeProgress) {
      setActiveTeam(null);
      setView('login');
      return;
    }
    const snapshot: TeamProgress = {
      ...activeProgress,
      lastUpdated: new Date().toISOString(),
    };
    persistProgress(snapshot);
    appendSessionLog(snapshot);
    setActiveTeam(null);
    setActiveProgress(null);
    setView('login');
    if (typeof window !== 'undefined') {
      window.alert('Tu avance se guardo y el profesor recibira la notificacion.');
    }
  }, [activeProgress, appendSessionLog, persistProgress]);

  const handleLogout = useCallback(() => {
    setActiveTeam(null);
    setActiveProgress(null);
    setView('login');
  }, []);

  const handleTeacherLogin = useCallback(() => {
    setView('teacherDashboard');
  }, []);

  const handleReviewTeam = useCallback((teamId: string) => {
    setTeamUnderReview(teamId);
    setView('teacherReview');
  }, []);

  const handleReturnToDashboard = useCallback(() => {
    setTeamUnderReview(null);
    setView('teacherDashboard');
  }, []);

  const handleTeacherExit = useCallback(() => {
    setTeamUnderReview(null);
    setView('login');
  }, []);

  const modulesForActiveTeam = useMemo(
    () => getModulesForProject(activeProgress?.projectId),
    [activeProgress?.projectId],
  );

  const activeProjectDefinition = useMemo(() => {
    if (!activeProgress?.projectId) {
      return null;
    }
    const definition = getProjectDefinition(activeProgress.projectId);
    return definition ?? null;
  }, [activeProgress?.projectId]);

  if (view === 'intro') {
    return <IntroSequence onComplete={() => setView('login')} />;
  }

  if (view === 'login') {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onTeacherLogin={handleTeacherLogin}
      />
    );
  }

  if (view === 'teacherDashboard') {
    return (
      <TeacherDashboard
        onReviewTeam={handleReviewTeam}
        onClose={handleTeacherExit}
      />
    );
  }

  if (view === 'teacherReview' && teamUnderReview) {
    return (
      <ReviewScreen
        teamId={teamUnderReview}
        onBack={handleReturnToDashboard}
      />
    );
  }

  if (view === 'journey' && activeTeam && activeProgress) {
    return (
      <ProjectJourney
        team={activeTeam}
        progress={activeProgress}
        modules={modulesForActiveTeam}
        project={activeProjectDefinition}
        onProgressChange={updateActiveProgress}
        onLogout={handleLogout}
        onFinishSession={handleFinishSession}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center space-y-4 text-slate-100">
        <p className="text-lg font-semibold">Estamos preparando tu experiencia acuatica.</p>
        <button
          type="button"
          onClick={() => setView('login')}
          className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default App;
