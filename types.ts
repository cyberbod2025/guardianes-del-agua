import React from 'react';

// Defines the structure for a single field in a module form
export type FormField = FormInput | FormDisplay;

// Represents fields that are for display purposes only (not user input)
export interface FormDisplay {
  id: string;
  type: 'header' | 'info';
  text: string;
}

// Represents fields that require user input
export interface FormInput {
  id: string;
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select' | 'file';
  label: string;
  placeholder?: string; // Optional for checkbox, radio, select
  options?: string[];   // For checkbox, radio, select
}

// Defines the entire content of a module
export interface ModuleContent {
  id: number;
  title: string;
  description: string;
  icon: string; // Icon name as string
  content: FormField[];
}

// Represents the status of a module for a team
export type ModuleStatus = 'LOCKED' | 'ACTIVE' | 'COMPLETED';

// Represents the saved data for a module. Can be a string or an array of strings (for checkboxes)
export interface ModuleData {
  [key: string]: string | string[] | File | null;
}

export type ApprovalStatus = 'none' | 'pending' | 'approved' | 'rejected';

// Represents the overall progress of a team
export interface TeamProgress {
  teamId: string;
  teamName: string;
  completedModules: number;
  approvalStatus: ApprovalStatus;
  teacherFeedback?: string;
  data: { [moduleId: number]: ModuleData };
}

export interface Team {
  id: string;
  teamNumber: string;
  members: string[];
}
