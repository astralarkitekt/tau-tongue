# @astralarkitekt/tau-tongue

**A symbolic narrative algebra for meaning-making and storytelling.**

[![Version](https://img.shields.io/badge/version-3.7.0-blueviolet)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-ESM-blue)]()

---

## What Is Tau-Tongue?

Tau-Tongue is a deterministic symbolic pipeline that transforms any text into structured narrative data. It converts input text to numbers via Pythagorean numerology, reduces those numbers to digital roots, generates symbolic equations from a 256-operator algebra, decomposes those equations into braids, derives a crucible (thematic core), identifies antagonistic forces, locates inflection points, and produces a full narrative interpretation.

It is not AI. There is no neural network. It is pure algebraic structure — and yet the outputs land with an uncanny resonance because the mathematics of reduction naturally surfaces archetypal patterns in language.

As of v3.6.9, the entire pipeline is **config-injectable**. Supply a `TauTongueConfig` object and every layer — from digital root reduction through narrative interpretation — operates within your custom symbolic system.

**The constraint doesn't change. The vocabulary does.**

Learn more about how to use Tau-Tongue on the Astral Architecture blog!

[Tau-Tongue & Braidcraft: My secret sauce to writing better faster](https://www.astralarchitecture.com/blog/2026/tau-tongue-and-braidcraft/)

Website in the works!

---

## Quick Start

```bash
npm install @astralarkitekt/tau-tongue
```

```typescript
import { TauTongueInterpreter } from '@astralarkitekt/tau-tongue';

const interpreter = new TauTongueInterpreter();
const result = interpreter.interpret('Once upon a time');

console.log(result.archetype);           // "The Dreamweaver"
console.log(result.resonance);           // "SOURCE"
console.log(result.symbolicEquation);    // "∂(1, [∇(3,4),⊗(1,3,9,2,4,4,6), ...])"
console.log(result.crucible);            // "≳(8) - A mythic potential (≳) acting upon The Mechanist"
console.log(result.narrativeInterpretation);
```

The `TauTongueResult` object contains everything: digital root, archetype, resonance, symbolic equation, braid breakdown, crucible, antagonist, inflection points, and narrative interpretation.

---

## Custom Symbolic Systems

The headline feature of v3. Pass a `TauTongueConfig` to the constructor and the entire pipeline adapts:

```typescript
import { TauTongueInterpreter, SceneFunction } from '@astralarkitekt/tau-tongue';

const jungian = new TauTongueInterpreter({
  archetypeMap: {
    1: 'The Hero',
    2: 'The Shadow',
    3: 'The Anima',
    // ... up to 12
  },
  archetypeDescriptions: {
    'The Hero': 'The conscious ego embarking on the journey...',
    'The Shadow': 'The repressed darkness...',
    // ...
  },
  resonanceMap: {
    1: 'QUEST',
    2: 'REPRESSION',
    3: 'INTUITION',
    // ...
  },
  resonanceDescriptions: {
    'QUEST': 'The call to adventure...',
    // ...
  },
  archetypeFunctionMap: {
    1: SceneFunction.ACTION,
    2: SceneFunction.FLASHBACK,
    // ...
  },
  typalNumbers: [10, 11, 12],
});

const result = jungian.interpret('What does the shadow want?');
console.log(result.archetype); // A Jungian archetype, not BraidCraft
```

### TauTongueConfig

Every field is optional. Omitted fields fall back to the BraidCraft defaults.

| Field | Type | Description |
|-------|------|-------------|
| `archetypeMap` | `Record<number, string>` | Digital root → archetype name. Keys define valid reduction endpoints. |
| `archetypeDescriptions` | `Record<string, string>` | Archetype name → prose description. |
| `resonanceMap` | `Record<number, string>` | Digital root → resonance label (e.g. `"QUEST"`). |
| `resonanceDescriptions` | `Record<string, string>` | Resonance label → prose description. |
| `archetypeFunctionMap` | `Record<number, SceneFunction>` | Digital root → narrative scene function (used by TauSpine). |
| `symbolMap` | `Record<string, SymbolDefinition>` | Custom operator algebra — symbol → definition. |
| `typalNumbers` | `number[]` | Numbers that halt digital-root reduction (default: `[11, 22]`). |

### Typal Numbers

A typal number is any multi-digit number you want to preserve as a valid reduction endpoint instead of summing it down to a single digit. In the default BraidCraft system, `11` and `22` are typal. In a Norse system you might use `[24]` for the Elder Futhark count. In a Jungian system, `[10, 11, 12]`.

Single-digit numbers (1–9) don't need to be listed — they're natural endpoints by definition.

---

## API Reference

### Core: `TauTongueInterpreter`

```typescript
const interpreter = new TauTongueInterpreter(config?: TauTongueConfig);
```

| Method | Returns | Description |
|--------|---------|-------------|
| `interpret(input)` | `TauTongueResult` | Full pipeline: text → digital root → equation → braid → crucible → narrative. |
| `getCrucible(equation, digitalSum, resonance, archetype)` | `string` | Extract the crucible operator and description from a symbolic equation. |
| `getMicroCrucible(braidFunction)` | `string` | Get a micro-crucible from a single braid function. |
| `getAntagonist(equation)` | `TauTongueAntagonist` | Extract the antagonist (longest braid) from the symbolic equation. |
| `analyzeInterference(result)` | `InflectionPoint[]` | Locate inflection points between braid functions and the interference wave. |
| `getInterferenceWave(result)` | `string` | Calculate the Braid Interference Wave. |
| `extractNarrativePalette(braid)` | `NarrativePalette` | Analyze the distribution of scene functions across the braid. |
| `getFunctionDescription(func)` | `string` | Get a prose description for a symbolic function string. |
| `getSymbol(symbol)` | `SymbolDefinition \| undefined` | Look up a symbol definition from the configured symbol map. |
| `getSymbols()` | `string[]` | Get all symbol keys from the configured symbol map. |
| `render(canvas, result, options?)` | `void` | Render the tau spiral visualization on an HTML canvas. |

### Legacy Interpreters (v1 & v2)

The pre-config-injection interpreters are available under aliased exports for backward compatibility or comparison:

```typescript
import { TauTongueInterpreterV1, TauTongueInterpreterV2 } from '@astralarkitekt/tau-tongue';
import type { TauTongueResultV1, TauTongueResultV2 } from '@astralarkitekt/tau-tongue';

const v2 = new TauTongueInterpreterV2();
const result = v2.interpret('some text'); // Uses hardcoded BraidCraft defaults
```

These are frozen at their original implementations — no config injection, no `TauTongueConfig`. Use the primary `TauTongueInterpreter` (v3) for new work.

### Narrative Structure: `TauSpine`

`TauSpine` extends `TauTongueInterpreter` and generates recursive narrative trees from interpreted results.

```typescript
import { createTauSpine, SpineFormat } from '@astralarkitekt/tau-tongue';

const spine = await createTauSpine('Once upon a time', SpineFormat.NOVEL);
console.log(spine.spine);  // TauSpineNode[]
console.log(spine.stats);  // { totalNodes, maxDepth, generationTime }

// Or with a custom config:
const spine = await createTauSpine('Once upon a time', SpineFormat.NOVEL, jungianConfig);
```

**SpineFormat** determines the narrative scope:

| Format | Value | Description |
|--------|-------|-------------|
| `SHORT` | 6 | Short story |
| `NOVELETTE` | 7 | Novelette |
| `NOVELLA` | 8 | Novella |
| `NOVEL` | 9 | Novel |
| `EPIC` | 11 | Epic |
| `SAGA` | 22 | Saga |

Spine results can be flattened to a simple scene list via `spine.flatten()`, and scene paths formatted with `getPath(scene)`.

### Pythagorean Utilities

Low-level functions for numerological reduction. These accept an optional `PythagoreanConfig` (derived automatically when using `TauTongueInterpreter`).

| Function | Description |
|----------|-------------|
| `convertToNumbers(text)` | Convert text to a string of Pythagorean digit values. |
| `calculateDigitalRoot(numStr, config?)` | Reduce a number string to its digital root, respecting typal numbers. |
| `cipherCycle(numeroCipher, resonance, config?)` | Generate a cipher cycle string (async). |
| `extractBraidDigits(equation)` | Extract braid digits from a symbolic equation string. |
| `integerStringFromBase36(bs)` | Convert a base-36 string to its integer representation. |

### Symbol Algebra

```typescript
import { DEFAULT_SYMBOL_MAP } from '@astralarkitekt/tau-tongue';
import type { SymbolDefinition } from '@astralarkitekt/tau-tongue';
```

Each `SymbolDefinition` contains:

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Display name (e.g. "Partial Derivative") |
| `mathMeaning` | `string` | Formal mathematical meaning |
| `metaphoricalMeaning` | `string` | Narrative meaning used in interpretation |

### Phoneme Generation

```typescript
import { generatePhonemeticNames } from '@astralarkitekt/tau-tongue';

const names = generatePhonemeticNames('12345', 0, 10);
// Returns 10 phonemic word variations derived from the numerocipher
```

### Default Constants

All BraidCraft defaults are available as named exports:

- `DEFAULT_ARCHETYPE_MAP`
- `DEFAULT_ARCHETYPE_DESCRIPTIONS`
- `DEFAULT_RESONANCE_MAP`
- `DEFAULT_RESONANCE_DESCRIPTIONS`
- `DEFAULT_ARCHETYPE_FUNCTION_MAP`
- `DEFAULT_SYMBOL_MAP`
- `DEFAULT_TYPAL_NUMBERS`

### Types

All TypeScript types are exported:

```typescript
import type {
  TauTongueConfig,
  TauTongueResult,
  TauTongueAntagonist,
  BraidInterpretation,
  InflectionPoint,
  NarrativePalette,
  RenderOptions,
  PythagoreanConfig,
  SymbolDefinition,
  TauSpineNode,
  TauSpineResult,
  FlattenedTauSpineResult,
  FlattenedScene,
  ArchetypalMatrix,
  ArchetypalEntry,
  FormatData,
  UnitSpec,
} from '@astralarkitekt/tau-tongue';
```

---

## Demo Gallery

Live demos at [tools.astralarchitecture.com/tau-tongue](https://tools.astralarchitecture.com/tau-tongue/):

| Demo | Description |
|------|-------------|
| [Interpreter](https://tools.astralarchitecture.com/tau-tongue/demos/interpreter.html) | Full result workbench — digital root, archetype, equation, braid, crucible, narrative. |
| [Spine Generator](https://tools.astralarchitecture.com/tau-tongue/demos/spine-generator.html) | Recursive `TauSpine` tree visualization from input text. |
| [TauSigils](https://tools.astralarchitecture.com/tau-tongue/demos/TauSigils.html) | Ethereal continuous-line sigil drawings from braid structure. |
| [TauGlyphs](https://tools.astralarchitecture.com/tau-tongue/demos/TauGlyphs.html) | Colored node graphs showing structural braid relationships. |
| [TauAlchemy](https://tools.astralarchitecture.com/tau-tongue/demos/TauAlchemy.html) | Animated alchemical seal geometry driven by braid data. |
| [TauAstrolabe](https://tools.astralarchitecture.com/tau-tongue/demos/TauAstrolabe.html) | Alchemical system (v3 config) — celestial orbit visualization. |
| [TauAether](https://tools.astralarchitecture.com/tau-tongue/demos/TauAether.html) | Norse Runic system (v3 config) — organic aether energy fields. |
| [Jung-Tongue](https://tools.astralarchitecture.com/tau-tongue/demos/JungTongue.html) | Jungian chatbot — 12 archetypes, session persistence, voice input. |

---

## Project Structure

```
src/
  index.ts                          # Public API re-exports
  pythagoreanUtils.ts               # Numerological reduction utilities
  phonemeCipher.ts                  # Phonemic name generation
  tau-tongue/
    TauTongueInterpreter_v3.ts      # Core interpreter — config-injectable (v3)
    TauTongueInterpreter_v2.ts      # Legacy interpreter (v2, pre-config)
    TauTongueInterpreter_v1.ts      # Legacy interpreter (v1)
    TauSpine.ts                     # Recursive narrative structure generator
    TauTongueSymbolMap.ts           # 256-operator symbol algebra
    TauTongueRenderer.ts            # Canvas spiral renderer
    TauTongueFictionTypeMap.ts      # Fiction type classification
    TauTomeCoverRenderer.ts         # Book cover generation
    symbol-map.json                 # Symbol definitions data
    archetype-fiction-type-map.json  # Archetype → fiction type mapping
    story-unit-specs.json           # Narrative unit specifications
demos/
  interpreter.html                  # Full result workbench
  spine-generator.html              # TauSpine tree visualizer
  TauSigils.html                    # Sigil art renderer
  TauGlyphs.html                    # Glyph graph renderer
  TauAlchemy.html                   # Alchemical seal geometry
  TauAstrolabe.html                 # Alchemical config demo (v3)
  TauAether.html                    # Norse Runic config demo (v3)
  JungTongue.html                   # Jungian chatbot demo
  jung-tongue-config.js             # Jungian symbolic system config
```

---

## Development

```bash
git clone https://github.com/astralarkitekt/tau-tongue.git
cd tau-tongue
npm install
npm run build          # Compiles TypeScript to dist/
```

Demos load from `../dist/index.js` as ES modules — open any HTML file in `demos/` after building.

---

## Author

**Astral Arkitekt** — [astralarkitekt@gmail.com](mailto:astralarkitekt@gmail.com)

Built with deterministic algebra, insomnia, and an unreasonable amount of love. I mean coffee.
