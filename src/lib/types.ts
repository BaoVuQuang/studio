import type { LucideIcon } from 'lucide-react';

export type EducationLevel = 'thcs' | 'thpt' | 'daihoc';

export type Grade = {
  value: string;
  label: string;
}

export type Subject = {
  value: string;
  label: string;
  icon: LucideIcon;
  grades: string[]; // Grades this subject is available for, e.g., ['6', '7', '8', '9']
};

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestedQuestions?: string[];
  isSuggestingQuestions?: boolean;
};

export type Conversation = {
  id:string;
  level: EducationLevel;
  grade?: string;
  subject: string;
  question: string;
  answer: string;
};
