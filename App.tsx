import React, { useState, useEffect } from 'react';
import './style.css';
import LoginScreen from './components/LoginScreen';
import ProjectJourney from './components/ProjectJourney';
import IntroSequence from './components/IntroSequence';
import { TeamInfo, Database } from './types';

function App() {
  // ESTADO INICIAL CORRECTO Y VERIFICADO
  const [appState, setAppState] = useState<'intro' | 'login' | 'projectJourney'>('intro');
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
  
  const [database, setDatabase] = useState<Database | null>(null);
  const [error, setError] = useState<string>('');

  // "ESPÍA" PARA VER EL CAMBIO DE ESTADO EN LA CONSOLA
  useEffect(() => {
    console.log(`✅ El estado de la aplicación ha cambiado a: ${appState}`);
  }, [appState]);

  // Cargar la base de datos
  useEffect(() => {
    fetch('http://localhost:3001/api/database')
      .then(response => response.json())
      .then(data => setDatabase(data))
      .catch(err => {
        console.error("Error cargando la base de datos:", err);
        setError("Error de Conexión: No se pudo conectar con el servidor.");
      });
  }, []);

  const handleLogin = (group: string, teamIdentifier: string) => {
    if (!database) return;

    const foundTeam: TeamInfo = {
      group: group,
      team: teamIdentifier,
      members: database.grupos[group].equipos[teamIdentifier]
    };
    
    setTeamInfo(foundTeam);
    setAppState('projectJourney');
  };

  const handleLogout = () => {
    setTeamInfo(null);
    setAppState('login');
  };

  const renderContent = () => {
    if (error) return <div className="error-message">{error}</div>;
    if (!database) return <div>Cargando base de datos...</div>;

    switch (appState) {
      case 'intro':
        return <IntroSequence onComplete={() => setAppState('login')} />;
      case 'login':
        return <LoginScreen onLogin={handleLogin} database={database} />;
      case 'projectJourney':
        return teamInfo ? (
          <ProjectJourney
            teamInfo={teamInfo}
            onLogout={handleLogout}
            database={database}
          />
        ) : null;
      default:
        return <div>Cargando...</div>;
    }
  };

  return (
    <div className="app-container">
      <div className="ocean">
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      <main>{renderContent()}</main>
    </div>
  );
}

export default App;