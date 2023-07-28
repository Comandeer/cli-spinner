import { Duplex as DuplexStream, Writable as WritableStream } from 'node:stream';
import ansiEscapes from 'ansi-escapes';
import defaultSpinner from './defaultSpinner.js';
import isInteractive from 'is-interactive';

const eraseLineCmd = ansiEscapes.cursorLeft + ansiEscapes.eraseLine;

export default class Spinner {
	#timeout;
	#currentFrame;
	#isShown;
	#isInteractive;

	constructor( {
		stdout = process.stderr,
		label = '',
		spinner = defaultSpinner,
		interval = 80
	} = {} ) {
		if ( !isValidStream( stdout ) ) {
			throw new TypeError( 'Custom stdout must be a valid writable/duplex stream' );
		}

		if ( typeof interval !== 'number' ) {
			throw new TypeError( 'Custom interval must be a valid number' );
		}

		if ( typeof label !== 'string' ) {
			throw new TypeError( 'Custom label must be a valid string' );
		}

		if ( !isArrayOfStrings( spinner ) ) {
			throw new TypeError( 'Custom spinner must be a valid array of strings' );
		}

		this.stdout = stdout;
		this.label = label;
		this.spinner = spinner;
		this.interval = interval;
		this.#timeout = null;
		this.#currentFrame = 0;
		this.#isShown = false;
		this.#isInteractive = isInteractive( {
			stream: this.stdout
		} );
	}

	async show() {
		if ( !this.#isInteractive || this.#isShown ) {
			return;
		}

		const drawSpinner = async () => {
			const frame = this.#prepareSpinnerFrame();

			await this.#requestRenderFrame( frame );

			this.#timeout = setTimeout( drawSpinner, this.interval );
		};

		this.#isShown = true;

		await this.#requestRenderFrame( ansiEscapes.cursorHide );

		return drawSpinner();
	}

	async hide() {
		if ( !this.#isShown ) {
			return;
		}

		if ( this.#timeout ) {
			clearTimeout( this.#timeout );
		}

		await this.#requestRenderFrame( eraseLineCmd + ansiEscapes.cursorShow );

		this.#currentFrame = 0;
		this.#isShown = false;
	}

	#prepareSpinnerFrame() {
		const currentFrame = this.spinner[ this.#currentFrame++ % this.spinner.length ];

		return `${ eraseLineCmd + currentFrame } ${ this.label }`;
	}

	#requestRenderFrame( frame ) {
		return new Promise( ( resolve ) => {
			if ( this.stdout.write( frame, 'utf8' ) ) {
				return resolve();
			}

			this.stdout.once( 'drain', resolve );
		} );
	}
}

function isValidStream( value ) {
	return value instanceof WritableStream || value instanceof DuplexStream;
}

function isArrayOfStrings( value ) {
	return Array.isArray( value ) && value.every( ( element ) => {
		return typeof element === 'string';
	} );
}
