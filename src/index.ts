// Main exports for the Tau-Tongue library
export { TauTongueInterpreter } from './tau-tongue/TauTongueInterpreter_v2.js';
export type { 
  TauTongueResult, 
  TauTongueAntagonist,
  BraidInterpretation, 
  InflectionPoint, 
  RenderOptions,
  NarrativePalette 
} from './tau-tongue/TauTongueInterpreter_v2.js';
export { SceneFunction } from './tau-tongue/TauTongueInterpreter_v2.js';

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
  guessPythagoreanWord,
  extractBraidDigits
} from './pythagoreanUtils.js';

// Phoneme cipher utilities
export { guessPythagoreanWord as generatePhonemeticNames } from './phonemeCipher.js';

// Tau-Tongue core components
export { getSymbol, getSymbols } from './tau-tongue/TauTongueSymbolMap.js';
export { renderTauSpiral } from './tau-tongue/TauTongueRenderer.js';
export type { TauInput } from './tau-tongue/TauTongueRenderer.js';