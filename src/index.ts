// Main exports for the Tau-Tongue library (v3 — config-injectable)
export {
  TauTongueInterpreter,
  DEFAULT_ARCHETYPE_MAP,
  DEFAULT_ARCHETYPE_DESCRIPTIONS,
  DEFAULT_RESONANCE_MAP,
  DEFAULT_RESONANCE_DESCRIPTIONS,
  DEFAULT_ARCHETYPE_FUNCTION_MAP,
  SceneFunction,
} from './tau-tongue/TauTongueInterpreter_v3.js';
export type { 
  TauTongueResult, 
  TauTongueAntagonist,
  BraidInterpretation, 
  InflectionPoint, 
  RenderOptions,
  NarrativePalette,
  TauTongueConfig,
  // Fracticulation types
  BraidVariant,
  BraidVariantScore,
  VDSResult,
} from './tau-tongue/TauTongueInterpreter_v3.js';
// Fracticulation helpers (async, static wrappers for ergonomic import)
import { TauTongueInterpreter as _TTI, type TauTongueResult } from './tau-tongue/TauTongueInterpreter_v3.js';
/**
 * Generate up to 3 fracticulated variants of a braid function (standalone helper).
 * Equivalent to: new TauTongueInterpreter().fracticulateBraid(...)
 */
export const fracticulateBraid = (equation: string, count: number, resonance: number) => {
  const tti = new _TTI();
  return tti.fracticulateBraid(equation, count as 1 | 2 | 3, resonance);
};
/**
 * Enrich a TauTongueResult with fracticulated braid variants (standalone helper).
 * Equivalent to: new TauTongueInterpreter().fracticulatize(...)
 */
export const fracticulatize = (result: TauTongueResult) => {
  const tti = new _TTI();
  return tti.fracticulatize(result);
};

// Legacy interpreter exports (v1 and v2 — hardcoded BraidCraft defaults)
export {
  TauTongueInterpreter as TauTongueInterpreterV1,
} from './tau-tongue/TauTongueInterpreter_v1.js';
export type {
  TauTongueResult as TauTongueResultV1,
} from './tau-tongue/TauTongueInterpreter_v1.js';

export {
  TauTongueInterpreter as TauTongueInterpreterV2,
} from './tau-tongue/TauTongueInterpreter_v2.js';
export type {
  TauTongueResult as TauTongueResultV2,
  TauTongueAntagonist as TauTongueAntagonistV2,
  BraidInterpretation as BraidInterpretationV2,
  InflectionPoint as InflectionPointV2,
  NarrativePalette as NarrativePaletteV2,
} from './tau-tongue/TauTongueInterpreter_v2.js';

// TauSpine exports
export { TauSpine, createTauSpine, SpineFormat, getPath } from './tau-tongue/TauSpine.js';
export type {
  TauSpineNode,
  TauSpineResult,
  FlattenedTauSpineResult,
  FlattenedScene,
  FormatData,
  UnitSpec,
  ArchetypalEntry,
  ArchetypalMatrix
} from './tau-tongue/TauSpine.js';

// Pythagorean utilities
export {
  numerologyMap,
  convertToNumbers,
  calculateDigitalRoot,
  integerStringFromBase36,
  cipherCycle,
  extractBraidDigits,
  DEFAULT_TYPAL_NUMBERS
} from './pythagoreanUtils.js';
export type { PythagoreanConfig } from './pythagoreanUtils.js';

// Phoneme cipher utilities
export { guessPythagoreanWord as generatePhonemeticNames } from './phonemeCipher.js';

// Tau-Tongue core components
export { getSymbol, getSymbols, DEFAULT_SYMBOL_MAP } from './tau-tongue/TauTongueSymbolMap.js';
export type { SymbolDefinition } from './tau-tongue/TauTongueSymbolMap.js';
export { renderTauSpiral } from './tau-tongue/TauTongueRenderer.js';
export type { TauInput } from './tau-tongue/TauTongueRenderer.js';