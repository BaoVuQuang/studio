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

// Define a map for subjects that don't have a 1-to-1 mapping with file names
const subjectFileMap: Record<string, string> = {
    'political-economy': 'political-economy',
    'scientific-socialism': 'scientific-socialism',
    'party-history': 'party-history'
};


export function getKnowledgeBase(
  level: EducationLevel,
  subject: string
): string | undefined {
  const baseForLevel = knowledgeBases[level];
  if (baseForLevel && subject in baseForLevel) {
    return baseForLevel[subject as keyof typeof baseForLevel];
  }
  // Fallback for special cases if any
  if (level === 'daihoc') {
      const mappedSubject = subjectFileMap[subject];
      if (mappedSubject && mappedSubject in baseForLevel) {
          return baseForLevel[mappedSubject as keyof typeof baseForLevel];
      }
  }

  // Handle cases where a subject might exist in one level but is selected in another context
  // or subjects that have different keys but share knowledge bases.
  // For the new political subjects, they now have their own files, but we need to ensure they are correctly looked up.
  // The structure `daihocKnowledgeBase` already has the correct keys from its `index.ts`.
  // The issue is that the `subject` key might not exist directly if it's not mapped.
  // The previous fix was almost right but the main index needs to be aware of the structure.
  if (baseForLevel) {
    // The keys in daihocKnowledgeBase are now 'philosophy', 'political-economy', etc.
    // The subject value from the dropdown is also these keys.
    // So a direct lookup should work.
    if (Object.prototype.hasOwnProperty.call(baseForLevel, subject)) {
      return baseForLevel[subject as keyof typeof baseForLevel];
    }
  }

  return undefined;
}