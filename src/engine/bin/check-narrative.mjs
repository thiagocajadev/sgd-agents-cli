#!/usr/bin/env node

/**
 * Narrative Guard — Blocks feat: and fix: commits if CHANGELOG.md [Unreleased] is empty.
 * Ensures the auto-bump pipeline always has content to promote.
 */

import fs from 'node:fs';
import path from 'node:path';

import { execSync } from 'node:child_process';

const PROJECT_ROOT = process.cwd();
const CHANGELOG_PATH = path.join(PROJECT_ROOT, 'CHANGELOG.md');

async function run() {
  const commitMsgFile = process.argv[2];
  if (!commitMsgFile) {
    console.error('  ❌ Error: No commit message file provided.');
    process.exit(1);
  }

  if (!fs.existsSync(commitMsgFile)) {
    console.error(`  ❌ Error: Commit message file not found at ${commitMsgFile}`);
    process.exit(1);
  }

  const commitMsg = fs.readFileSync(commitMsgFile, 'utf8').trim();
  const firstLine = commitMsg.split('\n')[0].trim();

  // ONLY target feat: and fix: (SDG Cycle Triggers) as per maintainer instruction
  const isSdgTrigger = /^feat:/.test(firstLine) || /^fix:/.test(firstLine);
  if (!isSdgTrigger) {
    process.exit(0);
  }

  let changelog = '';
  try {
    // Read STAGED version of CHANGELOG.md to prevent issues with lint-staged or stashing
    changelog = execSync('git show :CHANGELOG.md', {
      stdio: ['pipe', 'pipe', 'ignore'],
    }).toString();
  } catch {
    // Fallback to disk if not in index (shouldn't happen in a commit hook for a tracked file)
    if (fs.existsSync(CHANGELOG_PATH)) {
      changelog = fs.readFileSync(CHANGELOG_PATH, 'utf8');
    }
  }

  if (!changelog) {
    console.warn('  ⚠️  Warning: CHANGELOG.md not found or empty. Skipping narrative check.');
    process.exit(0);
  }

  // Extract content between [Unreleased] and the next version header (## [...) or end of file
  // We use (?=\n##\s) to match the next level-2 header specifically, avoiding matches on ### sub-headers.
  const unreleasedMatch = changelog.match(
    /##\s*\[Unreleased\].*?\n([\s\S]*?)(?=\n##\s|(?:\n){0,1}$)/i
  );

  if (!unreleasedMatch) {
    console.error('\n  ❌ NARRATIVE VIOLATION: "## [Unreleased]" section missing in CHANGELOG.md.');
    console.error('  SDG cycles (feat/fix) MUST have a technical narrative before committing.\n');
    process.exit(1);
  }

  const narrative = unreleasedMatch[1]
    .replace(/###\s*(Added|Fixed|Changed|Removed|Security|Deprecated)/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '') // Remove markdown comments
    .trim();

  // If the narrative is just whitespace or empty after removing headers/comments
  if (!narrative || narrative.length < 3) {
    console.error('\n  ❌ NARRATIVE VIOLATION: The [Unreleased] section is empty.');
    console.error('  You are committing a "feat:" or "fix:" which triggers a version bump.');
    console.error('  Please document your changes in CHANGELOG.md under [Unreleased] first.\n');
    process.exit(1);
  }

  console.log('  ✅ Narrative Guard: CHANGELOG.md validated.');
  process.exit(0);
}

run().catch((err) => {
  console.error('  ❌ Narrative Guard Exception:', err.message);
  process.exit(1);
});
// test
