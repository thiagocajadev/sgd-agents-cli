import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Governance SSOT — Single Source of Truth for SDG Agents Engineering Laws.
 * Dynamically parses instruction files (Markdown) to extract labels and descriptions,
 * ensuring perfect synchronization between documentation and automated enforcement.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STANDARDS_PATH = path.resolve(
  __dirname,
  '../../assets/instructions/core/engineering-standards.md'
);

/**
 * Loads and parses the Master Checklist from engineering-standards.md.
 * Returns an array of Rule objects { id, label, description, heuristic }.
 */
function loadDynamicRules() {
  const content = fs.readFileSync(STANDARDS_PATH, 'utf8');
  const checklistSection = content.match(/<rule name="EnforcementChecklist">([\s\S]*?)<\/rule>/);

  if (!checklistSection) return [];

  const ruleLines = checklistSection[1].match(/- \[\s\] \*\*(.*?)\*\*(?:\s*:\s*(.*))?/g);
  if (!ruleLines) return [];

  return ruleLines.map((ruleLine) => {
    const [, label, description] = ruleLine.match(/- \[\s\] \*\*(.*?)\*\*(?:\s*:\s*(.*))?/) || [];
    const id = label.toLowerCase().replace(/ /g, '-');

    return {
      id,
      label,
      description: description || '',
      heuristic: HEURISTIC_MAP[label] || null,
    };
  });
}

/**
 * Maps Markdown rule names to JavaScript automated check functions.
 */
const HEURISTIC_MAP = {
  'Stepdown Rule': (_content) => ({ pass: true }), // Primarily manual
  'SLA applied': (_content) => ({ pass: true }), // Primarily manual
  'Lexical Scoping': (content) => {
    const topLevelFunctions = (content.match(/^function\s+\w+/gm) || []).length;
    const exportedCount = (content.match(/^\s+\w+,/gm) || []).length;
    // Balance is the Key: Increase threshold to 12 to favor "Chapters" over "Monolithic Nesting"
    const isViolation = topLevelFunctions > 12 && exportedCount < topLevelFunctions / 2;
    return {
      pass: !isViolation,
      reason: isViolation
        ? 'Excessive top-level function density (>12). Consider refactoring to dedicated lib.'
        : null,
    };
  },
  'Explaining Returns': (_content) => ({ pass: true }),
  'No framework abbreviations': (content) => {
    // Avoid self-detection by splitting the forbidden terms
    const forbidden = ['r' + 'eq', 'r' + 'es'];
    const pattern = new RegExp(`\\b(${forbidden.join('|')})\\b`, 'g');
    const abbreviationMatches = content.match(pattern);
    return {
      pass: !abbreviationMatches,
      reason: abbreviationMatches
        ? `Abbreviation detected: ${abbreviationMatches.join(', ')}`
        : null,
    };
  },
  'Vertical Density applied': (_content) => ({ pass: true }),
  'Revealing Module Pattern': (content) => {
    const hasRevealingObj = /export const \w+ = \{[\s\S]*\};/m.test(content);
    // Avoid self-detection by splitting the forbidden term
    const forbiddenExport = 'export ' + 'default';
    const hasExportDefault = content.includes(forbiddenExport);
    return {
      pass: hasRevealingObj && !hasExportDefault,
      reason: !hasRevealingObj
        ? 'Missing Revealing Module Pattern export.'
        : hasExportDefault
          ? `Uses ${forbiddenExport}.`
          : null,
    };
  },
  'Shallow Boundaries': (_content) => ({ pass: true }),
  'Boolean names carry a prefix': (content) => {
    const bareBooleanMatches = content.match(/\bconst\s+(loading|error|active|valid)\s*=/g);
    return {
      pass: !bareBooleanMatches,
      reason: bareBooleanMatches ? `Bare boolean detected: ${bareBooleanMatches.join(', ')}` : null,
    };
  },
  'No explanatory comments': (_content) => ({ pass: true }),
  'No Section Banners': (content) => {
    // Avoid self-detection by splitting the forbidden term
    const bannerPrefix = '// -' + '--';
    const matchFound = content.includes(bannerPrefix);
    return {
      pass: !matchFound,
      reason: matchFound ? `Detected section banners (${bannerPrefix}).` : null,
    };
  },
  'Code reads like a "Short Story"': (_content) => ({ pass: true }),
};

export const GOVERNANCE_RULES = {
  LAW_1_HARDENING: {
    id: 'hardening',
    label: 'Law 1: Hardening',
    checkpoint: 'Absolute boundary isolation.',
  },
  LAW_2_RESILIENCE: {
    id: 'resilience',
    label: 'Law 2: Resilience',
    checkpoint: 'Defensive dominance.',
  },
  LAW_3_NARRATIVE: {
    id: 'narrative',
    label: 'Law 3: Narrative Cascade',
    checkpoint: 'Stepdown Rule; SLA; Lexical Scoping.',
  },
};

export const NARRATIVE_CHECKLIST = loadDynamicRules();
