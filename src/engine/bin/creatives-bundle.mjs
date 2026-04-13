import { createRequire } from 'node:module';
import { RulesetInjector } from '../lib/ruleset-injector.mjs';
import { InstructionAssembler } from '../lib/instruction-assembler.mjs';
import { ManifestUtils } from '../lib/manifest-utils.mjs';
import { BundleUI } from '../lib/ui-utils.mjs';
import { ResultUtils } from '../lib/result-utils.mjs';

const { injectCreativeToolkit } = RulesetInjector;
const {
  buildMasterInstructions,
  writeAgentConfig,
  writeBacklogFiles,
  getActiveAgents,
  writeManifest,
} = InstructionAssembler;
const { loadManifest } = ManifestUtils;
const { printStep, printProjectRoot } = BundleUI;
const { success } = ResultUtils;

const require = createRequire(import.meta.url);
const packageJson = require('../../../package.json');

async function run(targetDir = process.cwd()) {
  console.log('\n  🎨 Creative Design Toolkit — Initializing...\n');

  const manifest = loadManifest(targetDir);
  const selections = manifest?.selections || {
    mode: 'agents',
    flavor: 'none',
    idioms: [],
    agents: ['antigravity'], // Default for creative flow
  };

  printProjectRoot(targetDir);

  printStep(1, 4, 'Injecting Creative Skills and Templates...');
  injectCreativeToolkit(targetDir);

  printStep(2, 4, 'Updating AGENTS.md with routing...');
  const content = buildMasterInstructions(selections);

  const activeAgents = getActiveAgents(selections);
  writeAgentConfig(targetDir, content, activeAgents);

  printStep(3, 4, 'Syncing Backlog...');
  writeBacklogFiles(targetDir, selections);

  printStep(4, 4, 'Finalizing Manifest...');
  writeManifest(targetDir, selections, packageJson.version);

  console.log('\n  ✅ Creative Design Toolkit injected successfully!');
  console.log('  👉 Use the chat to start your Design Thinking session.\n');

  return success();
}

export const Creatives = { run };
