import React, { useEffect, useMemo, useState } from 'react';
import type { Database, DatabaseTeam, ProjectId, Team, TeamProgress } from '../types';
import { BASE_MODULES, PROJECTS, getProjectDefinition } from '../constants';
import { SparklesIcon } from './Icons';

interface LoginScreenProps {
  onLogin: (team: Team, progress: TeamProgress) => void;
  onTeacherLogin: () => void;
}

type Step =
  | 'askGroup'
  | 'selectMember'
  | 'setTeamName'
  | 'selectProject'
  | 'confirmTeam'
  | 'unlockProject'
  | 'error'
  | 'teacherCode';

const TEACHER_CODE = String(import.meta.env.VITE_TEACHER_CODE ?? '521314').trim().toLowerCase();

const normalizeText = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

const filterDataToBaseModules = (data: TeamProgress['data'] | undefined): TeamProgress['data'] => {
  if (!data) {
    return {};
  }
  const baseIds = new Set(BASE_MODULES.map((module) => module.id));
  const filtered: TeamProgress['data'] = {};
  for (const [key, moduleData] of Object.entries(data)) {
    const numericId = Number(key);
    if (!Number.isNaN(numericId) && baseIds.has(numericId)) {
      filtered[numericId] = moduleData;
    }
  }
  return filtered;
};

const sanitizeProgressForProject = (progress: TeamProgress): TeamProgress => ({
  ...progress,
  completedModules: Math.min(progress.completedModules, BASE_MODULES.length),
  approvalStatus: 'none',
  teacherFeedback: undefined,
  projectId: progress.projectId,
  data: filterDataToBaseModules(progress.data),
});

const applyProjectSelection = (progress: TeamProgress, projectId: ProjectId): TeamProgress => ({
  ...sanitizeProgressForProject(progress),
  projectId,
  lastUpdated: new Date().toISOString(),
});

const BubbleBackground = () => (
  <>
    <div className="pointer-events-none absolute inset-0 -z-10 bg-slate-950" />
    <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.28),transparent_62%),radial-gradient(circle_at_85%_25%,rgba(129,140,248,0.22),transparent_60%),radial-gradient(circle_at_50%_85%,rgba(34,211,238,0.18),transparent_70%)]" />
    <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
    <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-32 left-1/4 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
  </>
);

const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative min-h-screen overflow-hidden">
    <BubbleBackground />
    <div className="relative flex min-h-screen items-center justify-center p-6">
      {children}
    </div>
  </div>
);

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onTeacherLogin }) => {
  const [step, setStep] = useState<Step>('askGroup');
  const [database, setDatabase] = useState<Database | null>(null);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [foundTeam, setFoundTeam] = useState<Team | null>(null);
  const [teamName, setTeamName] = useState('');
  const [existingProgress, setExistingProgress] = useState<TeamProgress | null>(null);
  const [pendingProgress, setPendingProgress] = useState<TeamProgress | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<ProjectId | ''>('');
  const [teacherCodeInput, setTeacherCodeInput] = useState('');
  const [overrideCodeInput, setOverrideCodeInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [overrideError, setOverrideError] = useState('');
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

  const memberGroups = useMemo(() => {
    if (!database || !selectedGroup) {
      return [] as Array<{ team: DatabaseTeam; members: string[] }>;
    }
    return database[selectedGroup].map((team) => ({
      team,
      members: [...team.members].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' })),
    }));
  }, [database, selectedGroup]);

  useEffect(() => {
    setSelectedMember('');
  }, [selectedGroup]);

  const resetState = () => {
    setStep('askGroup');
    setSelectedGroup('');
    setSelectedMember('');
    setTeacherCodeInput('');
    setOverrideCodeInput('');
    setFoundTeam(null);
    setExistingProgress(null);
    setPendingProgress(null);
    setSelectedProjectId('');
    setTeamName('');
    setErrorMessage('');
    setOverrideError('');
  };

  const hydrateProgress = (team: Team, stored: Partial<TeamProgress> | null): TeamProgress => {
    const fallback: TeamProgress = {
      teamId: team.id,
      teamName: teamName || `Equipo ${team.teamNumber}`,
      groupId: team.groupId,
      completedModules: 0,
      approvalStatus: 'none',
      data: {},
      projectId: undefined,
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
      projectId: stored.projectId ?? undefined,
      data: stored.data ?? {},
      lastUpdated: stored.lastUpdated ?? new Date().toISOString(),
    };
  };

  const handleGroupSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedGroup) {
      return;
    }
    setErrorMessage('');
    setSelectedMember('');
    setStep('selectMember');
  };

  const handleSelectMember = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedGroup || !selectedMember || !database) {
      return;
    }

    const groupTeams = database[selectedGroup];
    let match: DatabaseTeam | null = null;
    for (const candidate of groupTeams) {
      if (candidate.members.some((member) => normalizeText(member) === normalizeText(selectedMember))) {
        match = candidate;
        break;
      }
    }

    if (!match) {
      setErrorMessage('No encontramos tu nombre en ese grupo. Verifica con tu profesor.');
      return;
    }

    const team: Team = { ...match, groupId: selectedGroup };
    setFoundTeam(team);

    const storedProgressRaw = localStorage.getItem(`progress-${team.id}`);
    if (storedProgressRaw) {
      try {
        const parsed = JSON.parse(storedProgressRaw) as Partial<TeamProgress>;
        const hydrated = hydrateProgress(team, parsed);
        setExistingProgress(hydrated);
        setTeamName(hydrated.teamName);
        if (hydrated.projectId) {
          setStep('confirmTeam');
        } else {
          const sanitized = sanitizeProgressForProject({ ...hydrated, projectId: undefined });
          setExistingProgress(sanitized);
          setPendingProgress(sanitized);
          localStorage.setItem(`progress-${team.id}`, JSON.stringify(sanitized));
          setSelectedProjectId('');
          setStep('selectProject');
        }
        return;
      } catch (error) {
        console.warn('Stored progress is corrupted. Resetting.', error);
        localStorage.removeItem(`progress-${team.id}`);
      }
    }

    setExistingProgress(null);
    setPendingProgress(null);
    setTeamName('');
    setStep('setTeamName');
  };

  const handleCreateProgress = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!foundTeam || !teamName.trim()) {
      return;
    }
    const sanitizedName = teamName.trim();
    const baseProgress = hydrateProgress(foundTeam, { teamName: sanitizedName });
    const sanitized = sanitizeProgressForProject({ ...baseProgress, projectId: undefined });
    sanitized.teamName = sanitizedName;
    localStorage.setItem(`progress-${foundTeam.id}`, JSON.stringify(sanitized));
    setExistingProgress(sanitized);
    setPendingProgress(sanitized);
    setSelectedProjectId('');
    setStep('selectProject');
  };

  const handleConfirmExistingTeam = () => {
    if (!foundTeam || !existingProgress) {
      resetState();
      return;
    }
    onLogin(foundTeam, existingProgress);
  };

  const handleTeacherCodeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!teacherCodeInput.trim()) {
      return;
    }

    if (normalizeText(teacherCodeInput) === TEACHER_CODE) {
      onTeacherLogin();
      setTeacherCodeInput('');
      setErrorMessage('');
      return;
    }

    setErrorMessage('Codigo incorrecto. Intentalo de nuevo.');
  };

  const handleUnlockProjectSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!foundTeam || !existingProgress) {
      resetState();
      return;
    }
    if (normalizeText(overrideCodeInput) !== TEACHER_CODE) {
      setOverrideError('Codigo incorrecto. Pide ayuda a tu profesor.');
      return;
    }

    const sanitized = sanitizeProgressForProject({ ...existingProgress, projectId: undefined });
    sanitized.lastUpdated = new Date().toISOString();
    localStorage.setItem(`progress-${foundTeam.id}`, JSON.stringify(sanitized));
    setExistingProgress(sanitized);
    setPendingProgress(sanitized);
    setOverrideCodeInput('');
    setOverrideError('');
    setSelectedProjectId('');
    setStep('selectProject');
  };

  const handleConfirmProjectSelection = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!foundTeam || !pendingProgress || !selectedProjectId) {
      setErrorMessage('Selecciona un proyecto para continuar.');
      return;
    }

    const updated = applyProjectSelection(pendingProgress, selectedProjectId);
    localStorage.setItem(`progress-${foundTeam.id}`, JSON.stringify(updated));
    setExistingProgress(updated);
    setPendingProgress(null);
    setSelectedProjectId('');
    setErrorMessage('');
    onLogin(foundTeam, updated);
  };

  const projectAssigned = existingProgress?.projectId ? getProjectDefinition(existingProgress.projectId) : null;
  const selectedProject = selectedProjectId ? getProjectDefinition(selectedProjectId) : null;

  if (isLoading) {
    return (
      <PageShell>
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 text-center text-slate-100 shadow-2xl backdrop-blur-xl">
          <p className="text-lg font-medium text-cyan-100">Cargando base de datos de equipos...</p>
        </div>
      </PageShell>
    );
  }

  if (step === 'error') {
    return (
      <PageShell>
        <div className="w-full max-w-md space-y-4 rounded-3xl border border-white/10 bg-white/10 p-8 text-center text-slate-100 shadow-2xl backdrop-blur-xl">
          <SparklesIcon className="mx-auto h-12 w-12 text-rose-300" />
          <h1 className="text-2xl font-bold text-white">Ups, algo salio mal</h1>
          <p className="text-slate-200">{errorMessage}</p>
          <button
            type="button"
            onClick={resetState}
            className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
          >
            Reintentar
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="w-full max-w-3xl space-y-6 rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <header className="text-center space-y-2">
          <SparklesIcon className="mx-auto h-12 w-12 text-cyan-300" />
          <h1 className="text-3xl font-bold text-white">Guardianes del Agua</h1>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">Mentor Aqua te da la bienvenida</p>
          <p className="text-slate-200">Elige tu grupo, selecciona tu nombre y asigna tu mision.</p>
        </header>

        {errorMessage && step !== 'teacherCode' && step !== 'unlockProject' && (
          <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-100">
            {errorMessage}
          </div>
        )}

        {step === 'askGroup' && (
          <form onSubmit={handleGroupSubmit} className="space-y-4" noValidate>
            <label htmlFor="group-select" className="block text-sm font-semibold text-cyan-100">Selecciona tu grupo</label>
            <select
              id="group-select"
              value={selectedGroup}
              onChange={(event) => setSelectedGroup(event.target.value)}
              className="w-full rounded-xl border border-white/20 bg-slate-950/60 px-3 py-2 text-slate-100 shadow-inner focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              required
            >
              <option value="" disabled>Elige tu grupo...</option>
              {groups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="submit"
                className="flex-1 rounded-full bg-cyan-500 px-4 py-2 text-center text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
              >
                Continuar
              </button>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setTeacherCodeInput('');
                  setStep('teacherCode');
                }}
                className="flex-1 rounded-full border border-cyan-300/50 px-4 py-2 text-center text-sm font-semibold text-cyan-100 transition-colors hover:border-cyan-200 hover:text-cyan-50"
              >
                Soy docente
              </button>
            </div>
          </form>
        )}

        {step === 'selectMember' && (
          <form onSubmit={handleSelectMember} className="space-y-4" noValidate>
            <p className="text-sm font-semibold text-cyan-100">Grupo seleccionado: {selectedGroup}</p>
            <label htmlFor="member-select" className="block text-sm font-semibold text-cyan-100">Elige tu nombre de la lista</label>
            <select
              id="member-select"
              value={selectedMember}
              onChange={(event) => setSelectedMember(event.target.value)}
              className="w-full rounded-xl border border-white/20 bg-slate-950/60 px-3 py-2 text-slate-100 shadow-inner focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              required
            >
              <option value="" disabled>Selecciona tu nombre...</option>
              {memberGroups.map(({ team, members }) => (
                <optgroup key={team.id} label={`Equipo ${team.teamNumber}`}>
                  {members.map((member) => (
                    <option key={member} value={member}>{member}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="submit"
                className="flex-1 rounded-full bg-cyan-500 px-4 py-2 text-center text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
              >
                Buscar equipo
              </button>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setSelectedMember('');
                  setStep('askGroup');
                }}
                className="flex-1 rounded-full border border-cyan-300/50 px-4 py-2 text-center text-sm font-semibold text-cyan-100 transition-colors hover:border-cyan-200 hover:text-cyan-50"
              >
                Volver
              </button>
            </div>
          </form>
        )}

        {step === 'teacherCode' && (
          <form onSubmit={handleTeacherCodeSubmit} className="space-y-4" noValidate>
            <p className="text-slate-200">Ingresa el codigo de acceso para docentes.</p>
            <label htmlFor="teacher-code" className="sr-only">Codigo de docente</label>
            <input
              id="teacher-code"
              type="password"
              value={teacherCodeInput}
              onChange={(event) => setTeacherCodeInput(event.target.value)}
              placeholder="Codigo de docente"
              className="w-full rounded-xl border border-white/20 bg-slate-950/60 px-3 py-2 text-slate-100 shadow-inner focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              autoComplete="off"
              required
            />
            {errorMessage && (
              <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-100">
                {errorMessage}
              </div>
            )}
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="submit"
                className="flex-1 rounded-full bg-cyan-500 px-4 py-2 text-center text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
              >
                Ingresar
              </button>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setTeacherCodeInput('');
                  setStep('askGroup');
                }}
                className="flex-1 rounded-full border border-cyan-300/50 px-4 py-2 text-center text-sm font-semibold text-cyan-100 transition-colors hover:border-cyan-200 hover:text-cyan-50"
              >
                Volver
              </button>
            </div>
          </form>
        )}

        {step === 'setTeamName' && foundTeam && (
          <form onSubmit={handleCreateProgress} className="space-y-4" noValidate>
            <p className="text-slate-200">Bienvenidos, Guardianes. Asi esta conformado su equipo:</p>
            <div className="rounded-xl border border-cyan-300/30 bg-cyan-500/10 p-4 text-sm text-cyan-100">
              <h2 className="font-semibold text-cyan-50">Integrantes</h2>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                {foundTeam.members.map((member) => (
                  <li key={member}>{member}</li>
                ))}
              </ul>
            </div>
            <label htmlFor="team-name" className="block text-sm font-semibold text-cyan-100">Elijan un nombre para su equipo</label>
            <input
              id="team-name"
              type="text"
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
              placeholder="Nombre del equipo"
              className="w-full rounded-xl border border-white/20 bg-slate-950/60 px-3 py-2 text-slate-100 shadow-inner focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              required
            />
            <button
              type="submit"
              className="w-full rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
            >
              Guardar y continuar
            </button>
          </form>
        )}

        {step === 'confirmTeam' && foundTeam && existingProgress && projectAssigned && (
          <div className="space-y-4">
            <p className="text-slate-200">Hola de nuevo. Confirma si este es tu equipo:</p>
            <div className="rounded-xl border border-cyan-300/30 bg-cyan-500/10 p-4 text-sm text-cyan-100">
              <h2 className="font-semibold text-cyan-50">{existingProgress.teamName}</h2>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                {foundTeam.members.map((member) => (
                  <li key={member}>{member}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/15 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Proyecto elegido</p>
              <h3 className="mt-1 text-lg font-semibold text-white">{projectAssigned.title}</h3>
              <p className="mt-2 text-sm text-cyan-100/80">{projectAssigned.mission}</p>
              <p className="mt-2 text-xs text-cyan-100/60">Para cambiar de proyecto necesita autorizacion del profesor.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleConfirmExistingTeam}
                className="flex-1 rounded-full bg-emerald-400 px-4 py-2 text-center text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
              >
                Si, continuar
              </button>
              <button
                type="button"
                onClick={() => {
                  setOverrideCodeInput('');
                  setOverrideError('');
                  setStep('unlockProject');
                }}
                className="flex-1 rounded-full border border-cyan-300/50 px-4 py-2 text-center text-sm font-semibold text-cyan-100 transition-colors hover:border-cyan-200 hover:text-cyan-50"
              >
                Cambiar proyecto
              </button>
              <button
                type="button"
                onClick={resetState}
                className="flex-1 rounded-full border border-slate-400/40 px-4 py-2 text-center text-sm font-semibold text-slate-100 transition-colors hover:border-slate-200/60 hover:text-white"
              >
                No es mi equipo
              </button>
            </div>
          </div>
        )}

        {step === 'unlockProject' && (
          <form onSubmit={handleUnlockProjectSubmit} className="space-y-4" noValidate>
            <p className="text-slate-200">Pide al profesor el codigo para seleccionar un nuevo proyecto. El progreso de misiones especiales se reiniciara.</p>
            <label htmlFor="override-code" className="sr-only">Codigo de autorizacion</label>
            <input
              id="override-code"
              type="password"
              value={overrideCodeInput}
              onChange={(event) => setOverrideCodeInput(event.target.value)}
              placeholder="Codigo de autorizacion"
              className="w-full rounded-xl border border-white/20 bg-slate-950/60 px-3 py-2 text-slate-100 shadow-inner focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              autoComplete="off"
              required
            />
            {overrideError && (
              <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-100">
                {overrideError}
              </div>
            )}
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="submit"
                className="flex-1 rounded-full bg-cyan-500 px-4 py-2 text-center text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
              >
                Desbloquear proyectos
              </button>
              <button
                type="button"
                onClick={() => {
                  setOverrideCodeInput('');
                  setOverrideError('');
                  setStep('confirmTeam');
                }}
                className="flex-1 rounded-full border border-cyan-300/50 px-4 py-2 text-center text-sm font-semibold text-cyan-100 transition-colors hover:border-cyan-200 hover:text-cyan-50"
              >
                Volver
              </button>
            </div>
          </form>
        )}

        {step === 'selectProject' && foundTeam && pendingProgress && (
          <form onSubmit={handleConfirmProjectSelection} className="space-y-4" noValidate>
            <p className="text-slate-200">Seleccionen el proyecto que trabajaran. Solo podran cambiarlo con autorizacion del profesor.</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {PROJECTS.map((project) => {
                const isSelected = selectedProjectId === project.id;
                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setErrorMessage('');
                    }}
                    className={`rounded-2xl border-2 p-4 text-left transition ${isSelected ? 'border-cyan-400 bg-cyan-500/10 shadow-lg' : 'border-white/15 bg-slate-950/40 hover:border-cyan-300/60 hover:bg-cyan-500/10'}`}
                    style={isSelected ? { borderColor: project.color } : undefined}
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Proyecto</p>
                    <h3 className="mt-1 text-lg font-semibold text-white">{project.title}</h3>
                    <p className="mt-2 text-sm text-cyan-100/80">{project.summary}</p>
                    <p className="mt-3 text-xs text-cyan-100/60">{project.mission}</p>
                    {isSelected && <p className="mt-3 inline-flex items-center rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-semibold text-cyan-100">Seleccionado</p>}
                  </button>
                );
              })}
            </div>
            {selectedProject && (
              <div className="rounded-xl border border-cyan-300/30 bg-cyan-500/10 p-4 text-sm text-cyan-100">
                <h4 className="text-sm font-semibold text-cyan-50">Mentor Aqua dice:</h4>
                <p className="mt-1 text-xs text-cyan-100/80">{selectedProject.mission}</p>
              </div>
            )}
            {errorMessage && (
              <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-100">
                {errorMessage}
              </div>
            )}
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="submit"
                className="flex-1 rounded-full bg-emerald-400 px-4 py-2 text-center text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
                disabled={!selectedProjectId}
              >
                Iniciar mision
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedProjectId('');
                  if (existingProgress && existingProgress.projectId) {
                    setStep('confirmTeam');
                  } else if (existingProgress) {
                    setStep('setTeamName');
                  } else {
                    setStep('setTeamName');
                  }
                }}
                className="flex-1 rounded-full border border-cyan-300/50 px-4 py-2 text-center text-sm font-semibold text-cyan-100 transition-colors hover:border-cyan-200 hover:text-cyan-50"
              >
                Volver
              </button>
            </div>
          </form>
        )}
      </div>
    </PageShell>
  );
};

export default LoginScreen;
