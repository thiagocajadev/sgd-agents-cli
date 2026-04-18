import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(__dirname, '..', '..', '..', 'assets');

const STAFF_DNA = path.join(ASSETS, 'skills', 'staff-dna.md');
const WORKFLOW = path.join(ASSETS, 'instructions', 'templates', 'workflow.md');
const CODE_STYLE = path.join(ASSETS, 'skills', 'code-style.md');

function readAsset(assetPath) {
  const content = fs.readFileSync(assetPath, 'utf8');
  return content;
}

describe('Skill Content — Supreme Gate (Law 1 hardening)', () => {
  describe('staff-dna.md Law 1 Recited Gate', () => {
    it('should require a DNA-GATE CONFIRMED block before write tools', () => {
      const input = readAsset(STAFF_DNA);
      const expectedMarker = 'Recited Gate (SUPREME BLOCK)';

      const actual = input.includes(expectedMarker);

      assert.ok(actual, 'Law 1 must name the Recited Gate as SUPREME BLOCK');
    });

    it('should list the mandatory DNA-GATE CONFIRMED block contents', () => {
      const input = readAsset(STAFF_DNA);
      const expectedFragments = [
        'DNA-GATE CONFIRMED',
        'Laws Applied',
        'Code-Style Checklist (Pre-Start)',
        'Target Files',
        'Blockers',
      ];

      const actualMissing = expectedFragments.filter((fragment) => !input.includes(fragment));

      assert.deepEqual(actualMissing, [], 'All DNA-GATE block fields must be enumerated');
    });

    it('should declare that missing block is a Law 1 violation', () => {
      const input = readAsset(STAFF_DNA);
      const expectedMarker = 'Law 1 violation';

      const actual = input.includes(expectedMarker);

      assert.ok(actual, 'Missing gate must be labeled a Law 1 violation');
    });
  });

  describe('workflow.md Phase CODE Supreme Block', () => {
    it('should promote DNA-GATE to a BLOCKING supreme block', () => {
      const input = readAsset(WORKFLOW);
      const expectedMarker = 'DNA-GATE (SUPREME BLOCK — BLOCKING)';

      const actual = input.includes(expectedMarker);

      assert.ok(actual, 'Phase CODE step 1 must be labeled SUPREME BLOCK — BLOCKING');
    });

    it('should forbid Edit/Write/NotebookEdit before the gate emission', () => {
      const input = readAsset(WORKFLOW);
      const expectedFragments = ['DNA-GATE CONFIRMED', 'Edit', 'Write', 'NotebookEdit'];

      const actualMissing = expectedFragments.filter((fragment) => !input.includes(fragment));

      assert.deepEqual(actualMissing, [], 'Phase CODE must name blocked write tools');
    });

    it('should install a Circuit Breaker tied to Law 1', () => {
      const input = readAsset(WORKFLOW);
      const expectedMarker = 'Circuit Breaker';

      const actual = input.includes(expectedMarker) && input.includes('Law 1 violation');

      assert.ok(actual, 'Phase CODE must wire Circuit Breaker to Law 1 violation');
    });
  });

  describe('code-style.md PreStartGate rule', () => {
    it('should expose a PreStartGate rule before EnforcementChecklist', () => {
      const input = readAsset(CODE_STYLE);
      const preStartIndex = input.indexOf('<rule name="PreStartGate">');
      const enforcementIndex = input.indexOf('<rule name="EnforcementChecklist">');

      const actual = preStartIndex !== -1 && preStartIndex < enforcementIndex;

      assert.ok(actual, 'PreStartGate must exist and precede EnforcementChecklist');
    });

    it('should promote "Paragraphs of Intent" to a binary checklist item', () => {
      const input = readAsset(CODE_STYLE);
      const expectedFragments = [
        'Paragraphs of Intent',
        'blank line separates logical groups',
        'NO blank lines within a group',
      ];

      const actualMissing = expectedFragments.filter((fragment) => !input.includes(fragment));

      assert.deepEqual(actualMissing, [], 'Paragraphs of Intent must be explicit and binary');
    });

    it('should declare the twin-gate relationship with EnforcementChecklist', () => {
      const input = readAsset(CODE_STYLE);
      const expectedFragments = ['Twin gate', 'Pre-Finish', 'Pre-Start'];

      const actualMissing = expectedFragments.filter((fragment) => !input.includes(fragment));

      assert.deepEqual(actualMissing, [], 'PreStartGate must declare twin-gate pairing');
    });
  });
});
