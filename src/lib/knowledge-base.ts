// src/lib/knowledge-base.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import type { EducationLevel } from '@/lib/types';

const DATA_ROOT = process.env.CHROMA_DATA_DIR || path.join(process.cwd(), 'data', 'chroma');

export type KnowledgeSection = {
  id: string;
  title: string;
  body: string;
};

type KnowledgeEntry = {
  content: string;
  sections: KnowledgeSection[];
};

const knowledgeCache = new Map<string, KnowledgeEntry>();

/**
 * Loads a knowledge base entry from the generated JSON files instead of bundling TS data.
 * This avoids shipping every subject with the client bundle and keeps things lazy.
 */
async function loadKnowledgeEntry(level: EducationLevel, key: string): Promise<KnowledgeEntry | undefined> {
  const cacheKey = `${level}:${key}`;
  if (knowledgeCache.has(cacheKey)) {
    return knowledgeCache.get(cacheKey);
  }

  const sanitizedKey = key.replace(/[^a-zA-Z0-9-]/g, '_');
  const filePath = path.join(DATA_ROOT, level, `${sanitizedKey}.json`);

  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(fileContents) as { content?: unknown; sections?: unknown };
    if (typeof parsed?.content === 'string') {
      const sections = Array.isArray(parsed.sections)
        ? (parsed.sections as KnowledgeSection[])
            .map(section => ({
              id: typeof section.id === 'string' ? section.id : 'core',
              title: typeof section.title === 'string' ? section.title : 'Kiến thức trọng tâm',
              body: typeof section.body === 'string' ? section.body : '',
            }))
            .filter(section => section.body.trim().length > 0)
        : [
            {
              id: 'core',
              title: 'Kiến thức trọng tâm',
              body: parsed.content,
            },
          ];

      const entry: KnowledgeEntry = {
        content: parsed.content,
        sections,
      };
      knowledgeCache.set(cacheKey, entry);
      return entry;
    }
  } catch (error) {
    // Silently ignore missing files so we can try the next fallback without crashing the flow.
  }

  return undefined;
}

/**
 * Returns the lazily-loaded knowledge base content for the requested subject/grade combination.
 * The lookup now loads JSON files at runtime so changes deploy instantly without a rebuild.
 */
export async function getKnowledgeBase(
  level: EducationLevel,
  subject: string,
  grade?: string
): Promise<string | undefined> {
  const candidates: string[] = [];

  if ((level === 'thpt' || level === 'thcs') && grade) {
    candidates.push(`${subject}-${grade}`);
  }

  candidates.push(subject);

  for (const key of candidates) {
    const entry = await loadKnowledgeEntry(level, key);
    if (entry) {
      return entry.content;
    }
  }

  return undefined;
}

/**
 * Returns the structured sections for a knowledge base entry so the UI can render them piecemeal.
 */
export async function getKnowledgeSections(
  level: EducationLevel,
  subject: string,
  grade?: string
): Promise<KnowledgeSection[] | undefined> {
  const candidates: string[] = [];

  if ((level === 'thpt' || level === 'thcs') && grade) {
    candidates.push(`${subject}-${grade}`);
  }

  candidates.push(subject);

  for (const key of candidates) {
    const entry = await loadKnowledgeEntry(level, key);
    if (entry) {
      return entry.sections;
    }
  }

  return undefined;
}
