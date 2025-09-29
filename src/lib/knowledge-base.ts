
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
  grade?: string // Grade is now optional, especially for 'daihoc'
): string | undefined {
    // For THCS and THPT, the knowledge base is the same for all grades within that level.
    // The differentiation happens at the subject level.
    const baseForLevel = knowledgeBases[level];

    if (!baseForLevel) {
        return undefined;
    }
    
    // Direct lookup for subjects that exist in the knowledge base object.
    if (Object.prototype.hasOwnProperty.call(baseForLevel, subject)) {
        return baseForLevel[subject as keyof typeof baseForLevel];
    }
  
    return undefined;
}

    