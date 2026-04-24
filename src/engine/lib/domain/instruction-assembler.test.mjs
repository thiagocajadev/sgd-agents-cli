import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { InstructionAssembler } from './instruction-assembler.mjs';

const {
  buildMasterInstructions,
  writeAgentConfig,
  writeManifest,
  writeToolingAssets,
  writeBacklogFiles,
} = InstructionAssembler;

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'sdg-test-'));
}

function cleanup(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe('InstructionAssembler', () => {
  describe('writeAgentConfig()', () => {
    it('should write .ai/skills/AGENTS.md', () => {
      const tmpDir = makeTempDir();
      const inputContent = 'content';
      const expectedPath = path.join(tmpDir, '.ai', 'skills', 'AGENTS.md');
      const expectedContent = inputContent;

      try {
        writeAgentConfig(tmpDir, inputContent);

        const actualExists = fs.existsSync(expectedPath);
        const actualContent = fs.readFileSync(expectedPath, 'utf8');

        assert.ok(actualExists);
        assert.equal(actualContent, expectedContent);
      } finally {
        cleanup(tmpDir);
      }
    });

    it('should create .ai/skills/ directory if it does not exist', () => {
      const tmpDir = makeTempDir();
      const expectedDir = path.join(tmpDir, '.ai', 'skills');

      try {
        writeAgentConfig(tmpDir, 'content');

        const actualExists = fs.existsSync(expectedDir);
        assert.ok(actualExists);
      } finally {
        cleanup(tmpDir);
      }
    });
  });

  describe('writeManifest()', () => {
    it('should create .ai/.sdg-manifest.json', () => {
      const tmpDir = makeTempDir();
      const inputSelections = { flavor: 'lite', idioms: ['go'], versions: { go: null } };
      const expectedFile = path.join(tmpDir, '.ai', '.sdg-manifest.json');

      try {
        writeManifest(tmpDir, inputSelections, '1.0.0');

        const actualExists = fs.existsSync(expectedFile);
        assert.ok(actualExists);
      } finally {
        cleanup(tmpDir);
      }
    });

    it('should create .ai/ directory if it does not exist', () => {
      const tmpDir = makeTempDir();
      const inputSelections = { flavor: 'lite', idioms: ['go'], versions: {} };
      const expectedDir = path.join(tmpDir, '.ai');

      try {
        writeManifest(tmpDir, inputSelections, '1.0.0');

        const actualExists = fs.existsSync(expectedDir);
        assert.ok(actualExists);
      } finally {
        cleanup(tmpDir);
      }
    });

    it('should write valid JSON with all required fields', () => {
      const tmpDir = makeTempDir();
      const inputSelections = { flavor: 'lite', idioms: ['go'], versions: {} };
      const inputVersion = '2.0.0';
      const manifestPath = path.join(tmpDir, '.ai', '.sdg-manifest.json');

      try {
        writeManifest(tmpDir, inputSelections, inputVersion);

        const actualRaw = fs.readFileSync(manifestPath, 'utf8');
        const actual = JSON.parse(actualRaw);

        assert.ok(actual.generatedAt);
        assert.equal(actual.sdgAgentVersion, inputVersion);
        assert.ok(typeof actual.contentHashes === 'object');
        assert.deepEqual(actual.selections, inputSelections);
      } finally {
        cleanup(tmpDir);
      }
    });

    it('should store selections exactly as passed', () => {
      const tmpDir = makeTempDir();
      const inputSelections = {
        flavor: 'vertical-slice',
        idioms: ['typescript', 'python'],
        versions: { typescript: '6.0', python: '3.13' },
      };
      const manifestPath = path.join(tmpDir, '.ai', '.sdg-manifest.json');

      try {
        writeManifest(tmpDir, inputSelections, '1.0.0');

        const actual = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        assert.deepEqual(actual.selections, inputSelections);
      } finally {
        cleanup(tmpDir);
      }
    });

    it('should store a valid ISO generatedAt timestamp', () => {
      const tmpDir = makeTempDir();
      const before = Date.now();
      const manifestPath = path.join(tmpDir, '.ai', '.sdg-manifest.json');

      try {
        writeManifest(tmpDir, { flavor: 'lite', idioms: ['go'], versions: {} }, '1.0.0');

        const after = Date.now();
        const actualManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        const actualTs = new Date(actualManifest.generatedAt).getTime();

        assert.ok(actualTs >= before && actualTs <= after);
      } finally {
        cleanup(tmpDir);
      }
    });
  });

  describe('buildMasterInstructions()', () => {
    it('should point at code-style.md and workflow.md in the header', () => {
      const input = { flavor: 'lite', idioms: ['go'], versions: {} };
      const expectedCodeStyleRef = '.ai/skills/code-style.md';
      const expectedWorkflowRef = '.ai/instructions/templates/workflow.md';

      const actual = buildMasterInstructions(input);
      const hasCodeStyleRef = actual.includes(expectedCodeStyleRef);
      const hasWorkflowRef = actual.includes(expectedWorkflowRef);

      assert.ok(hasCodeStyleRef);
      assert.ok(hasWorkflowRef);
    });

    it('should NOT reference the removed staff-dna.md skill', () => {
      const input = { flavor: 'lite', idioms: ['go'], versions: {} };
      const forbiddenSubstring = 'staff-dna.md';

      const actual = buildMasterInstructions(input);
      const hasNoStaffDnaLink = !actual.includes(forbiddenSubstring);

      assert.ok(hasNoStaffDnaLink, 'staff-dna.md must not appear in generated AGENTS.md');
    });

    it('should include Semantic Router with all cycle triggers', () => {
      const input = { flavor: 'lite', idioms: ['go'], versions: {} };
      const expectedSubstrings = [
        '## Semantic Router',
        'feat:',
        'fix:',
        'docs:',
        'audit:',
        'land:',
        'end:',
      ];

      const actual = buildMasterInstructions(input);

      expectedSubstrings.forEach((expected) => {
        const hasExpectedTrigger = actual.includes(expected);
        const missingTriggerMessage = `Missing: ${expected}`;
        assert.ok(hasExpectedTrigger, missingTriggerMessage);
      });
    });

    it('should include workflow.md reference in Semantic Router', () => {
      const input = { flavor: 'lite', idioms: ['go'], versions: {} };
      const expectedSubstring = 'workflow.md';

      const actual = buildMasterInstructions(input);
      const hasWorkflowReference = actual.includes(expectedSubstring);

      assert.ok(hasWorkflowReference);
    });

    it('should include Phase CODE skill loading section', () => {
      const input = { flavor: 'lite', idioms: ['go'], versions: {} };
      const expectedSubstring = '## Phase CODE';

      const actual = buildMasterInstructions(input);
      const hasPhaseCodeHeader = actual.includes(expectedSubstring);

      assert.ok(hasPhaseCodeHeader);
    });

    it('should include backend competency link for backend-only idiom (go)', () => {
      const input = { flavor: 'lite', idioms: ['go'], versions: {} };
      const expectedSubstring = '.ai/instructions/competencies/backend.md';
      const forbiddenSubstring = '.ai/instructions/competencies/frontend.md';

      const actual = buildMasterInstructions(input);
      const hasBackendLink = actual.includes(expectedSubstring);
      const hasNoFrontendLink = !actual.includes(forbiddenSubstring);

      assert.ok(hasBackendLink);
      assert.ok(hasNoFrontendLink);
    });

    it('should include both competency links for fullstack idiom (typescript)', () => {
      const input = {
        flavor: 'lite',
        idioms: ['typescript'],
        versions: {},
      };
      const expectedSubstring1 = '.ai/instructions/competencies/backend.md';
      const expectedSubstring2 = '.ai/instructions/competencies/frontend.md';

      const actual = buildMasterInstructions(input);
      const hasBackendLink = actual.includes(expectedSubstring1);
      const hasFrontendLink = actual.includes(expectedSubstring2);

      assert.ok(hasBackendLink);
      assert.ok(hasFrontendLink);
    });

    it('should include an instruction link for each idiom', () => {
      const input = {
        flavor: 'lite',
        idioms: ['typescript', 'python'],
        versions: {},
      };
      const expectedSubstring1 = 'idioms/typescript/patterns.md';
      const expectedSubstring2 = 'idioms/python/patterns.md';

      const actual = buildMasterInstructions(input);
      const hasTypescriptIdiom = actual.includes(expectedSubstring1);
      const hasPythonIdiom = actual.includes(expectedSubstring2);

      assert.ok(hasTypescriptIdiom);
      assert.ok(hasPythonIdiom);
    });

    it('should unconditionally include Agent Roles block', () => {
      const input = {
        flavor: 'lite',
        idioms: ['go'],
        versions: {},
      };
      const expectedSubstring1 = '## Agent Roles';
      const expectedSubstring2 = 'agent-roles.md';

      const actual = buildMasterInstructions(input);
      const hasAgentRolesHeader = actual.includes(expectedSubstring1);
      const hasAgentRolesLink = actual.includes(expectedSubstring2);

      assert.ok(hasAgentRolesHeader);
      assert.ok(hasAgentRolesLink);
    });

    it('should classify testing/security/observability as surgical skills', () => {
      const input = { flavor: 'lite', idioms: ['go'], versions: {} };
      const expectedSubstring = '**Surgical**';

      const actual = buildMasterInstructions(input);
      const hasSurgicalHeader = actual.includes(expectedSubstring);
      const hasTestingSkill = actual.includes('testing.md');
      const hasSecuritySkill = actual.includes('security.md');
      const hasObservabilitySkill = actual.includes('observability.md');

      assert.ok(hasSurgicalHeader);
      assert.ok(hasTestingSkill);
      assert.ok(hasSecuritySkill);
      assert.ok(hasObservabilitySkill);
    });

    it('should NOT include DNA-GATE or Working Protocol inline blocks', () => {
      const input = { flavor: 'lite', idioms: ['go'], versions: {} };

      const actual = buildMasterInstructions(input);
      const hasNoDnaGateBlock = !actual.includes('DNA-GATE & MENTAL RESET');
      const hasNoPhaseBanner = !actual.includes('PHASE EXECUTION IS MANDATORY');
      const hasNoWorkingProtocolBlock = !actual.includes('## Working Protocol');

      assert.ok(hasNoDnaGateBlock);
      assert.ok(hasNoPhaseBanner);
      assert.ok(hasNoWorkingProtocolBlock);
    });

    it('should be significantly smaller than 2.7KB', () => {
      const input = { flavor: 'lite', idioms: ['typescript', 'python'], versions: {} };

      const actual = buildMasterInstructions(input);
      const actualBytes = Buffer.byteLength(actual, 'utf8');
      const isUnderSmallBudget = actualBytes < 2700;
      const sizeFailureMessage = `Output is ${actualBytes} bytes, expected < 2700`;

      assert.ok(isUnderSmallBudget, sizeFailureMessage);
    });
  });

  describe('Token Budget Guard', () => {
    // Worst-case: fullstack (typescript) + second idiom + flavor = maximum possible output
    const WORST_CASE_INPUT = { flavor: 'lite', idioms: ['typescript', 'python'], versions: {} };
    // Ceiling: 2600 bytes (~650 tokens). Current baseline: ~2537 bytes.
    // If this breaks, you added verbose content to AGENTS.md. Compress or move to on-demand file.
    const TOKEN_BUDGET_BYTES = 2600;

    it(`should stay under ${TOKEN_BUDGET_BYTES} bytes (worst-case fullstack output)`, () => {
      const actual = buildMasterInstructions(WORST_CASE_INPUT);
      const actualBytes = Buffer.byteLength(actual, 'utf8');
      const isWithinTokenBudget = actualBytes <= TOKEN_BUDGET_BYTES;
      const approxActualTokens = Math.round(actualBytes / 4);
      const approxBudgetTokens = Math.round(TOKEN_BUDGET_BYTES / 4);
      const tokenLeakMessage =
        `Token leak detected: ${actualBytes} bytes (budget: ${TOKEN_BUDGET_BYTES}). ` +
        `Approx ${approxActualTokens} tokens vs budget ${approxBudgetTokens}. ` +
        'Move verbose content to an on-demand file instead of embedding in AGENTS.md.';

      assert.ok(isWithinTokenBudget, tokenLeakMessage);
    });

    it('should not duplicate any file path reference', () => {
      const actual = buildMasterInstructions(WORST_CASE_INPUT);
      const pathMatches = actual.match(/`\.ai\/[^`]+\.md`/g) || [];
      const uniquePaths = new Set(pathMatches);

      const duplicates = pathMatches.filter(
        (filePath, index) => pathMatches.indexOf(filePath) !== index
      );

      const duplicatesMessage = `Duplicated file references waste tokens: ${duplicates.join(', ')}`;
      const expectedDuplicates = [];

      assert.deepEqual(duplicates, expectedDuplicates, duplicatesMessage);
      assert.equal(pathMatches.length, uniquePaths.size);
    });

    it('should not contain verbose protocol patterns (they belong in on-demand files)', () => {
      const actual = buildMasterInstructions(WORST_CASE_INPUT);

      const forbiddenPatterns = [
        { pattern: 'SOVEREIGN PROTOCOL', reason: 'removed ceremony must not resurface' },
        { pattern: 'PHASE EXECUTION IS MANDATORY', reason: 'Phase rules belong in workflow.md' },
        { pattern: 'Skipping any phase', reason: 'Phase enforcement belongs in workflow.md' },
        { pattern: 'Training heuristics', reason: 'Anti-heuristic text belongs in workflow.md' },
        { pattern: 'Mental Reset', reason: 'checklist items belong in code-style.md' },
        { pattern: 'Sovereign Gateway', reason: 'removed ceremony must not resurface' },
        { pattern: 'DNA-GATE', reason: 'removed ceremony must not resurface' },
        { pattern: 'Engineering Laws', reason: 'removed vocabulary must not resurface' },
        { pattern: '[!IMPORTANT]', reason: 'Callout boxes waste tokens in always-on context' },
        { pattern: '[!CAUTION]', reason: 'Callout boxes waste tokens in always-on context' },
      ];

      for (const { pattern, reason } of forbiddenPatterns) {
        const isPatternAbsent = !actual.includes(pattern);
        const leakMessage = `Verbose pattern leaked into AGENTS.md: "${pattern}". ${reason}.`;

        assert.ok(isPatternAbsent, leakMessage);
      }
    });

    it('should have exactly 5 H2 sections (no section bloat)', () => {
      const actual = buildMasterInstructions(WORST_CASE_INPUT);
      const h2Matches = actual.match(/^## .+$/gm) || [];
      const expectedSections = [
        '## Session Start',
        '## Semantic Router',
        '## Phase CODE',
        '## Agent Roles',
      ];

      const isWithinH2Limit = h2Matches.length <= 5;
      const sectionBloatMessage = `Section bloat: found ${h2Matches.length} H2 sections (max 5). Sections: ${h2Matches.join(', ')}`;

      assert.ok(isWithinH2Limit, sectionBloatMessage);

      for (const section of expectedSections) {
        const sectionFound = h2Matches.some((heading) => heading.startsWith(section));
        const missingSectionMessage = `Missing required section: ${section}`;

        assert.ok(sectionFound, missingSectionMessage);
      }
    });
  });

  describe('writeToolingAssets()', () => {
    it('should copy tooling directory into .ai/tooling/ preserving structure', () => {
      const tmpDir = makeTempDir();
      const expectedFiles = [
        path.join('.ai', 'tooling', 'scripts', 'prune-backlog.mjs'),
        path.join('.ai', 'tooling', 'scripts', 'bump-version.mjs'),
        path.join('.ai', 'tooling', 'husky', 'pre-commit'),
        path.join('.ai', 'tooling', 'husky', 'commit-msg'),
        path.join('.ai', 'tooling', 'README.md'),
      ];

      try {
        writeToolingAssets(tmpDir);

        for (const relativePath of expectedFiles) {
          const absolutePath = path.join(tmpDir, relativePath);
          const fileExists = fs.existsSync(absolutePath);
          const missingFileMessage = `Missing tooling asset: ${relativePath}`;

          assert.ok(fileExists, missingFileMessage);
        }
      } finally {
        cleanup(tmpDir);
      }
    });

    it('should mark husky hooks as executable', () => {
      const tmpDir = makeTempDir();
      const hookNames = ['pre-commit', 'commit-msg'];
      const expectedPermissionMask = 0o100;

      try {
        writeToolingAssets(tmpDir);

        for (const hookName of hookNames) {
          const hookPath = path.join(tmpDir, '.ai', 'tooling', 'husky', hookName);
          const stats = fs.statSync(hookPath);
          const actualPermissionBits = stats.mode & 0o111;
          const isExecutable = (actualPermissionBits & expectedPermissionMask) !== 0;
          const missingExecutableMessage = `Hook not executable: ${hookName}`;

          assert.ok(isExecutable, missingExecutableMessage);
        }
      } finally {
        cleanup(tmpDir);
      }
    });

    it('should be idempotent when invoked twice', () => {
      const tmpDir = makeTempDir();
      const referencePath = path.join(tmpDir, '.ai', 'tooling', 'README.md');

      try {
        writeToolingAssets(tmpDir);
        const firstRunContent = fs.readFileSync(referencePath, 'utf8');

        writeToolingAssets(tmpDir);
        const secondRunContent = fs.readFileSync(referencePath, 'utf8');

        assert.equal(firstRunContent, secondRunContent);
      } finally {
        cleanup(tmpDir);
      }
    });
  });

  describe('writeBacklogFiles() — tooling hint section', () => {
    it('should include Tooling (optional) section in generated context.md', () => {
      const tmpDir = makeTempDir();
      const contextPath = path.join(tmpDir, '.ai', 'backlog', 'context.md');
      const expectedSectionHeading = '## Tooling (optional)';
      const expectedReference = '.ai/tooling/';

      try {
        writeBacklogFiles(tmpDir, { flavor: 'lite', idioms: [], versions: {} });
        const actualContent = fs.readFileSync(contextPath, 'utf8');

        assert.ok(actualContent.includes(expectedSectionHeading));
        assert.ok(actualContent.includes(expectedReference));
      } finally {
        cleanup(tmpDir);
      }
    });
  });
});
