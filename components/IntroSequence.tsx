import React, { useEffect, useState } from 'react';

interface IntroSequenceProps {
  onComplete: () => void;
  durationMs?: number;
}

const DEFAULT_DURATION = 3500;

const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete, durationMs = DEFAULT_DURATION }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) {
      return;
    }
    const timeout = window.setTimeout(() => {
      setVisible(false);
      onComplete();
    }, durationMs);

    return () => window.clearTimeout(timeout);
  }, [durationMs, onComplete, visible]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-500 text-white p-6 text-center">
      <div className="max-w-xl space-y-4">
        <h1 className="text-3xl font-bold tracking-wide">Guardianes del Agua</h1>
        <p className="text-lg opacity-90">Preparate para una aventura donde las matematicas y la ciencia se unen para cuidar el recurso mas valioso.</p>
        <p className="text-sm uppercase tracking-[0.2em] opacity-75">Iniciando experiencia interactiva...</p>
        <button
          type="button"
          onClick={() => { setVisible(false); onComplete(); }}
          className="mt-4 inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/10"
        >
          Saltar introduccion
        </button>
      </div>
    </div>
  );
};

export default IntroSequence;
