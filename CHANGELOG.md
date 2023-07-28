# @comandeer/cli-spinner Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

---

## [1.0.0] – 2023-07-28
### Added
* [#14]: `.d.ts` file for the package.
* [#15]: support for Node.js 18 and 20.

### Changed
* [#18]: **BREAKING CHANGE**: made the package an ESM only one.
* [#20]: **BREAKING CHANGE**: move from symbol and `_`-private methods to real private fields and methods.
* [#17]: **BREAKING CHANGE**: updated depdendencies:

	| Dependency                  | Old version | New version |
	| --------------------------- | ----------- | ----------- |
	| ⭐ `ansi-escapes`            | N/A         | `^6.2.0`    |
	| ☠️ `console-control-strings` | `^1.1.0`    | N/A         |
	| ⭐ `is-interactive`          | N/A         | `^2.0.0`    |

	New dependencies are marked with the "⭐" emoji.

	Removed dependencies are marked with the "☠️" emoji.

### Removed
* [#15]: **BREAKING CHANGE**: support for Node.js 12 and 14.

## [0.3.2] – 2021-11-20
### Fixed
* [#12]: make the API _truly_ asynchronous.

## [0.3.1] – 2021-11-19
### Fixed
* [#9]: incorect repo URL in `package.json`.

## [0.3.0] – 2021-11-16
### Added
* [#5]: some docs.
### Changed
* [#6]: **BREAKING CHANGE**: make the API fully asynchronous.

## [0.2.0] – 2021-11-13
### Changed
* [#1]: **BREAKING CHANGE**: use `stderr` instead of `stdout`.
* [#3]: **BREAKING CHANGE**: do not show spinner in non-interactive terminals or on CI.

## 0.1.0
### Added
* First working version, yay!

[#1]: https://github.com/Comandeer/cli-spinner/issues/1
[#3]: https://github.com/Comandeer/cli-spinner/issues/3
[#5]: https://github.com/Comandeer/cli-spinner/issues/5
[#6]: https://github.com/Comandeer/cli-spinner/issues/6
[#9]: https://github.com/Comandeer/cli-spinner/issues/9
[#12]: https://github.com/Comandeer/cli-spinner/issues/12
[#14]: https://github.com/Comandeer/cli-spinner/issues/14
[#15]: https://github.com/Comandeer/cli-spinner/issues/15
[#17]: https://github.com/Comandeer/cli-spinner/issues/17
[#18]: https://github.com/Comandeer/cli-spinner/issues/18
[#20]: https://github.com/Comandeer/cli-spinner/issues/20

[1.0.0]: https://github.com/Comandeer/cli-spinner/compare/v0.3.2...v1.0.0
[0.3.2]: https://github.com/Comandeer/cli-spinner/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/Comandeer/cli-spinner/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/Comandeer/cli-spinner/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Comandeer/cli-spinner/compare/v0.1.0...v0.2.0
