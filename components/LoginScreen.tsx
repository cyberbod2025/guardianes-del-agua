import React, { useEffect, useMemo, useState } from 'react';
import type { Database, Team, TeamProgress } from '../types';
import { SparklesIcon } from './Icons';

interface LoginScreenProps {
  onLogin: (team: Team, progress: TeamProgress) => void;
  onTeacherLogin: () => void;
}

type Step = 'askGroup' | 'askLeaderName' | 'setTeamName' | 'confirmTeam' | 'error';

const TEACHER_CODE = (import.meta.env.VITE_TEACHER_CODE || 'PROFE-ADMIN').toLowerCase();

const normalizeText = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onTeacherLogin }) => {
  const [step, setStep] = useState<Step>('askGroup');
  const [database, setDatabase] = useState<Database | null>(null);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [foundTeam, setFoundTeam] = useState<Team | null>(null);
  const [teamName, setTeamName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDatabase = async () => {
      try {
        const response = await fetch('/database.json', { credentials: 'same-origin' });
        if (!response.ok) {
          throw new Error(`Error HTTP ${response.status}`);
        }
        const data: Database = await response.json();
        setDatabase(data);
      } catch (error) {
        console.error('Failed to load database.json', error);
        setErrorMessage('No se pudo cargar la base de datos de equipos. Contacta al administrador.');
        setStep('error');
      } finally {
        setIsLoading(false);
      }
    };

    loadDatabase();
  }, []);

  const groups = useMemo(() => (database ? Object.keys(database) : []), [database]);

  const resetState = () => {
    setStep('askGroup');
    setSelectedGroup('');
    setLeaderName('');
    setFoundTeam(null);
    setTeamName('');
    setErrorMessage('');
  };

  const hydrateProgress = (team: Team, stored: Partial<TeamProgress> | null): TeamProgress => {
    const fallback: TeamProgress = {
      teamId: team.id,
      teamName: teamName || `Equipo ${team.teamNumber}`,
      groupId: team.groupId,
      completedModules: 0,
      approvalStatus: 'none',
      data: {},
      lastUpdated: new Date().toISOString(),
    };
    if (!stored) {
      return fallback;
    }

    return {
      teamId: stored.teamId ?? team.id,
      teamName: stored.teamName ?? fallback.teamName,
      groupId: stored.groupId ?? team.groupId,
      completedModules: stored.completedModules ?? 0,
      approvalStatus: stored.approvalStatus ?? 'none',
      teacherFeedback: stored.teacherFeedback,
      data: stored.data ?? {},
      lastUpdated: stored.lastUpdated ?? new Date().toISOString(),
    };
  };

  const handleGroupSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedGroup) {
      return;
    }
    setStep('askLeaderName');
  };

  const handleFindTeam = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!database || !selectedGroup || !leaderName) {
      return;
    }

    if (normalizeText(leaderName) === TEACHER_CODE) {
      onTeacherLogin();
      return;
    }

    const teams = database[selectedGroup];
    const normalizedLeader = normalizeText(leaderName);
    const databaseTeam = teams.find((team) =>
      team.members.some((member) => normalizeText(member) === normalizedLeader)
    );

    if (!databaseTeam) {
      setErrorMessage('No encontramos a ese lider en el grupo seleccionado. Revisa el nombre y vuelve a intentarlo.');
      return;
    }

    const team: Team = { ...databaseTeam, groupId: selectedGroup };
    setFoundTeam(team);

    const storedProgressRaw = localStorage.getItem(`progress-${team.id}`);
    if (storedProgressRaw) {
      try {
        const parsed = JSON.parse(storedProgressRaw) as Partial<TeamProgress>;
        setTeamName(parsed.teamName ?? '');
        setStep('confirmTeam');
        return;
      } catch (error) {
        console.warn('Stored progress is corrupted. Resetting.', error);
        localStorage.removeItem(`progress-${team.id}`);
      }
    }

    setTeamName('');
    setStep('setTeamName');
  };

  const handleCreateProgress = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!foundTeam || !teamName.trim()) {
      return;
    }
    const sanitizedName = teamName.trim();
    const newProgress = hydrateProgress(foundTeam, { teamName: sanitizedName });
    localStorage.setItem(`progress-${foundTeam.id}`, JSON.stringify(newProgress));
    onLogin(foundTeam, newProgress);
  };

  const handleConfirmExistingTeam = () => {
    if (!foundTeam) {
      return;
    }
    const storedProgressRaw = localStorage.getItem(`progress-${foundTeam.id}`);
    if (!storedProgressRaw) {
      resetState();
      return;
    }
    try {
      const parsed = JSON.parse(storedProgressRaw) as Partial<TeamProgress>;
      const hydrated = hydrateProgress(foundTeam, parsed);
      onLogin(foundTeam, hydrated);
    } catch (error) {
      console.warn('Stored progress is corrupted. Resetting.', error);
      localStorage.removeItem(`progress-${foundTeam.id}`);
      resetState();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-100">
        <p className="text-blue-900 text-lg font-medium">Cargando base de datos de equipos...</p>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-100 p-6 text-center">
        <div className="max-w-md space-y-4">
          <SparklesIcon className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-800">Ups, algo salio mal</h1>
          <p className="text-gray-700">{errorMessage}</p>
          <button
            type="button"
            onClick={resetState}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 space-y-6 border border-blue-50">
        <header className="text-center space-y-2">
          <SparklesIcon className="mx-auto h-12 w-12 text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-900">Guardianes del Agua</h1>
          <p className="text-gray-600">Mentor Aqua te guiara paso a paso. Vamos a comenzar!</p>
        </header>

        {errorMessage && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{errorMessage}</div>
        )}

        {step === 'askGroup' && (
          <form onSubmit={handleGroupSubmit} className="space-y-4">
            <label htmlFor="group-select" className="block text-sm font-medium text-gray-700">Selecciona tu grupo</label>
            <select
              id="group-select"
              value={selectedGroup}
              onChange={(event) => setSelectedGroup(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            >
              <option value="" disabled>Elige tu grupo...</option>
              {groups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Continuar
            </button>
          </form>
        )}

        {step === 'askLeaderName' && (
          <form onSubmit={handleFindTeam} className="space-y-4">
            <p className="text-gray-700">Escribe el nombre completo de la persona lider del equipo.</p>
            <label htmlFor="leader-name" className="sr-only">Nombre del lider</label>
            <input
              id="leader-name"
              type="text"
              value={leaderName}
              onChange={(event) => setLeaderName(event.target.value)}
              placeholder="Nombre y Apellido del Lider"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              autoComplete="off"
              required
            />
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
              <button
                type="submit"
                className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                Buscar equipo
              </button>
              <button
                type="button"
                onClick={resetState}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Volver
              </button>
            </div>
          </form>
        )}

        {step === 'setTeamName' && foundTeam && (
          <form onSubmit={handleCreateProgress} className="space-y-4">
            <p className="text-gray-700">Bienvenidos, Guardianes! Asi esta conformado su equipo:</p>
            <div className="rounded-md bg-blue-50 p-4 text-sm text-gray-700">
              <h2 className="font-semibold text-blue-700">Integrantes</h2>
              <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
                {foundTeam.members.map((member) => (
                  <li key={member}>{member}</li>
                ))}
              </ul>
            </div>
            <label htmlFor="team-name" className="block text-sm font-medium text-gray-700">Escojan un nombre para su equipo</label>
            <input
              id="team-name"
              type="text"
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
              placeholder="Nombre del Equipo"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
            <button
              type="submit"
              className="w-full rounded-md bg-green-600 px-4 py-2 text-white font-semibold hover:bg-green-700 transition-colors"
            >
              Guardar y comenzar
            </button>
          </form>
        )}

        {step === 'confirmTeam' && foundTeam && (
          <div className="space-y-4">
            <p className="text-gray-700">Hola de nuevo! Confirma si este es tu equipo:</p>
            <div className="rounded-md bg-blue-50 p-4 text-sm text-gray-700">
              <h2 className="font-semibold text-blue-700">{teamName}</h2>
              <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
                {foundTeam.members.map((member) => (
                  <li key={member}>{member}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={handleConfirmExistingTeam}
                className="flex-1 rounded-md bg-green-600 px-4 py-2 text-white font-semibold hover:bg-green-700 transition-colors"
              >
                Si, continuar
              </button>
              <button
                type="button"
                onClick={resetState}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                No es mi equipo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
