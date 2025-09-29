import type { LucideIcon } from 'lucide-react';
import {type GenerateQuizOutput} from '@/ai/flows/generate-quiz';


export type EducationLevel = 'thcs' | 'thpt' | 'daihoc';

export type Subject = {
  value: string;
  label: string;
  icon: LucideIcon;
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
  subject: string;
  question: string;
  answer: string;
};

export type QuizData = GenerateQuizOutput;
