import React, { useState, useEffect } from 'react';
import { Team, TeamProgress } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { WaterDropIcon, SparklesIcon } from './Icons';

// Define the structure of the database
interface Database {
  [group: string]: Team[];
}

interface LoginScreenProps {
  onLogin: (team: Team, progress: TeamProgress) => void;
}

type Step = 'askGroup' | 'askName' | 'setTeamName' | 'confirmTeam' | 'error';

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [step, setStep] = useState<Step>('askGroup');
  const [db, setDb] = useState<Database | null>(null);
  const [groups, setGroups] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [leaderName, setLeaderName] = useState('');
  const [foundTeam, setFoundTeam] = useState<Team | null>(null);
  const [teamName, setTeamName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [progress, setProgress] = useLocalStorage<TeamProgress | null>('team-progress', null);

  // Fetch database on component mount
  useEffect(() => {
    fetch('/database.json')
      .then((res) => res.json())
      .then((data: Database) => {
        setDb(data);
        setGroups(Object.keys(data));
      })
      .catch(err => {
        console.error("Failed to load database.json", err);
        setStep('error');
        setErrorMessage('No se pudo cargar la base de datos de equipos. Por favor, contacta al administrador.');
      });
  }, []);

  const handleGroupSelect = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGroup) {
      setStep('askName');
    }
  };

  const handleFindTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !selectedGroup || !leaderName) return;

    const teamsInGroup = db[selectedGroup];
    const team = teamsInGroup.find(t => 
      t.members.some(member => member.toLowerCase().trim() === leaderName.toLowerCase().trim())
    );

    if (team) {
      setFoundTeam(team);
      // Check localStorage for existing progress for this team
      const savedProgress = localStorage.getItem(`progress-${team.id}`);
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        setTeamName(parsedProgress.teamName || '');
        setStep('confirmTeam');
      } else {
        setStep('setTeamName');
      }
    } else {
      setErrorMessage('No se encontró ningún equipo con ese nombre de líder en el grupo seleccionado. Revisa el nombre y el grupo.');
    }
  };

  const handleSetTeamName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundTeam || !teamName) return;

    const newProgress: TeamProgress = {
      teamId: foundTeam.id,
      teamName: teamName,
      completedModules: 0,
      data: {},
    };
    localStorage.setItem(`progress-${foundTeam.id}`, JSON.stringify(newProgress));
    onLogin(foundTeam, newProgress);
  };

  const handleConfirmTeam = () => {
    if (!foundTeam) return;
    const savedProgress = localStorage.getItem(`progress-${foundTeam.id}`);
    if (savedProgress) {
      onLogin(foundTeam, JSON.parse(savedProgress));
    }
  };

  const handleGoBack = () => {
    setStep('askGroup');
    setSelectedGroup('');
    setLeaderName('');
    setFoundTeam(null);
    setTeamName('');
    setErrorMessage('');
  };

  const renderStep = () => {
    switch (step) {
      case 'askGroup':
        return (
          <form onSubmit={handleGroupSelect} className="space-y-4">
            <p>¡Hola! Soy Mentor Aqua. Para empezar, por favor, selecciona tu grupo.</p>
            <select 
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="" disabled>Elige tu grupo...</option>
              {groups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Siguiente</button>
          </form>
        );

      case 'askName':
        return (
          <form onSubmit={handleFindTeam} className="space-y-4">
            <p>¡Excelente! Ahora, escribe el nombre completo del líder de tu equipo.</p>
            <input 
              type="text"
              value={leaderName}
              onChange={(e) => setLeaderName(e.target.value)}
              placeholder="Nombre y Apellido del Líder"
              className="w-full p-2 border rounded-md"
              required
            />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Buscar Equipo</button>
            <button type="button" onClick={handleGoBack} className="w-full text-sm text-gray-600 hover:underline">Volver</button>
          </form>
        );

      case 'setTeamName':
        return (
          <form onSubmit={handleSetTeamName} className="space-y-4">
            <p>¡Equipo encontrado! Veo que es la primera vez que ingresan. ¡Bienvenidos, Guardianes del Agua!</p>
            <div className="p-4 bg-blue-50 rounded-md"> 
              <h3 className="font-bold">Integrantes:</h3>
              <ul className="list-disc list-inside">
                {foundTeam?.members.map(m => <li key={m}>{m}</li>)}
              </ul>
            </div>
            <p>Por favor, elijan un nombre creativo para su equipo.</p>
            <input 
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Nombre del Equipo"
              className="w-full p-2 border rounded-md"
              required
            />
            <button type="submit" className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600">Guardar y Empezar</button>
          </form>
        );

      case 'confirmTeam':
        return (
          <div className="space-y-4">
            <p>¡Hola de nuevo! Encontré este equipo, ¿es el tuyo?</p>
            <div className="p-4 bg-blue-50 rounded-md">
              <h3 className="font-bold">Nombre del Equipo: {teamName}</h3>
              <h4 className="font-semibold mt-2">Integrantes:</h4>
              <ul className="list-disc list-inside">
                {foundTeam?.members.map(m => <li key={m}>{m}</li>)}
              </ul>
            </div>
            <button onClick={handleConfirmTeam} className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600">Sí, continuar</button>
            <button onClick={handleGoBack} className="w-full text-sm text-gray-600 hover:underline mt-2">No, este no es mi equipo</button>
          </div>
        );

      case 'error':
        return <p className="text-red-500">{errorMessage}</p>

      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
            <SparklesIcon className="mx-auto h-12 w-12 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-800">Guardianes del Agua</h1>
        </div>
        <div className="text-gray-700">
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
