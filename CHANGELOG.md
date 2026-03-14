# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.8.0] "Benoît" - 2026-03-13

### Added
- **Archetypal Matrix** — `archetypalMatrix` field on `TauTongueResult`, computed automatically by `interpret()`. Provides archetypal distribution analysis (digit counts, symbol attribution, dominant root, diversity score) for any symbolic equation.
- **`extractArchetypalMatrix(equation)`** — public method to analyze any symbolic equation's archetypal distribution against the configured root set.
- **Fracticulation** — `fracticulatize(result)` and `fracticulateBraid(equation)` for generating braid variants via cipher-cycle evolution. Each braid can branch into up to 3 variants based on its Variant Density Score.
- **`calculateVDS(result)`** — public method returning `VDSResult` with per-braid pressure density, variant counts, and organic branching cap.
- **Config-aware numerology mapping** — when a custom `archetypeMap` is provided, A-Z is mapped cyclically over the sorted root set. Multi-digit values (10, 11, 12, etc.) appear natively in the numeroCipher, braids, interference wave, and archetypal matrix. Default-config behaviour is fully preserved.

### Changed
- **`getInterferenceWave(result)`** now returns `number[]` instead of `string`. Consumers that read this as a string will need to update. ⚠️ **Breaking** for direct callers of this method.
- **`convertToNumbers()`** visibility changed from `private` to `protected` — subclasses (e.g. `TauSpine`) can now inherit the config-aware mapping.
- All braid-consuming functions (`analyzeInterference`, `calculateVDS`, `getMicroCrucible`, `getAntagonist`, `fracticulateBraid`, `extractArchetypalMatrix`) now use `\d+` regex for multi-digit value support instead of single-character `[1-9]` scanning.
- `TauSpine.extractNumeroCipher()` now delegates to the inherited `convertToNumbers()` instead of calling the static utility directly, inheriting config-aware mapping automatically.

### Removed
- **`extractMasterArchetypalMatrix()`** — removed duplicate method that was byte-identical to `extractArchetypalMatrix()`.

### Fixed
- Fixed infinite loop in `calculateDigitalRoot` when called with a config containing an empty `archetypes` object and typal numbers that exclude single-digit values.

## [3.7.1] - 2026-03-07

### Fixed
- Fixed potential infinite loop when calling `interpret()` with empty or whitespace-only input (now throws descriptive error)

## [3.7.0] - 2026-03-03

### Changed
- Changed `getSymbol()` and `getSymbols()` instance methods from `protected` to `public` in `TauTongueInterpreter` (v3)
- These methods now provide the proper replacement API for the deprecated standalone functions in `TauTongueSymbolMap`
- `getSymbols()` now returns a defensive copy to prevent external mutation of internal state

### Fixed
- Fixed API design issue where deprecated standalone functions directed users to inaccessible protected methods

## [3.6.10] - Previous Release

_(Changelog tracking started with v3.7.0)_

[3.8.0]: https://github.com/astralarkitekt/tau-tongue/compare/v3.7.1...v3.8.0
[3.7.1]: https://github.com/astralarkitekt/tau-tongue/compare/v3.7.0...v3.7.1
[3.7.0]: https://github.com/astralarkitekt/tau-tongue/compare/v3.6.10...v3.7.0
[3.6.10]: https://github.com/astralarkitekt/tau-tongue/releases/tag/v3.6.10
