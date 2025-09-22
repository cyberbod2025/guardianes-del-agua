import React, { useState } from 'react';
import type { ModuleContent, ModuleStatus, ModuleData } from '../types';
import { LockClosedIcon, CheckCircleIcon, WaterDropIcon, RocketIcon, SparklesIcon } from './Icons';

interface ModuleProps {
  module: ModuleContent;
  status: ModuleStatus;
  savedData: ModuleData | undefined;
  onComplete: (moduleId: number, data: ModuleData) => void;
}

const Module: React.FC<ModuleProps> = ({ module, status, savedData, onComplete }) => {
  const [formData, setFormData] = useState<ModuleData>(savedData || {});
  const [isLoading, setIsLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{ isSufficient: boolean, feedback: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setAiFeedback(null); // Clear feedback when user starts editing
    setError(null); // Clear error when user starts editing
  };

  const getAIFeedback = async () => {
    setIsLoading(true);
    setAiFeedback(null);
    setError(null);

    try {
      // Safely check for API key in a browser environment
      const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined;

      if (!apiKey) {
        setError("Error de configuración: La clave API de Google (API_KEY) no se ha proporcionado. El administrador debe configurar esta variable de entorno para que Mentor Aqua pueda funcionar.");
        setIsLoading(false);
        return;
      }

      // Dynamically import the genai library to prevent load-time errors
      const { GoogleGenAI, Type } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      
      const userAnswers = module.tasks.map(task => `${task.label}\n${formData[task.id] || '(Sin respuesta)'}`).join('\n\n');
      const prompt = `
        Actúa como "Mentor Aqua", un asistente de IA experto y motivador para estudiantes de secundaria en un proyecto STEAM sobre el agua.

        **Contexto del Proyecto:**
        Los estudiantes están en el Módulo ${module.id}: "${module.title}".
        El objetivo de este módulo es: "${module.description}".

        **Respuestas del Estudiante:**
        ${userAnswers}

        **Tu Misión:**
        1. Evalúa si las respuestas del estudiante demuestran un esfuerzo razonable y están en la dirección correcta para su nivel (1º-2º de secundaria). No busques perfección, sino comprensión y compromiso.
        2. Proporciona feedback constructivo y motivador usando un tono socrático (haciendo preguntas que guíen).
        3. Decide si el esfuerzo es suficiente para desbloquear el siguiente módulo.

        **Formato de Respuesta Obligatorio:**
        Responde EXCLUSIVAMENTE con un objeto JSON que siga este esquema. No incluyas texto antes o después del JSON.
      `;

      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                    isSufficient: { type: Type.BOOLEAN },
                    feedback: { type: Type.STRING },
                },
                required: ['isSufficient', 'feedback'],
              },
          },
      });

      const result = JSON.parse(response.text);
      setAiFeedback(result);

      if (result.isSufficient) {
        setTimeout(() => {
          onComplete(module.id, formData);
        }, 2000); // Wait 2 seconds for user to read positive feedback
      }
    } catch (e) {
      console.error(e);
      setError("Hubo un error al contactar a Mentor Aqua. Por favor, revisa tu conexión e intenta de nuevo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getAIFeedback();
  };
  
  const isCompletable = module.tasks.every(task => formData[task.id] && formData[task.id].trim() !== '');

  const getStatusColorClasses = () => {
    switch(status) {
      case 'COMPLETED': return 'border-[#28A745] bg-green-50';
      case 'ACTIVE': return 'border-[#007BFF] bg-white shadow-md';
      case 'LOCKED': return 'border-gray-300 bg-gray-100 opacity-70';
    }
  }

  return (
    <div className={`transition-all duration-500 ease-in-out border-l-4 p-6 rounded-lg ${getStatusColorClasses()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <WaterDropIcon className={`h-8 w-8 text-[#007BFF] ${status !== 'ACTIVE' && 'opacity-50'}`}/>
          <h2 className="text-xl font-bold uppercase text-gray-700">{module.title}</h2>
        </div>
        {status === 'LOCKED' && <LockClosedIcon className="h-6 w-6 text-gray-400" />}
        {status === 'COMPLETED' && <CheckCircleIcon className="h-8 w-8 text-green-500" />}
      </div>
      
      {status !== 'LOCKED' && (
        <div className={`mt-4 transition-all duration-500 ease-in-out ${status === 'ACTIVE' ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <p className="text-gray-600 mb-6 text-lg">{module.description}</p>

          <div className="space-y-4 mb-8 bg-[#FFC107]/20 border border-[#FFC107]/50 p-4 rounded-md">
              <h3 className="font-bold text-yellow-800 flex items-center">
                <span className="text-2xl mr-2">🤖</span>
                Mentor Aqua dice:
              </h3>
              {module.mentorPrompts.map((prompt, index) => (
                  <p key={index} className="text-yellow-900 italic">"{prompt}"</p>
              ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {module.tasks.map((task) => (
              <div key={task.id}>
                <label htmlFor={task.id} className="block text-sm font-medium text-gray-700 mb-1">{task.label}</label>
                <textarea
                  id={task.id}
                  rows={4}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#007BFF] focus:ring-[#007BFF] sm:text-sm p-2"
                  placeholder={task.placeholder}
                  value={formData[task.id] || ''}
                  onChange={handleInputChange}
                  required
                />
                {task.type === 'file-description' && <p className="mt-2 text-xs text-gray-500">Sube tu boceto a la carpeta compartida y describe aquí lo que dibujaste.</p>}
              </div>
            ))}
            
            {aiFeedback && (
              <div className={`p-4 rounded-md flex items-start space-x-3 ${aiFeedback.isSufficient ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <SparklesIcon className="h-6 w-6 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold">Feedback de Mentor Aqua:</h4>
                  <p className="text-sm">{aiFeedback.feedback}</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="p-4 rounded-md bg-red-100 text-red-800">
                <p>{error}</p>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={!isCompletable || isLoading}
                className="inline-flex items-center gap-x-2 px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#007BFF] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007BFF] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? 'Analizando...' : <> <RocketIcon className="h-5 w-5"/> Completar y Validar </>}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {status === 'COMPLETED' && (
         <div className="mt-4 p-4 bg-white rounded-md border border-gray-200">
           {Object.entries(savedData || {}).map(([key, value]) => (
              <div key={key} className="mb-2">
                <p className="text-sm font-semibold text-gray-800 capitalize">{module.tasks.find(t => t.id === key)?.label}</p>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{value}</p>
              </div>
            ))}
         </div>
      )}
    </div>
  );
};

export default Module;