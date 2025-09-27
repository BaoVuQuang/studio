// src/lib/knowledge-base.ts
import { knowledgeBase as thcsKnowledgeBase } from '@/lib/knowledge-base/thcs';
import { knowledgeBase as thptKnowledgeBase } from '@/lib/knowledge-base/thpt';
import type { EducationLevel } from '@/lib/types';

const knowledgeBases = {
  thcs: thcsKnowledgeBase,
  thpt: thptKnowledgeBase,
};

export function getKnowledgeBase(
  level: EducationLevel,
  subject: string
): string | undefined {
  const baseForLevel = knowledgeBases[level];
  if (baseForLevel && subject in baseForLevel) {
    return baseForLevel[subject as keyof typeof baseForLevel];
  }
  return undefined;
}
