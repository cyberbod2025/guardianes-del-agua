import React, { useCallback, useEffect, useState } from 'react';
import './style.css';
import IntroSequence from './components/IntroSequence';
import LoginScreen from './components/LoginScreen';
import ProjectJourney from './components/ProjectJourney';
import TeacherDashboard from './components/TeacherDashboard';
import ReviewScreen from './components/ReviewScreen';
import { MODULES } from './constants';
import type { Team, TeamProgress } from './types';

type AppView = 'intro' | 'login' | 'journey' | 'teacherDashboard' | 'teacherReview';

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

  const handleLogin = useCallback((team: Team, progress: TeamProgress) => {
    setActiveTeam(team);
    const hydrated = { ...progress, groupId: progress.groupId || team.groupId, lastUpdated: progress.lastUpdated || new Date().toISOString() };
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
        modules={MODULES}
        onProgressChange={updateActiveProgress}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="text-center space-y-4">
        <p className="text-lg font-semibold text-slate-800">Estamos preparando tu experiencia.</p>
        <button
          type="button"
          onClick={() => setView('login')}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700"
        >
          Ir al inicio
        </button>
      </div>
    </div>
  );
};

export default App;
