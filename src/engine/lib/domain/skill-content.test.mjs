import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(__dirname, '..', '..', '..', 'assets');

const WORKFLOW = path.join(ASSETS, 'instructions', 'templates', 'workflow.md');
const CODE_STYLE = path.join(ASSETS, 'skills', 'code-style.md');

function readAsset(assetPath) {
  const content = fs.readFileSync(assetPath, 'utf8');
  return content;
}

describe('Skill Content — Governance Layer', () => {
  describe('code-style.md essentials', () => {
    it('should open with a two-line Security-First block', () => {
      const input = readAsset(CODE_STYLE);
      const expectedFragments = [
        '## Security first',
        'Default deny at every boundary',
        'Never concatenate user input',
      ];

      const actualMissing = expectedFragments.filter((fragment) => !input.includes(fragment));

      assert.deepEqual(actualMissing, [], 'Security-first block must be explicit and early');
    });

    it('should expose a PreCodeChecklist rule before PreFinishGate', () => {
      const input = readAsset(CODE_STYLE);
      const preCodeIndex = input.indexOf('<rule name="PreCodeChecklist">');
      const preFinishIndex = input.indexOf('<rule name="PreFinishGate">');

      const actual = preCodeIndex !== -1 && preCodeIndex < preFinishIndex;

      assert.ok(actual, 'PreCodeChecklist must exist and precede PreFinishGate');
    });

    it('should enumerate the eight Pre-Code Checklist concerns', () => {
      const input = readAsset(CODE_STYLE);
      const expectedFragments = [
        'Mental Reset',
        'Target Files',
        'Naming',
        'Narrative',
        'Comments',
        'Tests planned',
        'Security',
        'Blockers',
      ];

      const actualMissing = expectedFragments.filter((fragment) => !input.includes(fragment));

      assert.deepEqual(actualMissing, [], 'Pre-Code Checklist must cover all eight concerns');
    });

    it('should enumerate the eight Pre-Finish Gate items wired to heuristics', () => {
      const input = readAsset(CODE_STYLE);
      const expectedFragments = [
        'Narrative Siblings',
        'Explaining Returns',
        'No framework abbreviations',
        'Vertical Density',
        'Revealing Module Pattern',
        'Boolean prefix',
        'No section banners',
        'Pure entry point',
      ];

      const actualMissing = expectedFragments.filter((fragment) => !input.includes(fragment));

      assert.deepEqual(actualMissing, [], 'Pre-Finish Gate must match heuristic strategy keys');
    });

    it('should ban Engineering Laws / DNA-GATE vocabulary from code-style', () => {
      const input = readAsset(CODE_STYLE);
      const forbiddenFragments = [
        'Engineering Laws',
        'DNA-GATE',
        'staff-dna',
        'Sovereign Protocol',
      ];

      const actualLeaks = forbiddenFragments.filter((fragment) => input.includes(fragment));

      assert.deepEqual(
        actualLeaks,
        [],
        'code-style must not reference removed governance ceremony'
      );
    });
  });

  describe('workflow.md Phase CODE', () => {
    it('should route Phase CODE through the Pre-Code Checklist', () => {
      const input = readAsset(WORKFLOW);
      const expectedMarker = 'Pre-Code Checklist (BLOCKING)';

      const actual = input.includes(expectedMarker);

      assert.ok(actual, 'Phase CODE step 1 must be the Pre-Code Checklist');
    });

    it('should still name the blocked write tools', () => {
      const input = readAsset(WORKFLOW);
      const expectedFragments = ['Edit', 'Write', 'NotebookEdit'];

      const actualMissing = expectedFragments.filter((fragment) => !input.includes(fragment));

      assert.deepEqual(actualMissing, [], 'Phase CODE must name blocked write tools');
    });

    it('should have shed all Laws / DNA-GATE vocabulary', () => {
      const input = readAsset(WORKFLOW);
      const forbiddenFragments = [
        'DNA-GATE CONFIRMED',
        'SUPREME BLOCK',
        'Engineering Laws',
        'Law 1 violation',
        'staff-dna.md',
      ];

      const actualLeaks = forbiddenFragments.filter((fragment) => input.includes(fragment));

      assert.deepEqual(actualLeaks, [], 'workflow.md must not retain removed governance ceremony');
    });
  });
});
