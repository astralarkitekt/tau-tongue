# Tau-Tongue v3 Roadmap
## Arbitrary IP Support — Road to v3.6.9

---

## Vision

Tau-Tongue v3 makes the entire symbolic pipeline config-injectable. A consumer passes a single `TauTongueConfig` object to `TauTongueInterpreter` and every layer of the stack — reduction, equation generation, crucible derivation, braid description, narrative interpretation, spine generation — operates within their custom symbolic system end to end.

**The constraint doesn't change. The vocabulary does.**

---

## Core Concepts Introduced in v3

### Typal Numbers
Replaces the term "master numbers" which carries Pythagorean-school baggage. A **Typal Number** is any number that maps to a Type in the active symbol system — a valid stopping point for digital root reduction. In the default system these are `11` and `22`. In a custom system they could be anything, or nothing at all.

### PythagoreanConfig
A derived config object the interpreter constructs internally from its own archetype map. Consumers never instantiate this directly — it flows automatically from `TauTongueConfig` down into the utility layer. The name is intentionally retained as an internal implementation term; the *consumer-facing* vocabulary is `TauTongueConfig`.

### Symbol System
The 256 mathematical operators that form the equation algebra. Currently externalized via `getSymbols()` / `getSymbol()`. In v3.2, these become fully injectable — enabling custom operator algebras with user-defined metaphorical meanings.

---

## Architecture: Config Threading Pattern

The single most important architectural decision in v3 is that `PythagoreanConfig` is **derived**, not supplied. The consumer configures the interpreter once:

```typescript
const jungian = new TauTongueInterpreter({
  archetypeMap: jungianArchetypes,
  archetypeDescriptions: jungianDescriptions,
  resonanceMap: jungianResonance,
  resonanceDescriptions: jungianResonanceMeanings,
  archetypeFunctionMap: jungianFunctionMap,
  typalNumbers: [11, 22], // or custom
  symbolMap: DEFAULT_SYMBOL_MAP // or custom
});
```

Internally, the interpreter constructs its own `PythagoreanConfig`:

```typescript
constructor(config: TauTongueConfig = {}) {
  this.archetypeMap = config.archetypeMap ?? DEFAULT_ARCHETYPE_MAP;
  // ... other maps ...

  // Derived — consumer never touches this
  this.pythagoreanConfig = {
    archetypes: this.archetypeMap,
    typalNumbers: config.typalNumbers ?? DEFAULT_TYPAL_NUMBERS
  };
}
```

This config then threads into every `calculateDigitalRoot` and `cipherCycle` call throughout the stack.

---

## File Inventory

| File | Role | v3 Changes |
|------|------|------------|
| `pythagoreanUtils.ts` | Foundation — reduction, cipher cycling | Config-aware digital root + cipher cycle |
| `TauTongueInterpreter_v2.ts` | Core interpreter | All maps injectable, derives PythagoreanConfig |
| `TauTongueSymbolMap.ts` | 256 operator algebra | Injectable symbol map |
| `TauSpine.ts` | Recursive narrative structure generator | Config threading + cleanup |
| Demo: Default system | Existing BraidCraft IP showcase | Update for v3 config API |
| Demo: Visual Art | New — visual/generative art IP | Custom symbol system demo |
| Demo: Additional IP | New — third-party or alternate IP | Full arbitrary IP showcase |

---

## Version Milestones

---

### v3.0 — Config Foundation
**File:** `pythagoreanUtils.ts`

The entire stack calls into this module. Nothing else can be config-aware until this is.

**Changes:**

Add `PythagoreanConfig` interface:
```typescript
export interface PythagoreanConfig {
  archetypes: Record<number, string>;
  typalNumbers?: number[];
}
```

Export default typal numbers:
```typescript
export const DEFAULT_TYPAL_NUMBERS: number[] = [11, 22];
```

Make `calculateDigitalRoot` config-aware — reduction stops when it hits a valid archetype key or typal number, not hardcoded values:
```typescript
export const calculateDigitalRoot = (
  numStr: string,
  config?: PythagoreanConfig
): number | null => {
  const isValidRoot = (n: number): boolean => {
    if (config) {
      return config.archetypes[n] !== undefined ||
             (config.typalNumbers ?? DEFAULT_TYPAL_NUMBERS).includes(n);
    }
    return n < 10 || n === 11 || n === 22; // backward compat default
  };
  // ... reduction logic using isValidRoot
};
```

Make `cipherCycle` config-aware — collapse logic uses `typalNumbers` from config:
```typescript
export const cipherCycle = (
  numeroCipher: string,
  resonance: number,
  config?: PythagoreanConfig
): string => {
  // collapse typal numbers to single-digit equivalents
  // unless the custom config explicitly includes them as archetype keys
};
```

**Backward compatibility:** All config params are optional. Existing callsites with no config argument behave identically to v2.

**v3.0 Cleanup — `alphaCipher` Removal**

`alphaCipher` was added to `TauTongueResult` as an experiment artifact during the 435-Archon blockchain character generation project. It was never part of the symbolic pipeline — it's a name generation utility that got fossilized into `interpret()`.

- Remove `alphaCipher` from `TauTongueResult` interface
- Remove `guessPythagoreanWord` import and call from `TauTongueInterpreter`
- `phonemeCipher.ts` extracted out of core — becomes a standalone utility consumers explicitly import if they need name generation
- Fix the private duplicate `calculateDigitalRoot` inside `phonemeCipher.ts` to import from `pythagoreanUtils` if it survives as a utility

This makes `TauTongueResult` pure — every remaining field is structurally derived from the symbolic algebra.

---

### v3.1 — Interpreter Injection
**File:** `TauTongueInterpreter_v2.ts`

**Changes:**

All five internal maps become exported defaults and constructor-injectable via `TauTongueConfig`:

```typescript
export const DEFAULT_ARCHETYPE_MAP: Record<number, string>
export const DEFAULT_ARCHETYPE_DESCRIPTIONS: Record<string, string>
export const DEFAULT_RESONANCE_MAP: Record<number, string>
export const DEFAULT_RESONANCE_DESCRIPTIONS: Record<string, string>
export const DEFAULT_ARCHETYPE_FUNCTION_MAP: Record<number, SceneFunction>
```

`TauTongueConfig` interface:
```typescript
export interface TauTongueConfig {
  archetypeMap?: Record<number, string>;
  archetypeDescriptions?: Record<string, string>;
  resonanceMap?: Record<number, string>;
  resonanceDescriptions?: Record<string, string>;
  archetypeFunctionMap?: Record<number, SceneFunction>;
  typalNumbers?: number[];
}
```

Interpreter derives `PythagoreanConfig` at instantiation and threads it into all internal utility calls — `calculateDigitalRoot`, `cipherCycle`, `reduceCipher`, `getMicroCrucible`, `getAntagonist`, `analyzeInterference`, `getInterferenceWave`.

`getSymbolicMeaning` refactored from inline hardcoded lexicon to instance `resonanceMap` lookup.

**Backward compatibility:** `new TauTongueInterpreter()` with no arguments works identically to v2.

---

### v3.2 — Symbol Operator Injection
**File:** `TauTongueSymbolMap.ts`

The 256-symbol operator algebra. Currently a module-level singleton exported via `getSymbols()` / `getSymbol()`. This release makes the operator algebra itself replaceable.

**Changes:**

Export the default symbol map as a typed constant:
```typescript
export interface SymbolDefinition {
  name: string;
  mathMeaning: string;
  metaphoricalMeaning: string;
}

export const DEFAULT_SYMBOL_MAP: Record<string, SymbolDefinition> = {
  // existing 256 entries
};
```

Add `symbolMap` to `TauTongueConfig`:
```typescript
export interface TauTongueConfig {
  // ... existing fields ...
  symbolMap?: Record<string, SymbolDefinition>;
}
```

`getSymbol` and `getSymbols` become instance methods on the interpreter drawing from the injected map rather than the module-level singleton.

**What this enables:** A consumer can define their own operator algebra — different symbols, different metaphorical meanings, or a reduced/expanded set — and the equation generation, interpretation, and narrative layers all operate within that algebra.

**Backward compatibility:** `DEFAULT_SYMBOL_MAP` is the fallback. No existing behavior changes.

---

### v3.3 — TauSpine Config Threading + Cleanup
**File:** `TauSpine.ts`

`TauSpine extends TauTongueInterpreter` — inheritance rather than composition. This is actually an advantage for config threading: the constructor change is a single optional param addition, fully backward compatible.

**Known problems to resolve:**

**Problem 1 — Constructor config threading**
`super()` is called with no args. Fix: optional third param with default `{}`:
```typescript
constructor(
  private spark: string,
  private format: SpineFormat,
  config: TauTongueConfig = {}
) {
  super(config);
  ...
}
```
`createTauSpine` convenience function gets an optional third param. All existing callsites untouched.

**Problem 2 — Private `getResonanceName` is a hardcoded duplicate**
A third copy of the resonance map lives inside TauSpine. Once the interpreter exposes `this.resonanceMap` via v3.1, this private method is deleted and TauSpine uses the inherited map directly.

**Problem 3 — `allRoots` hardcoded in two places**
```typescript
const allRoots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22];
```
Appears in both `extractArchetypalMatrix` and `extractMasterArchetypalMatrix`. In v3.3 this becomes:
```typescript
const allRoots = Object.keys(this.archetypeMap).map(Number);
```

**Problem 4 — `SpineFormat` enum values are Pythagorean digital roots**
```typescript
export enum SpineFormat {
  SHORT = 6, NOVELETTE = 7, NOVELLA = 8,
  NOVEL = 9, EPIC = 11, SAGA = 22,
}
```
These map to archetypes in the default system. In a custom system with different archetype keys, these values may be meaningless. Design decision: format values are structural labels that happen to use default system roots — they are not required to be valid archetype keys in custom systems. Document this explicitly.

**Problem 5 — `cipherCycle` wrapper is unnecessarily async**
```typescript
private async cipherCycle(numeroCipher: string, resonance: number): Promise<string> {
  return await pythagoreanCipherCycle(numeroCipher, resonance);
}
```
`pythagoreanCipherCycle` is synchronous. The async wrapper is vestigial and infects `generateLevel` and `evolveSparkForNode` with unnecessary awaits. Remove in v3.3.

**What this enables:** A full recursive narrative spine — book, act, chapter, scene hierarchy — generated within any arbitrary symbolic system. A Jungian TauSpine. A Tarot TauSpine. A custom IP TauSpine.

---

### v3.4 — Visual Art Demo *(silent release)*
A working demo of Tau-Tongue v3 applied to a visual/generative art symbol system. Custom archetype map, custom resonance map, custom operator meanings — all configured via `TauTongueConfig`. Demonstrates the pipeline operating outside the BraidCraft narrative context entirely.

---

### v3.5 — Additional IP Demo *(silent release)*
A second custom IP demo — third-party, alternate mythology, or a contributed system. Proves the arbitrary IP claim with a second non-BraidCraft example. Together with v3.4, these two silent releases validate that the config system works in practice, not just in theory, before the full public release.

---

### v3.6 — Final Audit + Polish
- Final sweep of all hardcoded `[11, 22]` references across the entire codebase
- Verify no typal number assumptions survive into the pipeline
- Documentation pass — JSDoc on all public config interfaces
- Final review of `TauTongueResult` shape for purity
- Update existing BraidCraft demos to use v3 config API explicitly

---

### v3.6.9 — Full Release
**Arbitrary IP support. End to end. Ship it.**

Every layer of the stack accepts a custom symbolic system. The pipeline is deterministic. The vocabulary is yours.

*"If you only knew the magnificence of the 3, 6 and 9, then you would have a key to the universe."*

---

## Shippable at v3.6.9

All eight milestones complete = arbitrary IP support end to end, validated with real demos. A single `TauTongueConfig` object controls:

- Which archetypes the system recognizes
- What those archetypes mean
- Which numbers map to which resonance names
- What those resonances mean
- Which numbers are Typal (reduction stopping points)
- How archetypes map to narrative scene functions
- Which symbolic operators form the equation algebra

**The pipeline remains fully deterministic. The vocabulary is now yours.**

---

## What v3 Does Not Change

- The equation generation algorithm (`skipSelector`, `getSymbolicOperators`)
- The braid structure and antagonist derivation logic
- The interference wave analysis
- The narrative palette extraction
- The cipher cycling mathematics
- The TauSpine recursive breakdown strategy
- The `TauTongueResult` interface shape - with the exception of removing alphacipher
- Any existing public API surface

---

## Usage Examples at v3.1.4

### Default (identical to v2)
```typescript
const interpreter = new TauTongueInterpreter();
const result = interpreter.interpret("your text here");
```

### Partial override
```typescript
import { TauTongueInterpreter, DEFAULT_ARCHETYPE_MAP } from '@astralarkitekt/tau-tongue';

const interpreter = new TauTongueInterpreter({
  archetypeMap: {
    ...DEFAULT_ARCHETYPE_MAP,
    3: 'The Empress' // replace just one archetype
  }
});
```

### Full custom IP
```typescript
const tarot = new TauTongueInterpreter({
  archetypeMap: {
    1: 'The Magician',
    2: 'The High Priestess',
    3: 'The Empress',
    4: 'The Emperor',
    5: 'The Hierophant',
    6: 'The Lovers',
    7: 'The Chariot',
    8: 'Strength',
    9: 'The Hermit',
    11: 'Justice',
    22: 'The Fool'
  },
  archetypeDescriptions: tarotDescriptions,
  resonanceMap: tarotResonanceNames,
  resonanceDescriptions: tarotResonanceMeanings,
  archetypeFunctionMap: tarotFunctionMap,
  typalNumbers: [11, 22],
  symbolMap: DEFAULT_SYMBOL_MAP
});
```

### Custom spine
```typescript
import { TauSpine, SpineFormat } from '@astralarkitekt/tau-tongue';

const spine = new TauSpine(
  "my story spark",
  SpineFormat.NOVEL,
  {
    archetypeMap: myCustomArchetypes,
    symbolMap: myCustomOperators
  }
);

const result = await spine.generate();
```

---

*Tau-Tongue v3.6.9 — The vocabulary is yours. The mathematics is eternal.*