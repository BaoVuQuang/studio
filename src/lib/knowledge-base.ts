// src/lib/knowledge-base.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import type { EducationLevel } from '@/lib/types';

const DATA_ROOT = process.env.CHROMA_DATA_DIR || path.join(process.cwd(), 'data', 'chroma');
const knowledgeCache = new Map<string, string>();

/**
 * Loads a knowledge base entry from the generated JSON files instead of bundling TS data.
 * This avoids shipping every subject with the client bundle and keeps things lazy.
 */
async function loadKnowledgeEntry(level: EducationLevel, key: string): Promise<string | undefined> {
  const cacheKey = `${level}:${key}`;
  if (knowledgeCache.has(cacheKey)) {
    return knowledgeCache.get(cacheKey);
  }

  const sanitizedKey = key.replace(/[^a-zA-Z0-9-]/g, '_');
  const filePath = path.join(DATA_ROOT, level, `${sanitizedKey}.json`);

  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(fileContents) as { content?: string };
    if (typeof parsed?.content === 'string') {
      knowledgeCache.set(cacheKey, parsed.content);
      return parsed.content;
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
      return entry;
    }
  }

  return undefined;
}
