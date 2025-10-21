import fs from 'node:fs/promises';
import path from 'node:path';

const DATA_ROOT = path.join(process.cwd(), 'data', 'chroma');

/**
 * Recursively collects JSON files in the knowledge base directory to validate their structure.
 */
async function collectKnowledgeFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectKnowledgeFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(entryPath);
    }
  }

  return files;
}

/**
 * Validates that each knowledge base JSON has non-empty content and required enrichment sections.
 */
async function validateKnowledgeFile(file: string): Promise<string[]> {
  const raw = await fs.readFile(file, 'utf8');
  const issues: string[] = [];

  try {
    const parsed = JSON.parse(raw) as { content?: unknown; sections?: Array<{ id?: unknown; title?: unknown; body?: unknown }>; };
    if (typeof parsed.content !== 'string' || parsed.content.trim().length === 0) {
      issues.push('missing or empty content field');
      return issues;
    }

    const sections = Array.isArray(parsed.sections) ? parsed.sections : [];
    if (sections.length === 0) {
      issues.push('missing sections array');
    }

    const seenIds = new Set<string>();
    for (const [index, section] of sections.entries()) {
      const id = typeof section.id === 'string' ? section.id : '';
      const title = typeof section.title === 'string' ? section.title : '';
      const body = typeof section.body === 'string' ? section.body : '';

      if (!id) {
        issues.push(`section ${index} missing id`);
      } else if (seenIds.has(id)) {
        issues.push(`duplicate section id: ${id}`);
      } else {
        seenIds.add(id);
      }

      if (!title) {
        issues.push(`section ${index} missing title`);
      }

      if (!body.trim()) {
        issues.push(`section ${index} missing body content`);
      }
    }

    const headingChecks: Array<[string, string]> = [
      ['Hướng dẫn tự học cập nhật', 'self-study guidance'],
      ['Lộ trình luyện đề 2025', 'exam roadmap'],
    ];

    for (const [heading, label] of headingChecks) {
      const occurrences = parsed.content.split(heading).length - 1;
      if (occurrences === 0) {
        issues.push(`missing heading: ${heading} (${label})`);
      } else if (occurrences > 1) {
        issues.push(`duplicate heading: ${heading}`);
      }
    }
  } catch (error) {
    issues.push(`invalid JSON: ${(error as Error).message}`);
  }

  return issues;
}

/**
 * Entry point to validate every knowledge base file and exit with a non-zero status if issues are found.
 */
async function main() {
  const files = await collectKnowledgeFiles(DATA_ROOT);
  const problems: Array<{ file: string; issues: string[] }> = [];

  for (const file of files) {
    const relative = path.relative(process.cwd(), file);
    const issues = await validateKnowledgeFile(file);
    if (issues.length > 0) {
      problems.push({ file: relative, issues });
    }
  }

  if (problems.length > 0) {
    for (const problem of problems) {
      console.error(`❌ ${problem.file}`);
      for (const issue of problem.issues) {
        console.error(`   - ${issue}`);
      }
    }
    process.exit(1);
  }

  console.log(`✅ Knowledge base OK (${files.length} files checked)`);
}

main().catch(error => {
  console.error('Failed to validate knowledge base:', error);
  process.exit(1);
});
