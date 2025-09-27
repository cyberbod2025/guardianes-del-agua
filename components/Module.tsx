import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  ModuleContent,
  ModuleStatus,
  ModuleData,
  ModuleDataValue,
  FormField,
  FormInput,
  StoredFile,
  Team,
  TeamProgress,
} from '../types';
import {
  LockClosedIcon,
  CheckCircleIcon,
  WaterDropIcon,
  RocketIcon,
  TeamIcon,
  PlanIcon,
  ExperimentIcon,
} from './Icons';

interface ModuleProps {
  module: ModuleContent;
  status: ModuleStatus;
  team: Team;
  progress: TeamProgress;
  savedData: ModuleData | undefined;
  isFrozen: boolean;
  onComplete: (moduleId: number, data: ModuleData) => void;
  onSaveProgress: (moduleId: number, data: ModuleData) => void;
}

const ICONS: Record<string, React.FC<{ className?: string }>> = {
  TeamIcon,
  PlanIcon,
  WaterDropIcon,
  ExperimentIcon,
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001').replace(/\/$/, '');
const AI_ENDPOINT = '/api/ai/validate-question';

const ensureLeadingSlash = (value: string) => (value.startsWith('/') ? value : `/${value}`);

const buildFileUrl = (filePath: string) => {
  if (!filePath) {
    return filePath;
  }
  if (/^https?:/i.test(filePath)) {
    return filePath;
  }
  return `${API_BASE_URL}${ensureLeadingSlash(filePath)}`;
};

const isStoredFileMetadata = (value: ModuleDataValue): value is StoredFile => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  if (value instanceof File) {
    return false;
  }
  const candidate = value as Partial<StoredFile>;
  return typeof candidate.name === 'string' && typeof candidate.status === 'string';
};

const getAiFeedbackKey = (fieldId: string) => `${fieldId}__aiFeedback`;

const Module: React.FC<ModuleProps> = ({
  module,
  status,
  team,
  progress,
  savedData,
  isFrozen,
  onComplete,
  onSaveProgress,
}) => {
  const [formData, setFormData] = useState<ModuleData>(savedData || {});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiState, setAiState] = useState<Record<string, { loading: boolean; error: string | null }>>({});

  useEffect(() => {
    if (savedData) {
      setFormData(savedData);
    }
  }, [savedData]);

  const getInputFields = useCallback((content: FormField[]): FormInput[] => {
    return content.filter((field) =>
      field.type === 'text' ||
      field.type === 'textarea' ||
      field.type === 'checkbox' ||
      field.type === 'radio' ||
      field.type === 'select' ||
      field.type === 'file'
    ) as FormInput[];
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, name, value } = event.target;
    const fieldKey = name || id;
    if (!fieldKey) {
      return;
    }
    setFormData((prev) => ({ ...prev, [fieldKey]: value }));
    setError(null);
    setAiState((prev) => ({ ...prev, [fieldKey]: { loading: false, error: null } }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, name, value, checked } = event.target;
    const fieldKey = name || id;
    if (!fieldKey) {
      return;
    }
    const currentValues = (formData[fieldKey] as string[] | undefined) || [];
    const nextValues = checked
      ? (currentValues.includes(value) ? currentValues : [...currentValues, value])
      : currentValues.filter((option) => option !== value);
    setFormData((prev) => ({ ...prev, [fieldKey]: nextValues }));
    setError(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, name, files } = event.target;
    const fieldKey = name || id;
    if (!fieldKey) {
      return;
    }
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [fieldKey]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [fieldKey]: null }));
    }
    setError(null);
  };

  const handleSaveClick = () => {
    if (isFrozen) {
      return;
    }
    onSaveProgress(module.id, { ...formData });
  };

  const handleRequestAiFeedback = useCallback(async (field: FormInput) => {
    const currentValue = formData[field.id];
    if (typeof currentValue !== 'string' || currentValue.trim().length < 12) {
      setAiState((prev) => ({
        ...prev,
        [field.id]: {
          loading: false,
          error: 'Escribe una propuesta completa antes de pedir la opinión de Mentor Aqua.',
        },
      }));
      return;
    }

    setAiState((prev) => ({ ...prev, [field.id]: { loading: true, error: null } }));

    try {
      const response = await fetch(AI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: currentValue,
          aiTask: field.aiTask ?? 'researchQuestion',
          aiPrompt: field.aiPrompt,
          moduleId: module.id,
          moduleTitle: module.title,
          teamName: progress.teamName,
          groupId: team.groupId,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Mentor Aqua no pudo responder. Intenta más tarde.');
      }

      const feedback = payload?.feedback ?? {};
      const summary: string = feedback?.summary || feedback?.analysis || payload?.message || payload?.raw || 'Mentor Aqua no devolvió comentarios.';
      const suggestions: string[] = Array.isArray(feedback?.suggestions) ? feedback.suggestions : [];
      const combined = suggestions.length > 0
        ? `${summary.trim()}\n\nSugerencias de Mentor Aqua:\n${suggestions.map((item: string) => `• ${item}`).join('\n')}`
        : summary.trim();

      setFormData((prev) => ({
        ...prev,
        [getAiFeedbackKey(field.id)]: combined,
      }));

      setAiState((prev) => ({ ...prev, [field.id]: { loading: false, error: null } }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo obtener la retroalimentación.';
      setAiState((prev) => ({ ...prev, [field.id]: { loading: false, error: message } }));
    }
  }, [formData, module.id, module.title, progress.teamName, team.groupId]);

  const renderAiTools = (
    field: FormInput,
    aiStatus: { loading: boolean; error: string | null },
    aiFeedback: ModuleDataValue,
  ) => {
    if (!field.aiTask) {
      return null;
    }

    const feedbackText = typeof aiFeedback === 'string' ? aiFeedback : '';

    return (
      <div className="space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => handleRequestAiFeedback(field)}
            disabled={aiStatus.loading || isFrozen}
            className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-600"
          >
            {aiStatus.loading ? 'Mentor Aqua está pensando...' : 'Pedir ayuda a Mentor Aqua'}
          </button>
          {aiStatus.error && (
            <span className="text-xs text-rose-300">{aiStatus.error}</span>
          )}
        </div>
        {feedbackText && (
          <div className="rounded-xl border border-cyan-400/30 bg-slate-900/60 p-3 text-sm text-cyan-100 whitespace-pre-wrap">
            <p className="font-semibold text-cyan-200">Mentor Aqua comenta:</p>
            <p className="mt-1 text-cyan-100/90">{feedbackText}</p>
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isFrozen) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const updatedFormData: ModuleData = { ...formData };
    const fileFields = getInputFields(module.content).filter((field) => field.type === 'file');

    try {
      for (const field of fileFields) {
        const value = formData[field.id];
        if (value instanceof File) {
          const payload = new FormData();
          payload.append('file', value);

          const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            body: payload,
          });

          if (!response.ok) {
            throw new Error(`No se pudo subir el archivo ${value.name}.`);
          }

          const result = (await response.json()) as { filePath?: string };
          const stored: StoredFile = {
            name: value.name,
            size: value.size,
            mimeType: value.type,
            url: result.filePath ? buildFileUrl(result.filePath) : undefined,
            status: result.filePath ? 'uploaded' : 'pending',
          };
          updatedFormData[field.id] = stored;
        }
      }

      onComplete(module.id, updatedFormData);
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : 'No se pudo completar el módulo.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const isCompletable = useMemo(() => {
    if (isFrozen) {
      return false;
    }
    const inputFields = getInputFields(module.content);
    return inputFields.every((field) => {
      const value = formData[field.id];
      if (field.type === 'checkbox') {
        return Array.isArray(value) && value.length > 0;
      }
      if (field.type === 'radio') {
        return typeof value === 'string' && value.length > 0;
      }
      if (field.type === 'file') {
        return Boolean(value);
      }
      if (field.required === false) {
        return true;
      }
      return typeof value === 'string' ? value.trim().length > 0 : Boolean(value);
    });
  }, [formData, getInputFields, isFrozen, module.content]);

  const renderField = (field: FormField) => {
    if (field.type === 'header') {
      return (
        <h3 key={field.id} className="text-lg font-semibold text-cyan-200/90">
          {field.text}
        </h3>
      );
    }

    if (field.type === 'info') {
      return (
        <p key={field.id} className="text-sm text-cyan-100/70">
          {field.text}
        </p>
      );
    }

    const inputField = field as FormInput;
    const value = formData[inputField.id] ?? '';
    const feedback = formData[getAiFeedbackKey(inputField.id)];
    const aiStatus = aiState[inputField.id] ?? { loading: false, error: null };

    const label = (
      <label htmlFor={inputField.id} className="block text-sm font-semibold text-cyan-100">
        {inputField.label}
      </label>
    );

    const inputClasses = 'mt-1 w-full rounded-xl border border-cyan-400/30 bg-slate-950/60 px-3 py-2 text-sm text-cyan-50 shadow-inner focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40';

    switch (inputField.type) {
      case 'text':
        return (
          <div key={inputField.id} className="space-y-2">
            {label}
            <input
              id={inputField.id}
              type="text"
              value={typeof value === 'string' ? value : ''}
              onChange={handleInputChange}
              placeholder={inputField.placeholder}
              className={inputClasses}
              disabled={isFrozen}
            />
            {renderAiTools(inputField, aiStatus, feedback)}
          </div>
        );
      case 'textarea':
        return (
          <div key={inputField.id} className="space-y-2">
            {label}
            <textarea
              id={inputField.id}
              value={typeof value === 'string' ? value : ''}
              onChange={handleInputChange}
              placeholder={inputField.placeholder}
              rows={4}
              className={`${inputClasses} min-h-[120px]`}
              disabled={isFrozen}
            />
            {renderAiTools(inputField, aiStatus, feedback)}
          </div>
        );
      case 'select': {

        const optionValues = inputField.optionsSource === 'teamMembers'

          ? team.members

          : inputField.options ?? [];

        return (

          <div key={inputField.id} className="space-y-2">

            {label}

            <select

              id={inputField.id}

              value={typeof value === 'string' ? value : ''}

              onChange={handleInputChange}

              className={inputClasses}

              disabled={isFrozen}

            >

              <option value="" disabled>

                {inputField.placeholder ?? 'Selecciona una opcion'}

              </option>

              {optionValues.map((option, index) => (

                <option key={index} value={option}>

                  {option}

                </option>

              ))}

            </select>

          </div>

        );

      }

      case 'radio':
        return (
          <fieldset key={inputField.id} className="space-y-2">
            <legend className="text-sm font-semibold text-cyan-100">
              {inputField.label}
            </legend>
            <div className="flex flex-wrap gap-3">
              {inputField.options?.map((option, index) => {
                const optionId = `${inputField.id}-${index}`;
                return (
                  <div key={optionId} className="flex items-center gap-2 text-sm text-cyan-100/80">
                    <input
                      id={optionId}
                      type="radio"
                      name={inputField.id}
                      value={option}
                      checked={value === option}
                      onChange={handleInputChange}
                      disabled={isFrozen}
                    />
                    <label htmlFor={optionId} className="cursor-pointer">
                      {option}
                    </label>
                  </div>
                );
              })}
            </div>
          </fieldset>
        );

      case 'checkbox':
        return (
          <fieldset key={inputField.id} className="space-y-2">
            <legend className="text-sm font-semibold text-cyan-100">
              {inputField.label}
            </legend>
            <div className="flex flex-wrap gap-3">
              {inputField.options?.map((option, index) => {
                const optionId = `${inputField.id}-${index}`;
                const selected = Array.isArray(value) ? value.includes(option) : false;
                return (
                  <div key={optionId} className="flex items-center gap-2 text-sm text-cyan-100/80">
                    <input
                      id={optionId}
                      type="checkbox"
                      name={inputField.id}
                      value={option}
                      checked={selected}
                      onChange={handleCheckboxChange}
                      disabled={isFrozen}
                    />
                    <label htmlFor={optionId} className="cursor-pointer">
                      {option}
                    </label>
                  </div>
                );
              })}
            </div>
          </fieldset>
        );

      case 'file':
        return (
          <div key={inputField.id} className="space-y-2">
            {label}
            <input
              id={inputField.id}
              type="file"
              onChange={handleFileChange}
              className="block text-sm text-cyan-100/80 file:mr-4 file:rounded-md file:border-0 file:bg-cyan-500/20 file:px-3 file:py-2 file:text-cyan-100 hover:file:bg-cyan-500/40"
              disabled={isFrozen}
            />
            {value && typeof value === 'object' && !(value instanceof File) && isStoredFileMetadata(value) && (
              <p className="text-xs text-cyan-200/80">
                Archivo guardado: {value.name}{' '}
                {value.url ? (
                  <a
                    href={value.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-300 underline"
                  >
                    Ver archivo
                  </a>
                ) : (
                  <span className="italic">(pendiente de subir)</span>
                )}
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const ModuleIcon = ICONS[module.icon] || WaterDropIcon;

  return (
    <div className={`rounded-2xl border transition duration-300 ${status === 'ACTIVE' ? 'border-cyan-500/40 bg-slate-900/50 shadow-xl' : status === 'COMPLETED' ? 'border-emerald-400/30 bg-slate-900/40' : 'border-slate-700/40 bg-slate-900/20 opacity-80'}`}>
      <div className="flex items-center justify-between border-b border-slate-700/40 px-6 py-4">
        <div className="flex items-center gap-3">
          <ModuleIcon className="h-9 w-9 text-cyan-300" />
          <div>
            <h2 className="text-xl font-semibold text-white">{module.title}</h2>
            <p className="text-sm text-cyan-100/70">{module.description}</p>
          </div>
        </div>
        {status === 'LOCKED' && <LockClosedIcon className="h-6 w-6 text-slate-500" />}
        {status === 'COMPLETED' && <CheckCircleIcon className="h-7 w-7 text-emerald-400" />}
      </div>

      {status !== 'LOCKED' && (
        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {module.content.map((field) => renderField(field))}

            {error && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
                {error}
              </div>
            )}

            {!isFrozen && (
              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleSaveClick}
                  className="text-sm font-semibold text-cyan-200 hover:text-white"
                >
                  Guardar avance
                </button>
                <button
                  type="submit"
                  disabled={!isCompletable || isLoading}
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 shadow transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-600"
                >
                  {isLoading ? 'Subiendo evidencias...' : (<><RocketIcon className="h-4 w-4" />Completar misión</>)}
                </button>
              </div>
            )}

            {isFrozen && (
              <p className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-100">
                Este módulo está congelado porque Mentor Aqua espera la luz verde del profesor.
              </p>
            )}
          </form>
        </div>
      )}

      {status === 'COMPLETED' && savedData && (
        <div className="space-y-4 border-t border-slate-700/40 px-6 py-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200/80">Respuestas guardadas</h3>
          {getInputFields(module.content).map((field) => {
            const value = savedData[field.id];
            const feedbackValue = savedData[getAiFeedbackKey(field.id)];
            return (
              <div key={field.id} className="space-y-2 rounded-xl border border-slate-700/40 bg-slate-900/40 p-4">
                <p className="text-sm font-semibold text-white">{field.label}</p>
                <p className="whitespace-pre-wrap text-sm text-cyan-100/80">
                  {Array.isArray(value)
                    ? value.join(', ')
                    : value instanceof File
                    ? value.name
                    : isStoredFileMetadata(value)
                    ? (
                        value.url ? (
                          <a
                            href={value.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-300 underline"
                          >
                            {value.name} (ver archivo)
                          </a>
                        ) : (
                          `${value.name} (archivo pendiente)`
                        )
                      )
                    : typeof value === 'string' && (value.startsWith('/') || value.startsWith('http'))
                    ? (
                        <a
                          href={buildFileUrl(value)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-300 underline"
                        >
                          Ver archivo
                        </a>
                      )
                    : value != null && value !== ''
                    ? String(value)
                    : 'Sin respuesta'}
                </p>
                {typeof feedbackValue === 'string' && feedbackValue.trim().length > 0 && (
                  <div className="rounded-lg border border-cyan-400/30 bg-slate-900/60 p-3 text-sm text-cyan-100 whitespace-pre-wrap">
                    <p className="font-semibold text-cyan-200">Mentor Aqua comenta:</p>
                    <p className="mt-1 text-cyan-100/90">{feedbackValue}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Module;

