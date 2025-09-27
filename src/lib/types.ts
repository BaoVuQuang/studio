import type { LucideIcon } from 'lucide-react';

export type EducationLevel = 'thcs' | 'thpt';

export type Subject = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  resources?: string[];
  isSuggestingResources?: boolean;
};

export type Conversation = {
  id: string;
  level: EducationLevel;
  subject: string;
  question: string;
  answer: string;
};
