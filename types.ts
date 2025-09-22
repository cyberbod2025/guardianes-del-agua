
import React from 'react';

export interface Task {
  id: string;
  label: string;
  type: 'textarea' | 'text' | 'file-description';
  placeholder: string;
}

export interface ModuleContent {
  id: number;
  title: string;
  description: string;
  mentorPrompts: string[];
  tasks: Task[];
  icon: React.ComponentType<{ className?: string }>;
}

export type ModuleStatus = 'LOCKED' | 'ACTIVE' | 'COMPLETED';

export interface ModuleData {
  [key: string]: string;
}

export interface TeamProgress {
  completedModules: number;
  data: { [moduleId: number]: ModuleData };
}
