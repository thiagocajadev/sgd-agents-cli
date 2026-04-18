import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { NARRATIVE_CHECKLIST } from './governance.mjs';

describe('governance.NARRATIVE_CHECKLIST', () => {
  it('parses all 14 enforcement checklist items from code-style.md', () => {
    const expectedChecklistSize = 14;
    const actualChecklistSize = NARRATIVE_CHECKLIST.length;
    const failureMessage = 'parser regex must capture every checklist item (Bug X regression)';

    assert.equal(actualChecklistSize, expectedChecklistSize, failureMessage);
  });

  it('maps every label to a strategy or explicit placeholder (no orphan rules)', () => {
    const orphanRules = NARRATIVE_CHECKLIST.filter((rule) => rule.heuristic === null);
    const orphanLabels = orphanRules.map((rule) => rule.label);
    const orphanCount = orphanRules.length;
    const expectedOrphanCount = 0;
    const failureMessage = `every checklist label must have a strategy mapping (Bug Y/Z regression). Orphans: ${orphanLabels.join(', ')}`;

    assert.equal(orphanCount, expectedOrphanCount, failureMessage);
  });

  it('exposes SLA, Pure entry point, and Explaining Returns as enforced rules', () => {
    const ruleLabels = NARRATIVE_CHECKLIST.map((rule) => rule.label);
    const requiredRules = ['SLA', 'Pure entry point', 'Explaining Returns'];

    for (const expectedLabel of requiredRules) {
      const isPresent = ruleLabels.includes(expectedLabel);
      const failureMessage = `checklist must expose label "${expectedLabel}"`;
      assert.ok(isPresent, failureMessage);
    }
  });
});
