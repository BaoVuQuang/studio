// src/lib/knowledge-base.ts
import { knowledgeBase as thcsKnowledgeBase } from '@/lib/knowledge-base/thcs';
import { knowledgeBase as thptKnowledgeBase } from '@/lib/knowledge-base/thpt';
import { knowledgeBase as daihocKnowledgeBase } from '@/lib/knowledge-base/daihoc';
import type { EducationLevel } from '@/lib/types';

const knowledgeBases = {
  thcs: thcsKnowledgeBase,
  thpt: thptKnowledgeBase,
  daihoc: daihocKnowledgeBase,
};

export function getKnowledgeBase(
  level: EducationLevel,
  subject: string,
  grade?: string // grade is kept for potential future use but not strictly needed for current logic
): string | undefined {
    const baseForLevel = knowledgeBases[level];
    if (!baseForLevel) {
        return undefined;
    }
    
    // Direct lookup for subjects that exist in the knowledge base object.
    return baseForLevel[subject as keyof typeof baseForLevel];
}
