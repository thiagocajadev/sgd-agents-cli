import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { FsUtils } from '../core/fs-utils.mjs';

const { getDirname } = FsUtils;

const __dirname = getDirname(import.meta.url);
const INSTRUCTIONS_DIR = path.join(__dirname, '../../..', 'assets', 'instructions');

function hashFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function computeHashes(selections, instructionsDir = INSTRUCTIONS_DIR) {
  const { flavor, idioms } = selections;
  const hashes = {};

  const coreDir = path.join(instructionsDir, 'core');
  if (fs.existsSync(coreDir)) {
    scanDir(coreDir, 'core', hashes);
  }

  if (flavor) {
    const flavorDir = path.join(instructionsDir, 'flavors', flavor);
    if (fs.existsSync(flavorDir)) {
      scanDir(flavorDir, 'flavor', hashes);
    }
  }

  if (idioms && Array.isArray(idioms)) {
    for (const idiomFolderKey of idioms) {
      const idiomDir = path.join(instructionsDir, 'idioms', idiomFolderKey);
      if (fs.existsSync(idiomDir)) {
        scanDir(idiomDir, `idioms/${idiomFolderKey}`, hashes);
      }
    }
  }

  const templatesDir = path.join(instructionsDir, 'templates');
  if (fs.existsSync(templatesDir)) {
    scanDir(templatesDir, 'templates', hashes);
  }

  const competenciesDir = path.join(instructionsDir, 'competencies');
  if (fs.existsSync(competenciesDir)) {
    scanDir(competenciesDir, 'competencies', hashes);
  }

  const workflowsDir = path.join(instructionsDir, 'workflows');
  if (fs.existsSync(workflowsDir)) {
    scanDir(workflowsDir, 'workflows', hashes);
  }

  const commandsDir = path.join(instructionsDir, 'commands');
  if (fs.existsSync(commandsDir)) {
    scanDir(commandsDir, 'commands', hashes);
  }

  return hashes;
}

function scanDir(directory, relativePrefix, hashes) {
  if (!fs.existsSync(directory)) return;

  const entries = fs.readdirSync(directory, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    const relativeFilePath = path.join(relativePrefix, entry.name);

    if (entry.isDirectory()) {
      scanDir(fullPath, relativeFilePath, hashes);
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mjs'))) {
      hashes[relativeFilePath] = hashFile(fullPath);
    }
  }
}

function compareHashes(stored, current) {
  const changed = [];
  const unchanged = [];
  const added = [];

  for (const [relativeFilePath, currentHash] of Object.entries(current)) {
    if (!(relativeFilePath in stored)) {
      added.push(relativeFilePath);
    } else if (stored[relativeFilePath] !== currentHash) {
      changed.push(relativeFilePath);
    } else {
      unchanged.push(relativeFilePath);
    }
  }

  return { changed, unchanged, added };
}

function daysAgo(isoDate) {
  const ms = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (days < 0) return 'just now';
  if (days === 0) return 'today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

function loadManifest(projectRoot) {
  const manifestPath = path.join(projectRoot, '.ai', '.sdg-manifest.json');

  if (!fs.existsSync(manifestPath)) return null;

  try {
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch {
    return null;
  }
}

export const ManifestUtils = {
  hashFile,
  computeHashes,
  compareHashes,
  daysAgo,
  loadManifest,
};
