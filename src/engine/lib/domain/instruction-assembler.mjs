/**
 * Instruction Assembler — Builds and writes the final master instructions.
 * Assembles agent config files and the project manifest.
 */

import fs from 'node:fs';
import path from 'node:path';
import dedent from 'dedent';

import { STACK_DISPLAY_NAMES } from '../../config/stack-display.mjs';
import { DisplayUtils } from '../core/display-utils.mjs';
import { ManifestUtils } from './manifest-utils.mjs';
import { FsUtils } from '../core/fs-utils.mjs';

const { displayName } = DisplayUtils;
const { computeHashes } = ManifestUtils;
const { getDirname, writeJsonAtomic, safeReadJson } = FsUtils;

const __dirname = getDirname(import.meta.url);
const SOURCE_INSTRUCTIONS = path.join(__dirname, '../../..', 'assets', 'instructions');

/**
 * Canonical skill catalog — single source of truth for AGENTS.md rendering.
 * Order matches the desired Skill Registry output. Categories gate inclusion:
 * - core: always loaded
 * - backend: included when selection has at least one backend idiom
 * - frontend: included when selection has at least one frontend idiom
 * Competencies stay here because they ride alongside the stack gate.
 */
const SKILL_CATALOG = [
  {
    path: '.ai/skills/staff-dna.md',
    category: 'core',
    description: 'Engineering Laws (load in Phase CODE only)',
  },
  {
    path: '.ai/skills/code-style.md',
    category: 'core',
    description: 'Code Style, Naming, Engineering Standards',
  },
  { path: '.ai/skills/testing.md', category: 'core', description: 'Test Principles' },
  { path: '.ai/skills/security.md', category: 'core', description: 'Security-sensitive changes' },
  {
    path: '.ai/skills/observability.md',
    category: 'core',
    description: 'Logging, metrics, tracing',
  },
  { path: '.ai/skills/api-design.md', category: 'backend', description: 'API Design' },
  { path: '.ai/skills/data-access.md', category: 'backend', description: 'DB layer' },
  { path: '.ai/skills/sql-style.md', category: 'backend', description: 'SQL queries' },
  { path: '.ai/skills/ci-cd.md', category: 'backend', description: 'Pipelines & deploy' },
  { path: '.ai/skills/cloud.md', category: 'backend', description: 'Cloud & Containers' },
  {
    path: '.ai/instructions/competencies/backend.md',
    category: 'backend',
    description: 'BFF + API Strategy',
  },
  {
    path: '.ai/skills/ui-ux.md',
    category: 'frontend',
    description: 'UI/UX design system & writing voice',
  },
  {
    path: '.ai/instructions/competencies/frontend.md',
    category: 'frontend',
    description: 'Contract-Based UI System',
  },
];

function computeStackMetrics(idioms) {
  const hasBackend = idioms.some(
    (idiomFolderKey) => STACK_DISPLAY_NAMES[idiomFolderKey]?.isBackend
  );
  const hasFrontend = idioms.some(
    (idiomFolderKey) => STACK_DISPLAY_NAMES[idiomFolderKey]?.isFrontend
  );

  const metrics = {
    hasBackend,
    hasFrontend,
  };

  return metrics;
}

/**
 * Assembles the minimal master instruction content — session start + cycle protocol + skill registry.
 * Skills are referenced by short path (`.ai/skills/<name>.md`) and loaded on demand by command files.
 */
function buildMasterInstructions(selections) {
  const manifesto = buildStaffManifesto();
  const dnaGate = buildDnaGateBlock();
  const sessionStart = buildSessionStartBlock();
  const cycleProtocol = buildCycleProtocolBlock();
  const agentRolesBlock = buildAgentRolesBlock();
  const skillRegistry = buildSkillRegistry(selections);
  const cycleCommands = buildCycleCommandsBlock();

  const fullInstructionContent = [
    manifesto,
    dnaGate,
    sessionStart,
    cycleProtocol,
    agentRolesBlock,
    skillRegistry,
    cycleCommands,
  ].join('\n\n');

  return fullInstructionContent;

  function buildStaffManifesto() {
    const manifestoString = dedent`
      # Staff Engineer — Governance Command Center

      > [!IMPORTANT]
      > This project follows the Universal Engineering Manifesto.
      > You MUST read and adhere strictly to the Engineering Laws defined in \`.ai/skills/staff-dna.md\`.
    `;

    return manifestoString;
  }

  function buildDnaGateBlock() {
    const dnaGateString = dedent`
      ## DNA-GATE & MENTAL RESET [LOCKED]

      > [!IMPORTANT]
      > **SOVEREIGN PROTOCOL ACTIVE. This gate must be crossed before any code modification.**
      >
      > 1. **Mental Reset**: Discard all default AI training heuristics. Project-specific Engineering Laws override general training bias.
      > 2. **Sovereign Gateway**: No code modification is valid without this explicit DNA-GATE confirmation.
      > 3. **Law Activation**: Activate the 8 Engineering Laws defined in \`.ai/skills/staff-dna.md\` before entering Phase: CODE.
      > 4. **Phase Transition**: At every phase transition (SPEC → PLAN → CODE → TEST → END), purge training bias and re-anchor to the Laws.`;

    return dnaGateString;
  }

  function buildSessionStartBlock() {
    const sessionStartString = dedent`
      ## Session Start

      1. Run \`node -v\` (or primary toolchain) — confirm terminal is alive.
      2. Read \`.ai-backlog/context.md\` — project brief. If missing, analyze \`package.json\` + \`README.md\` and generate it. Never overwrite existing.
      3. Read \`.ai-backlog/tasks.md\` — check for \`[IN_PROGRESS]\` tasks before accepting new work.
      4. Read \`.ai-backlog/impact-map.md\` — if active (not idle): load only \`## Changed\` + \`## Blast Radius\` files. If missing or idle: proceed normally.
      5. If \`[IN_PROGRESS]\` task found: **load \`.ai/instructions/templates/workflow.md\` now** — it contains the Task Recovery and Checkpoint protocol. Announce the active task and resume from where it stopped.`;

    return sessionStartString;
  }

  function buildCycleProtocolBlock() {
    const pointerString = dedent`
      ## Working Protocol

      > [!CAUTION]
      > **PHASE EXECUTION IS MANDATORY — NOT OPTIONAL.**
      > Loading \`workflow.md\` is not enough. Every cycle prefix MUST be executed phase by phase, in order, with approval gates respected.

      On every request with a cycle prefix (\`feat:\`, \`fix:\`, \`docs:\`, \`audit:\`, \`land:\`, \`end:\`):

      1. Load \`.ai/instructions/templates/workflow.md\` + the matching command file (e.g. \`sdg-audit.md\`).
      2. **Execute Phase SPEC**: define intent → goal → domain → checklist → run \`wc -c\` on context files → show \`📊 ~N tokens loaded\` → **STOP and wait for approval.**
      3. **Execute Phase PLAN**: task breakdown → impact map → run \`wc -c\` on blast radius files → show \`📊 Task estimate: ~N tokens\` → **STOP and wait for approval.**
      4. **Execute Phase CODE**: cross the DNA-GATE, list active Laws, then follow the approved plan strictly.
      5. **Execute Phase TEST** → **Phase END** before closing the cycle.

      > **Skipping any phase or approval gate is a protocol violation equivalent to bypassing the DNA-GATE.**
      > Training heuristics ("this looks simple, I'll just do it") are not a valid reason to skip phases.
      > The process flow and token estimates are not optional UI — they are the sovereign contract between agent and developer.`;

    return pointerString;
  }

  function buildAgentRolesBlock() {
    const agentRolesString = dedent`
      ## Agent Roles

      > [!NOTE]
      > Read \`.ai/instructions/templates/agent-roles.md\` for the Agent Roles and Execution Protocol.`;

    return agentRolesString;
  }

  function buildSkillRegistry(currentSelections) {
    const stackIdioms = [...new Set(currentSelections.idioms ?? [])];
    const { hasBackend, hasFrontend } = computeStackMetrics(stackIdioms);
    const flavor = currentSelections.flavor;

    const relevantSkills = SKILL_CATALOG.filter((skill) => {
      if (skill.category === 'core') return true;
      if (skill.category === 'backend') return hasBackend;
      if (skill.category === 'frontend') return hasFrontend;
      return false;
    });

    const groupedByCategory = groupSkills(relevantSkills);

    const sections = [
      '## Skills — load on demand',
      '',
      '> Each skill is self-contained. Load only what the current cycle requires.',
      '',
    ];

    const categoryHeaders = { core: '**Core**', backend: '**Backend**', frontend: '**Frontend**' };
    for (const category of ['core', 'backend', 'frontend']) {
      const skills = groupedByCategory[category];
      if (!skills || skills.length === 0) continue;
      sections.push(categoryHeaders[category]);
      for (const skill of skills) {
        sections.push(`- \`${skill.path}\` — ${skill.description}`);
      }
      sections.push('');
    }

    const idiomLines = stackIdioms.map((idiomFolderKey) => {
      const idiomLabel = STACK_DISPLAY_NAMES[idiomFolderKey]?.name ?? idiomFolderKey;
      const idiomLine = `- \`.ai/instructions/idioms/${idiomFolderKey}/patterns.md\` — ${idiomLabel} Idioms & Patterns`;
      return idiomLine;
    });
    if (idiomLines.length > 0) {
      sections.push('**Stack idioms**', ...idiomLines, '');
    }

    if (flavor && flavor !== 'none') {
      sections.push(
        '**Architectural flavor**',
        `- \`.ai/instructions/flavor/principles.md\` — Flavor: ${displayName(flavor)}`,
        ''
      );
    }

    const registryBlock = sections.join('\n').trimEnd();
    return registryBlock;
  }

  function groupSkills(skills) {
    const groups = { core: [], backend: [], frontend: [] };
    for (const skill of skills) {
      if (groups[skill.category]) groups[skill.category].push(skill);
    }
    const groupedResult = groups;
    return groupedResult;
  }

  function buildCycleCommandsBlock() {
    const cycleCommandsString = dedent`
      ## Cycle Commands

      Load the matching command file at cycle start and follow its phases strictly.

      - \`feat:\` → \`.ai/commands/sdg-feat.md\` — Feature Cycle
      - \`fix:\` → \`.ai/commands/sdg-fix.md\` — Fix Cycle
      - \`docs:\` → \`.ai/commands/sdg-docs.md\` — Docs Cycle
      - \`audit:\` → \`.ai/commands/sdg-audit.md\` — Governance Audit
      - \`land:\` → \`.ai/commands/sdg-land.md\` — Project Inception
      - \`end:\` → \`.ai/commands/sdg-end.md\` — Close active cycle`;

    return cycleCommandsString;
  }
}

/**
 * Writes .ai-backlog/context.md and .ai-backlog/tasks.md at the project root.
 * Only writes each file if it does not already exist — never overwrites user content.
 */
function writeBacklogFiles(targetDirectory, selections) {
  const backlogDirectory = path.join(targetDirectory, '.ai-backlog');
  fs.mkdirSync(backlogDirectory, { recursive: true });

  writeContextFile(backlogDirectory, targetDirectory, selections);
  writeTasksFile(backlogDirectory);
  writeLearnedFile(backlogDirectory);
  writeTroubleshootFile(backlogDirectory);

  function detectProjectLanguage(projectDirectory) {
    const packagePath = path.join(projectDirectory, 'package.json');
    if (!fs.existsSync(packagePath)) return 'en';

    try {
      const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      // Basic detection via common Portuguese strings or i18n configs
      const deps = { ...packageData.dependencies, ...packageData.devDependencies };
      if (deps['i18next'] || deps['react-i18next']) {
        const localesDir = path.join(projectDirectory, 'src', 'locales');
        if (fs.existsSync(localesDir) && fs.readdirSync(localesDir).includes('pt-BR')) {
          const matchedLang = 'pt-BR';
          return matchedLang;
        }
      }
      if (
        packageData.description?.toLowerCase().includes('guia') ||
        packageData.description?.toLowerCase().includes('sistema')
      ) {
        const matchingDescriptionLang = 'pt-BR';
        return matchingDescriptionLang;
      }
    } catch {
      const fallbackLang = 'en';
      return fallbackLang;
    }
    const defaultLang = 'en';
    return defaultLang;
  }

  function writeContextFile(backlogDirectoryPath, projectDirectory, currentSelections) {
    const contextPath = path.join(backlogDirectoryPath, 'context.md');

    const language = detectProjectLanguage(projectDirectory);
    const partner = currentSelections.partner || {};
    const name = partner.name || (language === 'pt-BR' ? 'Dev Parceiro' : 'Dev Partner');
    const role = partner.role || (language === 'pt-BR' ? 'Fundador/Dev' : 'Founder/Dev');

    let partnerInfo = '';
    if (language === 'pt-BR') {
      partnerInfo = `${name} é o ${role}. Diga "Oi ${name.split(' ')[0]}". Comunicação em Português Brasileiro.`;
    } else {
      partnerInfo = `${name} is the ${role}. Say "Hello ${name.split(' ')[0]}". Communication in English.`;
    }

    if (fs.existsSync(contextPath)) {
      handleContextInjection(contextPath, partnerInfo);
      const injectedResult = undefined;
      return injectedResult;
    }

    const stackLine = (currentSelections.idioms ?? [])
      .map((idiomFolderKey) => STACK_DISPLAY_NAMES[idiomFolderKey]?.name ?? idiomFolderKey)
      .join(', ');

    const templatePath = path.join(SOURCE_INSTRUCTIONS, 'templates', 'backlog', 'context.md');
    let contextContent = fs.readFileSync(templatePath, 'utf8');
    contextContent = contextContent
      .replace('{{PROJECT_NAME}}', path.basename(projectDirectory))
      .replace('{{STACK}}', stackLine)
      .replace('{{PARTNER}}', partnerInfo);

    fs.writeFileSync(contextPath, contextContent);
  }

  function handleContextInjection(contextPath, partnerInfo) {
    const existingContent = fs.readFileSync(contextPath, 'utf8');
    if (existingContent.includes('## Partner')) return;

    const separator = existingContent.endsWith('\n') ? '' : '\n';
    const injection = `\n## Partner\n\n${partnerInfo}\n`;
    fs.appendFileSync(contextPath, `${separator}${injection}`);
  }

  function writeTasksFile(backlogDirectoryPath) {
    const tasksPath = path.join(backlogDirectoryPath, 'tasks.md');
    if (fs.existsSync(tasksPath)) return;
    const templatePath = path.join(SOURCE_INSTRUCTIONS, 'templates', 'backlog', 'tasks.md');
    fs.copyFileSync(templatePath, tasksPath);
  }

  function writeLearnedFile(backlogDirectoryPath) {
    const learnedPath = path.join(backlogDirectoryPath, 'learned.md');
    if (fs.existsSync(learnedPath)) return;
    const templatePath = path.join(SOURCE_INSTRUCTIONS, 'templates', 'backlog', 'learned.md');
    fs.copyFileSync(templatePath, learnedPath);
  }

  function writeTroubleshootFile(backlogDirectoryPath) {
    const troubleshootPath = path.join(backlogDirectoryPath, 'troubleshoot.md');
    if (fs.existsSync(troubleshootPath)) return;
    const templatePath = path.join(SOURCE_INSTRUCTIONS, 'templates', 'backlog', 'troubleshoot.md');
    fs.copyFileSync(templatePath, troubleshootPath);
  }
}

/**
 * Builds the Claude Code-specific CLAUDE.md content.
 * Uses @-import syntax so Claude Code loads governance files natively on session start.
 * Distinct from AGENTS.md: references rather than duplicates content.
 */
function buildClaudeContent() {
  const claudeContent = dedent`
    # SDG Agents — Claude Code Governance

    > [!IMPORTANT]
    > This file is read automatically by Claude Code on every session start.
    > Do not edit manually — regenerate with \`npx sdg-agents init\`.

    ## Auto-Load: Governance Context

    @.ai/skills/AGENTS.md
  `;

  const instructionSet = claudeContent;
  return instructionSet;
}

/**
 * Writes the universal agent config:
 *   - \`.ai/skills/AGENTS.md\` — canonical governance (consumed by any AI agent).
 *   - \`CLAUDE.md\` at repo root — thin pointer auto-loaded by Claude Code.
 *
 * Other IDEs (Cursor, Windsurf, Copilot, Gemini, Codex, Cline/Roo) should be
 * configured by the developer to read \`.ai/skills/AGENTS.md\` directly. See
 * README "Using with other IDEs" for native pointers per tool.
 */
function writeAgentConfig(targetDirectory, content) {
  const skillDir = path.join(targetDirectory, '.ai', 'skills');
  fs.mkdirSync(skillDir, { recursive: true });
  fs.writeFileSync(path.join(skillDir, 'AGENTS.md'), content);

  const claudePath = path.join(targetDirectory, 'CLAUDE.md');
  const claudeContent = buildClaudeContent();
  const existingClaude = fs.existsSync(claudePath) ? fs.readFileSync(claudePath, 'utf8') : null;
  if (existingClaude !== claudeContent) {
    fs.writeFileSync(claudePath, claudeContent);
  }
}

/**
 * Writes or updates .gitignore with SDG-managed entries.
 * Idempotent — each block only appends entries not already present.
 */
function writeGitignore(targetDirectory) {
  const gitignorePath = path.join(targetDirectory, '.gitignore');

  const BLOCKS = [
    {
      header: '# Environment — never commit secrets',
      entries: ['.env', '.env.*'],
    },
    {
      header: '# AI artifacts — session state, not project logic',
      entries: ['.ai-backlog/', 'tmp/', 'temp/'],
    },
  ];

  const existingContent = fs.existsSync(gitignorePath)
    ? fs.readFileSync(gitignorePath, 'utf8')
    : '';

  const existingLines = existingContent.split('\n').map((line) => line.trim());

  const blocksToAppend = BLOCKS.map((block) => {
    const missingEntries = block.entries.filter((entry) => !existingLines.includes(entry));
    if (missingEntries.length === 0) {
      const emptyBlock = null;
      return emptyBlock;
    }
    const alreadyHasHeader = existingContent.includes(block.header);
    const lines = alreadyHasHeader ? missingEntries : [block.header, ...missingEntries];
    const blockContent = lines.join('\n');
    return blockContent;
  }).filter(Boolean);

  if (blocksToAppend.length === 0) return;

  const separator = existingContent.length > 0 && !existingContent.endsWith('\n') ? '\n' : '';
  fs.appendFileSync(gitignorePath, `${separator}\n${blocksToAppend.join('\n\n')}\n`);
}

/**
 * Writes the .sdg-manifest.json with content hashes for future diff checks.
 */
function writeManifest(targetDirectory, selections, packageVersion) {
  const manifest = {
    generatedAt: new Date().toISOString(),
    sdgAgentVersion: packageVersion,
    selections,
    contentHashes: computeHashes(selections, SOURCE_INSTRUCTIONS),
  };

  const aiDirectory = path.join(targetDirectory, '.ai');
  fs.mkdirSync(aiDirectory, { recursive: true });

  const manifestPath = path.join(aiDirectory, '.sdg-manifest.json');
  const originalContent = fs.existsSync(manifestPath)
    ? fs.readFileSync(manifestPath, 'utf8')
    : null;

  writeJsonAtomic(manifestPath, manifest, originalContent);
}

/**
 * Injects automation scripts and configurations (Bump, Husky) if enabled.
 * Idempotent: skips if scripts/bump.mjs exists or if selections.bump is false.
 */
function writeAutomationScripts(targetDirectory, selections) {
  if (selections.bump === false) return;

  const scriptsDir = path.join(targetDirectory, 'scripts');
  const bumpScriptPath = path.join(scriptsDir, 'bump.mjs');

  // 1. Check for existing bump script in package.json to avoid collision
  const packagePath = path.join(targetDirectory, 'package.json');
  const packageData = safeReadJson(packagePath);
  if (!packageData) return;

  const hasExistingBump =
    packageData.scripts &&
    (packageData.scripts.bump || packageData.scripts.release || packageData.scripts.version);

  if (hasExistingBump && !fs.existsSync(bumpScriptPath)) {
    // If they have a script but not our file, we respect their script
    return;
  }

  // 2. Write bump.mjs template
  if (!fs.existsSync(bumpScriptPath)) {
    fs.mkdirSync(scriptsDir, { recursive: true });
    const templatePath = path.join(SOURCE_INSTRUCTIONS, 'templates', 'bump.mjs');
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    fs.writeFileSync(bumpScriptPath, templateContent);
  }

  // 3. Update package.json scripts
  if (!packageData.scripts) packageData.scripts = {};
  if (!packageData.scripts.bump) {
    packageData.scripts.bump = 'node scripts/bump.mjs';
    writeJsonAtomic(packagePath, packageData, fs.readFileSync(packagePath, 'utf8'));
  }

  // 4. Configure Husky if .husky exists
  const huskyDirectory = path.join(targetDirectory, '.husky');
  if (fs.existsSync(huskyDirectory)) {
    const prePushPath = path.join(huskyDirectory, 'pre-push');
    const nvmShim = dedent`
      # NVM Shim (Essential for projects Staff in Linux/NVM)
      export NVM_DIR="$HOME/.nvm"
      [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
    `;

    const bumpCmd = '# Pre-push check (non-mutating)\nnpm test';

    if (fs.existsSync(prePushPath)) {
      const content = fs.readFileSync(prePushPath, 'utf8');
      if (!content.includes('npm test')) {
        const separator = content.endsWith('\n') ? '' : '\n';
        const newPrePushContent = `${content}${separator}\n${nvmShim}\n${bumpCmd}\n`;
        fs.writeFileSync(prePushPath, newPrePushContent);
      }
    } else {
      const prePushContent = dedent`
        #!/usr/bin/env sh

        ${nvmShim}

        ${bumpCmd}
      `;
      fs.writeFileSync(prePushPath, prePushContent, { mode: 0o755 });
    }
  }
}

export const InstructionAssembler = {
  buildMasterInstructions,
  buildClaudeContent,
  writeAgentConfig,
  writeBacklogFiles,
  writeGitignore,
  writeManifest,
  writeAutomationScripts,
};
