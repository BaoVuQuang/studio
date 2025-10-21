import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { knowledgeBase as thcsKnowledgeBase } from '../src/lib/knowledge-base/thcs/index';
import { knowledgeBase as thptKnowledgeBase } from '../src/lib/knowledge-base/thpt/index';
import { knowledgeBase as daihocKnowledgeBase } from '../src/lib/knowledge-base/daihoc/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function writeKnowledgeBase(level: string, data: Record<string, string>) {
  const levelDir = path.join(__dirname, '..', 'data', 'chroma', level);
  await ensureDir(levelDir);
  await Promise.all(
    Object.entries(data).map(async ([key, content]) => {
      const sanitized = key.replace(/[^a-zA-Z0-9-]/g, '_');
      const filePath = path.join(levelDir, `${sanitized}.json`);
      const payload = { key, content };
      await fs.writeFile(filePath, JSON.stringify(payload, null, 2), 'utf8');
    })
  );
}

async function main() {
  await writeKnowledgeBase('thcs', thcsKnowledgeBase);
  await writeKnowledgeBase('thpt', thptKnowledgeBase);
  await writeKnowledgeBase('daihoc', daihocKnowledgeBase);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
