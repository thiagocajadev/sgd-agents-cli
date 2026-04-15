# UI/UX System — Architecture & Design Decisions

This document explains the structure and reasoning behind the UI/UX instruction set installed by `sdg-agents`. It is intended for developers who want to understand why the system is organized the way it is, and how to navigate it.

The four files that govern UI/UX work are located at `.ai/instructions/core/ui/`.

---

## The Hierarchy

```
design-thinking.md   ← entry point — the aesthetic contract
      ↓
standards.md         ← quality rules (a11y, motion, states, spacing)
presets.md           ← visual contracts per design language
architecture.md      ← component structure and code conventions
```

No UI work begins without `design-thinking.md`. It is the only file that **blocks**: an agent cannot generate UI code without first declaring a Palette, Preset, Tone, and Typography. The other three files are specializations that execute the contract in their respective domains.

---

## Single Source of Truth (by domain)

| Domain                                                 | Owner                | What it governs                                                                       |
| :----------------------------------------------------- | :------------------- | :------------------------------------------------------------------------------------ |
| Palette, surface tonal scale, nesting rule, typography | `design-thinking.md` | The aesthetic foundation — OKLCH tokens, S0–S3 elevation, luminance delta, font pairs |
| Mobile-first, motion, states, a11y, spacing (L1–L4)    | `standards.md`       | Browser quality rules — universal, preset-independent                                 |
| Design presets, composition rules, token contracts     | `presets.md`         | How each visual language (BENTO, GLASS, CLEAN, MONO…) maps the contract to markup     |
| ViewModel pattern, state management, agent checklist   | `architecture.md`    | How components are built — code structure, not visual decisions                       |

No rule lives in two places. When a file references another domain, it links — it does not restate.

---

## Why design-thinking.md is the Entry Point

The most common failure mode in AI-generated UI is aesthetic incoherence: technically correct markup that produces visually inconsistent, unreadable, or flat interfaces. The agent knows how to write components, but without constraints it makes arbitrary color, surface, and typography choices.

`design-thinking.md` solves this by requiring an explicit contract before any code is written:

```
🎨 Design Contract
─────────────────────────────────
Palette:        [Default Zinc+Blue | Custom H=___ + H=___]
Preset:         [BENTO | GLASS | CLEAN | MONO | NEOBRUTALISM | PAPER]
Tone:           "[adjective] for [audience] who need [outcome]"
Differentiator: [the one memorable element]
Typography:     [Display font] + [Body font]
─────────────────────────────────
```

If the agent cannot fill these fields, it must ask before proceeding.

---

## The Surface Tonal Scale (S0–S3)

The elevation system is based on a single principle: **luminance reflects hierarchy, not arbitrary color**.

```
S0 → page background
S1 → sections, sidebars
S2 → cards, floating elements
S3 → modals, tooltips, hover states
```

Direction differs by theme:

- Dark theme: rising level = lighter surface
- Light theme: rising level = darker surface

Each level transition must differ by **4–8% L** in OKLCH Lightness. Less than 4% collapses the hierarchy visually. More than 8% creates visual aggression between adjacent surfaces.

The nesting rule is absolute: an element inside a container is always at a level ≥ its parent. Levels are never skipped. Interactive states always add +1 visual level.

Full specification and anti-patterns: [design-thinking.md](../.ai/instructions/core/ui/design-thinking.md) Phase 0.2.

---

## The Design Presets

Each preset is a complete visual contract — typography, surface, borders, radius, states, elevation, and density. Presets are not themes; they are full design languages. Mixing two presets is prohibited.

| Preset       | Personality                   | Default palette                 |
| :----------- | :---------------------------- | :------------------------------ |
| BENTO        | Modular dashboard             | Zinc + Blue H=250               |
| GLASS        | Layered, depth-driven         | Zinc + Violet H=290             |
| CLEAN        | Professional, high whitespace | Zinc + Blue H=250 or Teal H=200 |
| MONO         | Developer-centric             | Zinc only (monochromatic)       |
| NEOBRUTALISM | Bold, high-contrast           | Any high-chroma primary C≥0.18  |
| PAPER        | Warm, editorial               | Zinc + Amber H=80               |

Safe combinations and nesting rules: [presets.md](../.ai/instructions/core/ui/presets.md).

---

## Reference

- [design-thinking.md](../.ai/instructions/core/ui/design-thinking.md) — Palette, tonal scale, typography, aesthetic direction
- [standards.md](../.ai/instructions/core/ui/standards.md) — Browser quality rules, spacing, states, accessibility
- [presets.md](../.ai/instructions/core/ui/presets.md) — Visual presets, composition system, token contracts
- [architecture.md](../.ai/instructions/core/ui/architecture.md) — ViewModel pattern, state management, agent checklist
