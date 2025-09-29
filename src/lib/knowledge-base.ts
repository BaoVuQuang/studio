// src/lib/knowledge-base.ts
import { knowledgeBase as thcsKnowledgeBase } from '@/lib/knowledge-base/thcs';
import { knowledgeBase as thptKnowledgeBase } from '@/lib/knowledge-base/thpt';
import { knowledgeBase as daihocKnowledgeBase } from '@/lib/knowledge-base/daihoc';
import type { EducationLevel } from '@/lib/types';

type KnowledgeBase = {
  [key: string]: string;
};

const knowledgeBases: Record<EducationLevel, KnowledgeBase> = {
  thcs: thcsKnowledgeBase,
  thpt: thptKnowledgeBase,
  daihoc: daihocKnowledgeBase,
};

export function getKnowledgeBase(
  level: EducationLevel,
  subject: string,
  grade?: string
): string | undefined {
  const baseForLevel = knowledgeBases[level];
  if (!baseForLevel) {
    return undefined;
  }

  // For THPT, try to find a grade-specific knowledge base first.
  // e.g., if subject is 'math' and grade is '10', look for 'math-10'.
  if (level === 'thpt' && grade) {
    const gradeSpecificKey = `${subject}-${grade}`;
    if (gradeSpecificKey in baseForLevel) {
      return baseForLevel[gradeSpecificKey as keyof typeof baseForLevel];
    }
  }

  // Fallback to the general subject knowledge base if no grade-specific one is found,
  // or for other education levels.
  return baseForLevel[subject as keyof typeof baseForLevel];
}