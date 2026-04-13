/**
 * Build Bundle — Orchestrates wizard, injection, and assembly.
 */

import { createRequire } from 'node:module';
import path from 'node:path';

import { WizardUtils } from '../../lib/domain/wizard.mjs';
import { RulesetInjector } from '../../lib/domain/ruleset-injector.mjs';
import { InstructionAssembler } from '../../lib/domain/instruction-assembler.mjs';
import { ResultUtils } from '../../lib/core/result-utils.mjs';
import { FsUtils } from '../../lib/core/fs-utils.mjs';
import { BundleUI } from '../../lib/core/ui-utils.mjs';

const { gatherUserSelections, validateSelections, autoSelectVersions } = WizardUtils;
const { prepareProjectStructure, injectRulesets, injectPrompts } = RulesetInjector;
const {
  buildMasterInstructions,
  buildPromptModeStub,
  writeAgentConfig,
  writeBacklogFiles,
  writeGitignore,
  writeManifest,
  writeAutomationScripts,
  getActiveAgents,
} = InstructionAssembler;
const { success } = ResultUtils;
const { runIfDirect } = FsUtils;
const {
  printWelcome,
  printStep,
  printAborted,
  printQuickSetupStart,
  printProjectRoot,
  printSuccessAgents,
  printSuccessPrompts,
  printQuickSuccess,
  printQuickDryRun,
  printDryRunPreview,
  printBuildSummary,
} = BundleUI;

const require = createRequire(import.meta.url);
const packageJson = require('../../../../package.json');

/**
 * Entry point for both interactive (wizard) and non-interactive (flags) modes.
 */
async function run(targetDirectory = process.cwd(), options = {}) {
  printWelcome();

  if (options.selections) {
    return runNonInteractive(targetDirectory, options);
  }

  return runInteractive(targetDirectory, options);
}

async function runNonInteractive(targetDirectory, options) {
  const { dryRun = false, noDevGuides = false, selections } = options;

  const validationResult = validateSelections(selections);
  if (validationResult.isFailure) {
    console.log(`\n  ⚠️  ${validationResult.error.message}`);
    process.exit(1);
  }

  autoSelectVersions(selections);

  const state = { step: 'execute', userSelections: selections };
  const result = await handleFinalExecutionPhase(state, targetDirectory, {
    dryRun,
    noDevGuides,
    skipConfirm: true,
  });
  if (result.isFailure) {
    console.log(`\n  ⚠️  ${result.error.message}`);
    process.exit(1);
  }
}

async function runInteractive(targetDirectory, options) {
  const state = { step: 'selections', userSelections: null };

  while (state.step !== 'done') {
    const result = await handleExecutionStep(state, targetDirectory, options);
    if (result.isFailure) {
      if (result.error.code !== 'USER_BACK') {
        console.log(`\n  ⚠️  ${result.error.message}`);
      }
      return;
    }
  }
}

async function handleExecutionStep(state, targetDirectory, options) {
  switch (state.step) {
    case 'selections':
      return handleSelectionPhase(state, targetDirectory);
    case 'execute':
      return handleFinalExecutionPhase(state, targetDirectory, options);
    default:
      return success();
  }
}

async function handleSelectionPhase(state, targetDirectory) {
  const result = await gatherUserSelections(targetDirectory);
  if (result.isFailure) return result;

  state.userSelections = result.value;
  state.step = 'execute';
  return success();
}

async function handleFinalExecutionPhase(state, targetDirectory, options = {}) {
  const { dryRun = false, noDevGuides = false, skipConfirm = false } = options;
  const selections = state.userSelections;

  if (selections.mode === 'quick') {
    return runQuickMode(state, targetDirectory, { dryRun, noDevGuides });
  }

  if (dryRun) {
    printDryRunPreview(selections, targetDirectory);
    state.step = 'done';
    return success();
  }

  if (selections.mode === 'prompts') {
    return runPromptsMode(state, targetDirectory, selections, { skipConfirm });
  }

  if (selections.mode === 'creatives') {
    return runCreativesMode(state, targetDirectory);
  }

  return runAgentsMode(state, targetDirectory, selections, { skipConfirm, noDevGuides });
}

async function runQuickMode(state, targetDirectory, { dryRun, noDevGuides = false }) {
  if (dryRun) return abortForDryRun(state, targetDirectory, printQuickDryRun);

  printQuickSetupStart();
  executeQuickPipeline(targetDirectory, state.userSelections, { noDevGuides });

  printQuickSuccess(targetDirectory);
  state.step = 'done';
  return success();
}

async function runPromptsMode(state, targetDirectory, selections, { skipConfirm = false } = {}) {
  const confirmed = skipConfirm || (await printBuildSummary(selections));
  if (!confirmed) return abortExecution(state);

  printProjectRoot(targetDirectory);
  executePromptsPipeline(targetDirectory, selections);

  printSuccessPrompts(targetDirectory);
  state.step = 'done';
  return success();
}

async function runAgentsMode(
  state,
  targetDirectory,
  selections,
  { skipConfirm = false, noDevGuides = false } = {}
) {
  const confirmed = skipConfirm || (await printBuildSummary(selections));
  if (!confirmed) return abortExecution(state);

  printProjectRoot(targetDirectory);
  executeAgentsPipeline(targetDirectory, selections, { noDevGuides });

  printSuccessAgents(targetDirectory);
  state.step = 'done';
  return success();
}

async function runCreativesMode(state, targetDirectory) {
  const { Creatives } = await import('./creatives-bundle.mjs');
  const result = await Creatives.run(targetDirectory);
  state.step = 'done';
  return result;
}

function abortForDryRun(state, targetDirectory, printer) {
  printer(targetDirectory);
  state.step = 'done';
  return success();
}

function abortExecution(state) {
  printAborted();
  state.step = 'done';
  return success();
}

function executeQuickPipeline(targetDirectory, selections, { noDevGuides = false } = {}) {
  printStep(1, 5, 'Preparing .ai/ structure...');
  prepareProjectStructure(targetDirectory);

  printStep(2, 5, 'Injecting rules and dev-guides...');
  injectRulesets(targetDirectory, selections, { noDevGuides });

  printStep(3, 5, 'Assembling AGENTS.md...');
  const content = buildMasterInstructions(selections);

  printStep(4, 5, 'Writing agent config and backlog...');
  writeAgentConfig(targetDirectory, content, getActiveAgents(selections));
  writeBacklogFiles(targetDirectory, selections);
  writeGitignore(targetDirectory);

  printStep(5, 5, 'Injecting spec templates...');
  injectPrompts(targetDirectory, selections.track);
  writeAutomationScripts(targetDirectory, selections);
  writeManifest(targetDirectory, selections, packageJson.version);
}

function executePromptsPipeline(targetDirectory, selections) {
  printStep(1, 3, 'Preparing .ai/ structure...');
  prepareProjectStructure(targetDirectory);

  printStep(2, 3, `Injecting specification track: ${selections.track}...`);
  injectPrompts(targetDirectory, selections.track);

  printStep(3, 3, 'Writing prompts-only fallback config...');
  const stubContent = buildPromptModeStub();
  writeAgentConfig(targetDirectory, stubContent, getActiveAgents(selections));
  writeGitignore(targetDirectory);
}

function executeAgentsPipeline(targetDirectory, selections, { noDevGuides = false } = {}) {
  printStep(1, 5, 'Preparing .ai/ structure...');
  prepareProjectStructure(targetDirectory);

  printStep(2, 5, 'Injecting rules and dev-guides...');
  injectRulesets(targetDirectory, selections, { noDevGuides });

  printStep(3, 5, 'Assembling AGENTS.md...');
  const content = buildMasterInstructions(selections);

  printStep(4, 5, 'Writing agent config and backlog...');
  writeAgentConfig(targetDirectory, content, getActiveAgents(selections));
  writeBacklogFiles(targetDirectory, selections);
  writeGitignore(targetDirectory);

  printStep(5, 5, 'Finalizing manifest...');
  writeAutomationScripts(targetDirectory, selections);
  writeManifest(targetDirectory, selections, packageJson.version);
}

// getActiveAgents is now imported from InstructionAssembler

export const SDG = {
  run,
};

runIfDirect(import.meta.url, () => {
  const targetDirectory = process.argv[2] ?? process.cwd();
  const dryRun = process.argv.includes('--dry-run');
  return run(path.resolve(targetDirectory), { dryRun });
});
