// Main exports for the Tau-Tongue library
export {
  TauTongueInterpreter,
  DEFAULT_ARCHETYPE_MAP,
  DEFAULT_ARCHETYPE_DESCRIPTIONS,
  DEFAULT_RESONANCE_MAP,
  DEFAULT_RESONANCE_DESCRIPTIONS,
  DEFAULT_ARCHETYPE_FUNCTION_MAP,
  SceneFunction,
} from './tau-tongue/TauTongueInterpreter_v2.js';
export type { 
  TauTongueResult, 
  TauTongueAntagonist,
  BraidInterpretation, 
  InflectionPoint, 
  RenderOptions,
  NarrativePalette,
  TauTongueConfig,
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