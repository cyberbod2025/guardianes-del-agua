import React, { useState } from 'react';
import type { ModuleContent, ModuleStatus, ModuleData, FormField, FormInput } from '../types';
import { LockClosedIcon, CheckCircleIcon, WaterDropIcon, RocketIcon, SparklesIcon, TeamIcon, PlanIcon } from './Icons';

interface ModuleProps {
  module: ModuleContent;
  status: ModuleStatus;
  savedData: ModuleData | undefined;
  onComplete: (moduleId: number, data: ModuleData) => void;
}

const ICONS: { [key: string]: React.FC<{className?: string}> } = {
  TeamIcon,
  PlanIcon,
  WaterDropIcon,
};

const Module: React.FC<ModuleProps> = ({ module, status, savedData, onComplete }) => {
  const [formData, setFormData] = useState<ModuleData>(savedData || {});
  const [isLoading, setIsLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{ isSufficient: boolean, feedback: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setAiFeedback(null);
    setError(null);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, checked } = e.target;
    const currentValues = (formData[id] as string[] | undefined) || [];
    if (checked) {
      setFormData((prev) => ({ ...prev, [id]: [...currentValues, value] }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: currentValues.filter((v) => v !== value) }));
    }
    setAiFeedback(null);
    setError(null);
  };

  const getInputFields = (content: FormField[]): FormInput[] => {
    return content.filter(field => 
      field.type === 'text' || 
      field.type === 'textarea' || 
      field.type === 'checkbox' || 
      field.type === 'radio' || 
      field.type === 'select'
    ) as FormInput[];
  }

  const getAIFeedback = async () => {
    setIsLoading(true);
    setAiFeedback(null);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setError("Error de configuración: La clave API de Google (VITE_GEMINI_API_KEY) no se ha proporcionado en el archivo .env. El administrador debe configurar esta variable de entorno para que Mentor Aqua pueda funcionar.");
        setIsLoading(false);
        return;
      }

      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});

      const inputFields = getInputFields(module.content);
      const userAnswers = inputFields.map(field => {
        const answer = formData[field.id];
        const formattedAnswer = Array.isArray(answer) ? answer.join(', ') : answer;
        return `${field.label}\n${formattedAnswer || '(Sin respuesta)'}`;
      }).join('\n\n');

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
        Responde EXCLUSIVAMENTE con un objeto JSON que siga este esquema: { "isSufficient": boolean, "feedback": "string" }. No incluyas texto, saltos de línea, ni markdown antes o después del JSON.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanedJson = text.replace(/\`\`\`json|\`\`\`/g, '').trim();
      const resultJson = JSON.parse(cleanedJson);
      
      setAiFeedback(resultJson);

      if (resultJson.isSufficient) {
        setTimeout(() => {
          onComplete(module.id, formData);
        }, 2000); 
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

  const isCompletable = () => {
    const inputFields = getInputFields(module.content);
    return inputFields.every(field => {
      const value = formData[field.id];
      if (field.type === 'checkbox') {
        return Array.isArray(value) && value.length > 0;
      }
      return value && (value as string).trim() !== '';
    });
  }

  const renderField = (field: FormField) => {
    // ... (renderField implementation remains the same)
    switch (field.type) {
      case 'header':
        return <h3 key={field.id} className="text-lg font-semibold text-gray-800 mt-6 mb-2 border-b pb-2">{field.text}</h3>;
      case 'info':
        return <p key={field.id} className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">{field.text}</p>;
      case 'text':
        return (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <input
              type="text"
              id={field.id}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#007BFF] focus:ring-[#007BFF] sm:text-sm p-2"
              placeholder={field.placeholder}
              value={(formData[field.id] as string) || ''}
              onChange={handleInputChange}
              required
            />
          </div>
        );
      case 'textarea':
        return (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <textarea
              id={field.id}
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#007BFF] focus:ring-[#007BFF] sm:text-sm p-2"
              placeholder={field.placeholder}
              value={(formData[field.id] as string) || ''}
              onChange={handleInputChange}
              required
            />
          </div>
        );
      case 'checkbox':
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
            <div className="space-y-2">
              {field.options?.map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    id={`${field.id}-${option}`}
                    name={field.id}
                    type="checkbox"
                    value={option}
                    className="h-4 w-4 rounded border-gray-300 text-[#007BFF] focus:ring-[#007BFF]"
                    onChange={handleCheckboxChange}
                    checked={((formData[field.id] as string[]) || []).includes(option)}
                  />
                  <label htmlFor={`${field.id}-${option}`} className="ml-3 block text-sm text-gray-700">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      case 'radio':
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
            <div className="space-y-2">
              {field.options?.map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    id={`${field.id}-${option}`}
                    name={field.id}
                    type="radio"
                    value={option}
                    className="h-4 w-4 border-gray-300 text-[#007BFF] focus:ring-[#007BFF]"
                    onChange={handleInputChange}
                    checked={formData[field.id] === option}
                  />
                  <label htmlFor={`${field.id}-${option}`} className="ml-3 block text-sm text-gray-700">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      case 'select':
        return (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <select
              id={field.id}
              name={field.id}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#007BFF] focus:outline-none focus:ring-[#007BFF] sm:text-sm"
              value={(formData[field.id] as string) || ''}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Selecciona una opción</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusColorClasses = () => {
    switch(status) {
      case 'COMPLETED': return 'border-[#28A745] bg-green-50';
      case 'ACTIVE': return 'border-[#007BFF] bg-white shadow-md';
      case 'LOCKED': return 'border-gray-300 bg-gray-100 opacity-70';
    }
  }
  
  const ModuleIcon = ICONS[module.icon] || WaterDropIcon;

  return (
    <div className={`transition-all duration-500 ease-in-out border-l-4 p-6 rounded-lg ${getStatusColorClasses()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ModuleIcon className={`h-8 w-8 text-[#007BFF] ${status !== 'ACTIVE' && 'opacity-50'}`}/>
          <h2 className="text-xl font-bold uppercase text-gray-700">{module.title}</h2>
        </div>
        {status === 'LOCKED' && <LockClosedIcon className="h-6 w-6 text-gray-400" />}
        {status === 'COMPLETED' && <CheckCircleIcon className="h-8 w-8 text-green-500" />}
      </div>
      
      {status !== 'LOCKED' && (
        <div className={`mt-4 transition-all duration-500 ease-in-out ${status === 'ACTIVE' ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <p className="text-gray-600 mb-6 text-lg">{module.description}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {module.content.map((field) => renderField(field))}
            
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
                disabled={!isCompletable() || isLoading}
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
           {getInputFields(module.content).map((field) => {
              const value = savedData?.[field.id];
              return (
                <div key={field.id} className="mb-2">
                  <p className="text-sm font-semibold text-gray-800 capitalize">{field.label}</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {Array.isArray(value) ? value.join(', ') : value}
                  </p>
                </div>
              )
            })}
         </div>
      )}
    </div>
  );
};

export default Module;
