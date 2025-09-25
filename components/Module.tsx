import React, { useState } from 'react';
import type { ModuleContent, ModuleStatus, ModuleData, FormField, FormInput } from '../types';
import { LockClosedIcon, CheckCircleIcon, WaterDropIcon, RocketIcon, SparklesIcon, TeamIcon, PlanIcon, ExperimentIcon } from './Icons';

interface ModuleProps {
  module: ModuleContent;
  status: ModuleStatus;
  savedData: ModuleData | undefined;
  onComplete: (moduleId: number, data: ModuleData) => void;
  onSaveProgress: (moduleId: number, data: ModuleData) => void;
}

const ICONS: { [key: string]: React.FC<{className?: string}> } = {
  TeamIcon,
  PlanIcon,
  WaterDropIcon,
  ExperimentIcon,
};

const Module: React.FC<ModuleProps> = ({ module, status, savedData, onComplete, onSaveProgress }) => {
  const [formData, setFormData] = useState<ModuleData>(savedData || {});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
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
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [id]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: null }));
    }
    setError(null);
  };

  const handleSaveClick = () => {
    onSaveProgress(module.id, formData);
  };

  const getInputFields = (content: FormField[]): FormInput[] => {
    return content.filter(field => 
      field.type === 'text' || 
      field.type === 'textarea' || 
      field.type === 'checkbox' || 
      field.type === 'radio' || 
      field.type === 'select' ||
      field.type === 'file'
    ) as FormInput[];
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const updatedFormData = { ...formData };
    const fileFields = getInputFields(module.content).filter(f => f.type === 'file');

    try {
      // Upload files first
      for (const field of fileFields) {
        const file = formData[field.id];
        if (file instanceof File) {
          const formDataForUpload = new FormData();
          formDataForUpload.append('file', file);

          const response = await fetch('http://localhost:3001/upload', {
            method: 'POST',
            body: formDataForUpload,
          });

          if (!response.ok) {
            throw new Error(`Error al subir el archivo: ${file.name}`);
          }

          const result = await response.json();
          updatedFormData[field.id] = result.filePath; // Replace file with path
        }
      }

      // Once all files are uploaded and paths are updated, complete the module
      onComplete(module.id, updatedFormData);

    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Ocurrió un error al subir los archivos.");
    } finally {
      setIsLoading(false);
    }
  };

  const isCompletable = () => {
    const inputFields = getInputFields(module.content);
    return inputFields.every(field => {
      const value = formData[field.id];
      if (field.type === 'checkbox') {
        return Array.isArray(value) && value.length > 0;
      }
      if (field.type === 'file') {
        return value instanceof File;
      }
      return value && String(value).trim() !== '';
    });
  }

  const renderField = (field: FormField) => {
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
      case 'file':
        const file = formData[field.id];
        return (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <input
              type="file"
              id={field.id}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleFileChange}
              required
            />
            {file instanceof File && <p className="text-xs text-gray-500 mt-1">Archivo seleccionado: {file.name}</p>}
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
            
            {error && (
              <div className="p-4 rounded-md bg-red-100 text-red-800">
                <p>{error}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-x-4 pt-4">
               <button
                type="button"
                onClick={handleSaveClick}
                className="text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Guardar Progreso
              </button>
              <button
                type="submit"
                disabled={!isCompletable() || isLoading}
                className="inline-flex items-center gap-x-2 px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#007BFF] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007BFF] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? 'Subiendo y Validando...' : <> <RocketIcon className="h-5 w-5"/> Completar y Validar </>}
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
                    {Array.isArray(value) ? value.join(', ') : (typeof value === 'string' && value.startsWith('/uploads') ? <a href={`http://localhost:3001${value}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Ver archivo</a> : String(value))}
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
