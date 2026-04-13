/**
 * Creatives Bundle — Orchestrates the Creative Design Toolkit injection.
 */

import { RulesetInjector } from '../lib/ruleset-injector.mjs';
import { InstructionAssembler } from '../lib/instruction-assembler.mjs';
import { ManifestUtils } from '../lib/manifest-utils.mjs';
import { BundleUI } from '../lib/ui-utils.mjs';
import { ResultUtils } from '../lib/result-utils.mjs';

const { injectCreativeToolkit } = RulesetInjector;
const { buildMasterInstructions, writeAgentConfig, writeBacklogFiles } = InstructionAssembler;
const { loadManifest } = ManifestUtils;
const { printStep, printProjectRoot } = BundleUI;
const { success } = ResultUtils;

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

  printStep(1, 3, 'Injecting Creative Skills and Templates...');
  injectCreativeToolkit(targetDir);

  printStep(2, 3, 'Updating AGENTS.md with routing...');
  const content = buildMasterInstructions(selections);

  // getActiveAgents helper logic replicated
  const agentCandidates = [...(selections.agents || []), selections.ide];
  const activeAgents = agentCandidates.filter((agent) => agent !== null && agent !== undefined);

  writeAgentConfig(targetDir, content, activeAgents);

  printStep(3, 3, 'Syncing Backlog...');
  writeBacklogFiles(targetDir, selections);

  console.log('\n  ✅ Creative Design Toolkit injected successfully!');
  console.log('  👉 Use the chat to start your Design Thinking session.\n');

  return success();
}

export const Creatives = { run };
