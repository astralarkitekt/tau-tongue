# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.7.0] - 2026-03-03

### Changed
- Changed `getSymbol()` and `getSymbols()` instance methods from `protected` to `public` in `TauTongueInterpreter` (v3)
- These methods now provide the proper replacement API for the deprecated standalone functions in `TauTongueSymbolMap`

### Fixed
- Fixed API design issue where deprecated standalone functions directed users to inaccessible protected methods

## [3.6.10] - Previous Release

_(Changelog tracking started with v3.7.0)_

[3.7.0]: https://github.com/astralarkitekt/tau-tongue/compare/v3.6.10...v3.7.0
[3.6.10]: https://github.com/astralarkitekt/tau-tongue/releases/tag/v3.6.10
