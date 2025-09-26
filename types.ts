export type FormField = FormInput | FormDisplay;

export type AITask = 'researchQuestion' | 'actionPlan' | 'reflection';

export type ProjectId = (
  | 'project1'
  | 'project2'
  | 'project3'
  | 'project4'
  | 'project5'
  | 'project6'
  | 'project7'
  | 'project8'
);

export interface FormDisplay {
  id: string;
  type: 'header' | 'info';
  text: string;
}

export type FormInput =
  | TextInputField
  | TextAreaField
  | CheckboxField
  | RadioField
  | SelectField
  | FileField;

interface BaseInputField {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  aiTask?: AITask;
  aiPrompt?: string;
}

export interface TextInputField extends BaseInputField {
  type: 'text';
}

export interface TextAreaField extends BaseInputField {
  type: 'textarea';
}

export interface CheckboxField extends BaseInputField {
  type: 'checkbox';
  options: string[];
}

export interface RadioField extends BaseInputField {
  type: 'radio';
  options: string[];
}

export interface SelectField extends BaseInputField {
  type: 'select';
  options?: string[];
  optionsSource?: 'teamMembers';
}

export interface FileField extends BaseInputField {
  type: 'file';
}

export interface ModuleContent {
  id: number;
  title: string;
  description: string;
  icon: string;
  content: FormField[];
}

export type ModuleStatus = 'LOCKED' | 'ACTIVE' | 'COMPLETED';

export interface StoredFile {
  name: string;
  url?: string;
  mimeType?: string;
  size?: number;
  status: 'uploaded' | 'pending';
}

export type ModuleDataValue = string | string[] | StoredFile | File | null;

export interface ModuleData {
  [key: string]: ModuleDataValue;
}

export type ApprovalStatus = 'none' | 'pending' | 'approved' | 'rejected';

export interface TeamProgress {
  teamId: string;
  teamName: string;
  groupId: string;
  completedModules: number;
  approvalStatus: ApprovalStatus;
  teacherFeedback?: string;
  projectId?: ProjectId;
  data: { [moduleId: number]: ModuleData };
  lastUpdated: string;
}

export interface DatabaseTeam {
  id: string;
  teamNumber: string;
  members: string[];
}

export type Database = Record<string, DatabaseTeam[]>;

export interface Team extends DatabaseTeam {
  groupId: string;
}

export interface SessionLogEntry {
  id: string;
  teamId: string;
  teamName: string;
  groupId: string;
  completedModules: number;
  approvalStatus: ApprovalStatus;
  savedAt: string;
  progressSnapshot: TeamProgress;
}

export interface TeamSession {
  team: Team;
  progress: TeamProgress;
}



