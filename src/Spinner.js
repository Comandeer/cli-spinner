import { Duplex as DuplexStream, Writable as WritableStream } from 'node:stream';
import consoleControl from 'console-control-strings';
import defaultSpinner from './defaultSpinner.js';
import isInteractive from 'is-interactive';

const timeoutSymbol = Symbol( 'timeout' );
const currentFrameSymbol = Symbol( 'currentFrame' );
const shownSymbol = Symbol( 'showing' );
const isInteractiveSymbol = Symbol( 'isInteractive' );
const eraseLineCmd = consoleControl.gotoSOL() + consoleControl.eraseLine();

export default class Spinner {
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
		this[ timeoutSymbol ] = null;
		this[ currentFrameSymbol ] = 0;
		this[ shownSymbol ] = false;
		this[ isInteractiveSymbol ] = isInteractive( {
			stream: this.stdout
		} );
	}

	async show() {
		if ( !this[ isInteractiveSymbol ] || this[ shownSymbol ] ) {
			return;
		}

		const drawSpinner = async () => {
			const frame = this._prepareSpinnerFrame();

			await this._requestRenderFrame( frame );

			this[ timeoutSymbol ] = setTimeout( drawSpinner, this.interval );
		};

		this[ shownSymbol ] = true;

		await this._requestRenderFrame( consoleControl.hideCursor() );

		return drawSpinner();
	}

	async hide() {
		if ( !this[ shownSymbol ] ) {
			return;
		}

		if ( this[ timeoutSymbol ] ) {
			clearTimeout( this[ timeoutSymbol ] );
		}

		await this._requestRenderFrame( eraseLineCmd + consoleControl.showCursor() );

		this[ currentFrameSymbol ] = 0;
		this[ shownSymbol ] = false;
	}

	_prepareSpinnerFrame() {
		const currentFrame = this.spinner[ this[ currentFrameSymbol ]++ % this.spinner.length ];

		return `${ eraseLineCmd + currentFrame } ${ this.label }`;
	}

	_requestRenderFrame( frame ) {
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
