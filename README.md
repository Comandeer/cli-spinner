# @comandeer/cli-spinner

[![Build Status](https://github.com/Comandeer/cli-spinner/workflows/CI/badge.svg)](https://github.com/Comandeer/cli-spinner/actions) [![Dependency Status](https://david-dm.org/Comandeer/cli-spinner.svg)](https://david-dm.org/Comandeer/cli-spinner) [![devDependencies Status](https://david-dm.org/Comandeer/cli-spinner/dev-status.svg)](https://david-dm.org/Comandeer/cli-spinner?type=dev) [![codecov](https://codecov.io/gh/Comandeer/cli-spinner/branch/main/graph/badge.svg)](https://codecov.io/gh/Comandeer/cli-spinner) [![npm (scoped)](https://img.shields.io/npm/v/@comandeer/cli-spinner.svg)](https://npmjs.com/package/@comandeer/cli-spinner)

Super simple CLI spinner.

## Installation

```bash
npm install @comandeer/cli-spinner --save
```

## Usage

```javascript
import Spinner from '@comandeer/cli-spinner';

const spinner = new Spinner( {
	label: 'Working…'
} );

await spinner.show();

//do something

await spinner.hide();
```

## Configuration

You can configure the spinner by passing options via `options` object in the constructor:

```javascript
const spinner = new Spinner( options );
```

The list of available options is presented below:

| Name       | Type                                                  | Default value                                                | Description                                                  |
| ---------- | ----------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `stdout`   | [`Stream`](https://nodejs.org/api/stream.html#stream) | [`process.stderr`](https://nodejs.org/api/process.html#processstderr) | Stream to which the spinner will be outputted.               |
| `label`    | `string`                                              | `''`                                                         | Additional text label that will be displayed next to the spinner. |
| `spinner`  | `Array<string>`                                       | See [`src/defaultSpinner.js`](https://github.com/Comandeer/cli-spinner/blob/main/src/defaultSpinner.js) | An array containing frames that will be used to animate the spinner. |
| `interval` | `number`                                              | 80                                                           | Indicates how often frames of the spinner should be changed. |

## Why should I use it instead of x?

The truth is: you probably shouldn't. This package was created because I couldn't stand the API of [`gauge`](https://github.com/npm/gauge) and [`ora`](https://github.com/sindresorhus/ora) didn't work for me for some reason. As I have quite severe [NIH syndrome](https://en.wikipedia.org/wiki/Not_invented_here), I decided to create my own, very naive implementation of a CLI spinner.

So if you look for a battle-tested solution and don't mind more convoluted API, use `gauge`. If you prefer a battle-tested solution but with really user-friendly API, use `ora`. If for some reason these solutions don't work for you, you probably still shouldn't use this package.

## License

See [LICENSE](./LICENSE) file for details.
