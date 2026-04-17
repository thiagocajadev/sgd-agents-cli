import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Cleaner } from './clear-bundle.mjs';

const { findBacklogsAtRisk } = Cleaner;

describe('Cleaner.findBacklogsAtRisk()', () => {
  let tempDir;

  before(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sdg-clear-test-'));
  });

  after(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should return empty when items list has no .ai entry', () => {
    const items = [{ name: '.sdg-prompts', fullPath: path.join(tempDir, '.sdg-prompts') }];

    const actual = findBacklogsAtRisk(items);

    assert.deepEqual(actual, []);
  });

  it('should return empty when .ai/backlog/ does not exist', () => {
    const aiDir = path.join(tempDir, 'case-no-backlog', '.ai');
    fs.mkdirSync(aiDir, { recursive: true });
    const items = [{ name: '.ai', fullPath: aiDir }];

    const actual = findBacklogsAtRisk(items);

    assert.deepEqual(actual, []);
  });

  it('should return empty when .ai/backlog/ exists but is empty', () => {
    const aiDir = path.join(tempDir, 'case-empty-backlog', '.ai');
    fs.mkdirSync(path.join(aiDir, 'backlog'), { recursive: true });
    const items = [{ name: '.ai', fullPath: aiDir }];

    const actual = findBacklogsAtRisk(items);

    assert.deepEqual(actual, []);
  });

  it('should return backlog path when .ai/backlog/ has content', () => {
    const aiDir = path.join(tempDir, 'case-populated', '.ai');
    const backlogDir = path.join(aiDir, 'backlog');
    fs.mkdirSync(backlogDir, { recursive: true });
    fs.writeFileSync(path.join(backlogDir, 'tasks.md'), '# Active\n');
    const items = [{ name: '.ai', fullPath: aiDir }];

    const actual = findBacklogsAtRisk(items);

    assert.deepEqual(actual, [backlogDir]);
  });

  it('should detect populated backlog inside monorepo packages', () => {
    const monoAiDir = path.join(tempDir, 'monorepo', 'packages', 'foo', '.ai');
    const monoBacklog = path.join(monoAiDir, 'backlog');
    fs.mkdirSync(monoBacklog, { recursive: true });
    fs.writeFileSync(path.join(monoBacklog, 'learned.md'), 'lesson');
    const items = [{ name: 'packages/foo/.ai', fullPath: monoAiDir }];

    const actual = findBacklogsAtRisk(items);

    assert.deepEqual(actual, [monoBacklog]);
  });
});
