import { stderr } from 'node:process';
import { Duplex as DuplexStream, Writable as WritableStream } from 'node:stream';
import ansiEscapes from 'ansi-escapes';
import defaultSpinner from './defaultSpinner.js';
import isInteractive from 'is-interactive';

interface SpinnerOptions {
	stdout?: DuplexStream | WritableStream;
	label?: string;
	spinner?: Array<string>;
	interval?: number;
}

const eraseLineCmd = ansiEscapes.cursorLeft + ansiEscapes.eraseLine;

export default class Spinner {
	stdout: DuplexStream | WritableStream;
	label: string;
	spinner: Array<string>;
	interval: number;

	// eslint-disable-next-line no-undef
	#timeout: NodeJS.Timeout | null;
	#currentFrame: number;
	#isShown: boolean;
	#isInteractive: boolean;

	constructor( {
		stdout = stderr,
		label = '',
		spinner = defaultSpinner,
		interval = 80
	}: SpinnerOptions = {} ) {
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

	async show(): Promise<void> {
		if ( !this.#isInteractive || this.#isShown ) {
			return;
		}

		const drawSpinner = async (): Promise<void> => {
			const frame = this.#prepareSpinnerFrame();

			await this.#requestRenderFrame( frame );

			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			this.#timeout = setTimeout( drawSpinner, this.interval );
		};

		this.#isShown = true;

		await this.#requestRenderFrame( ansiEscapes.cursorHide );

		return drawSpinner();
	}

	async hide(): Promise<void> {
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

	#prepareSpinnerFrame(): string {
		const currentFrame = this.spinner[ this.#currentFrame++ % this.spinner.length ]!;

		return `${ eraseLineCmd + currentFrame } ${ this.label }`;
	}

	#requestRenderFrame( frame ): Promise<void> {
		return new Promise( ( resolve ) => {
			if ( this.stdout.write( frame, 'utf8' ) ) {
				resolve();

				return;
			}

			this.stdout.once( 'drain', resolve );
		} );
	}
}

function isValidStream( value: unknown ): value is DuplexStream | WritableStream {
	return value instanceof WritableStream || value instanceof DuplexStream;
}

function isArrayOfStrings( value: unknown ): value is Array<string> {
	return Array.isArray( value ) && value.every( ( element ) => {
		return typeof element === 'string';
	} );
}
