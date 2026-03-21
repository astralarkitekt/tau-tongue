# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [3.9.0] - 2026-03-21

### Added
- **`getCrucibleFunction(equation)`** — new public method on `TauTongueInterpreter` for extracting the crucible operator/function from a symbolic equation. This provides a more direct and ergonomic way to access the crucible function, separate from the full description.
- **Standalone fracticulation helpers** — `fracticulateBraid` and `fricticulatize` are now available as named exports from the package, allowing direct use without instantiating the interpreter class.

### Changed
- **`getFunctionDescription(func)`** — the returned description no longer includes the operator symbol prefix. This makes the output more natural and focused on the narrative/metaphorical meaning.
- **API Reference & Exports** — All new fracticulation types (`BraidVariant`, `BraidVariantScore`, `VDSResult`) and helpers are now fully exported and documented in the API reference.

### Removed
-(No removals in this release, but see breaking change below.)

### Breaking
- **`getFunctionDescription(func)`** output format changed: the operator symbol is no longer included in the returned string. If you relied on the symbol being present, update your code to extract it separately if needed.

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
