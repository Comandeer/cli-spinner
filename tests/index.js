import { stderr } from 'node:process';
import ansiEscapes from 'ansi-escapes';
import test from 'ava';
import { useFakeTimers } from 'sinon';
import createDummyStream from './__helpers__/createDummyStream.js';
import regexEscape from './__helpers__/regexEscape.js';
import defaultSpinner from '../src/defaultSpinner.js';
import Spinner from '../src/index.js';

const DEFAULT_INTERVAL = 80;

const originalCI = process.env.CI;
const originalTERM = process.env.TERM;
let clock;

test.beforeEach( () => {
	delete process.env.CI;
	delete process.env.TERM;

	clock = useFakeTimers( {
		toFake: [ 'setTimeout' ]
	} );
} );

test.afterEach( () => {
	if ( originalCI !== undefined ) {
		process.env.CI = originalCI;
	}

	if ( originalTERM !== undefined ) {
		process.env.TERM = originalTERM;
	}

	clock.restore();
} );

test.serial( 'Spinner is a function', ( t ) => {
	t.is( typeof Spinner, 'function' );
} );

test.serial( '#constructor() accepts stream as stdout option', ( t ) => {
	const { stream: dummyStdout } = createDummyStream();
	const expectedError = {
		instanceOf: TypeError,
		message: 'Custom stdout must be a valid writable/duplex stream'
	};

	t.throws( () => {
		new Spinner( {
			stdout: 'stream'
		} );
	}, expectedError );

	t.notThrows( () => {
		new Spinner( {
			stdout: dummyStdout
		} );
	} );
} );

// #1
test.serial( '#constructor() uses stderr as a default value for stdout option', ( t ) => {
	const spinner = new Spinner();

	t.is( spinner.stdout, stderr );
} );

test.serial( '#constructor() accepts number as interval option', ( t ) => {
	const expectedError = {
		instanceOf: TypeError,
		message: 'Custom interval must be a valid number'
	};

	t.throws( () => {
		new Spinner( {
			interval: false
		} );
	}, expectedError );

	t.notThrows( () => {
		new Spinner( {
			interval: 5
		} );
	} );
} );

test.serial( '#constructor() accepts string as label option', ( t ) => {
	const expectedError = {
		instanceOf: TypeError,
		message: 'Custom label must be a valid string'
	};

	t.throws( () => {
		new Spinner( {
			label: {}
		} );
	}, expectedError );

	t.notThrows( () => {
		new Spinner( {
			label: 'hublabubla'
		} );
	} );
} );

test.serial( '#constructor() accepts array of strings as spinner option', ( t ) => {
	const expectedError = {
		instanceOf: TypeError,
		message: 'Custom spinner must be a valid array of strings'
	};

	t.throws( () => {
		new Spinner( {
			spinner: [ 1, true, 'a' ]
		} );
	}, expectedError );

	t.notThrows( () => {
		new Spinner( {
			spinner: [ 'a', 'b', 'c' ]
		} );
	} );
} );

test.serial( '#show() displays correct control sequence to hide cursor', async ( t ) => {
	const { stream: dummyStdout, output } = createDummyStream();
	const spinner = new Spinner( {
		stdout: dummyStdout
	} );
	const expectedOutput = ansiEscapes.cursorHide;

	await spinner.show();

	t.deepEqual( output[ 0 ], expectedOutput );
} );

test.serial( '#show() displays correct frame on every tick', async ( t ) => {
	const { stream: dummyStdout, output } = createDummyStream();
	const spinner = new Spinner( {
		stdout: dummyStdout
	} );
	const clockTick = DEFAULT_INTERVAL * 4;
	const expectedFramesCount = clockTick / DEFAULT_INTERVAL;
	const framesRegexes = [
		// First frame is written inside the promise.
		new RegExp( `${ regexEscape( defaultSpinner[ 1 ] ) }\\s*$`, 'gi' ),
		new RegExp( `${ regexEscape( defaultSpinner[ 2 ] ) }\\s*$`, 'gi' ),
		new RegExp( `${ regexEscape( defaultSpinner[ 3 ] ) }\\s*$`, 'gi' ),
		new RegExp( `${ regexEscape( defaultSpinner[ 0 ] ) }\\s*$`, 'gi' )
	];

	await spinner.show();

	output.length = 0;

	await clock.tickAsync( clockTick );

	t.is( output.length, expectedFramesCount );

	framesRegexes.forEach( ( regex, i ) => {
		t.regex( output[ i ], regex );
	} );
} );

test.serial( '#show() displays custom spinner', async ( t ) => {
	const { stream: dummyStdout, output } = createDummyStream();
	const spinnerFrames = [
		'Ω',
		'Ę'
	];
	const spinner = new Spinner( {
		spinner: spinnerFrames,
		stdout: dummyStdout
	} );
	const clockTick = DEFAULT_INTERVAL * 2;
	const expectedFramesCount = clockTick / DEFAULT_INTERVAL;
	const framesRegexes = [
		// First frame is written inside the promise.
		new RegExp( `${ regexEscape( spinnerFrames[ 1 ] ) }\\s*$`, 'gi' ),
		new RegExp( `${ regexEscape( spinnerFrames[ 0 ] ) }\\s*$`, 'gi' )
	];

	await spinner.show();

	output.length = 0;

	await clock.tickAsync( clockTick );

	t.is( output.length, expectedFramesCount );

	framesRegexes.forEach( ( regex, i ) => {
		t.regex( output[ i ], regex );
	} );
} );

test.serial( '#show() ticks according to passed interval', async ( t ) => {
	const interval = 1;
	const { stream: dummyStdout, output } = createDummyStream();
	const spinner = new Spinner( {
		interval: 1,
		stdout: dummyStdout
	} );
	const clockTick = interval * 10;
	// First frame and hide cursor commands are written inside the promise.
	const expectedFramesCount = clockTick / interval + 2;

	await spinner.show();
	await clock.tickAsync( clockTick );

	t.is( output.length, expectedFramesCount );
} );

test.serial( '#show() does nothing if spinner is already shown', async ( t ) => {
	const { stream: dummyStdout, output } = createDummyStream();
	const spinner = new Spinner( {
		stdout: dummyStdout
	} );

	await spinner.show();

	output.length = 0;

	await spinner.show();

	t.deepEqual( output, [] );
} );

test.serial( '#hide() does nothing if spinner is not already shown', async ( t ) => {
	const { stream: dummyStdout, output } = createDummyStream();
	const spinner = new Spinner( {
		stdout: dummyStdout
	} );

	await spinner.hide();

	t.deepEqual( output, [] );
} );

test.serial( '#hide() erases line and shows cursor', async ( t ) => {
	const { stream: dummyStdout, output } = createDummyStream();
	const spinner = new Spinner( {
		stdout: dummyStdout
	} );
	const expectedOutput = [
		ansiEscapes.cursorLeft + ansiEscapes.eraseLine + ansiEscapes.cursorShow
	];

	await spinner.show();

	output.length = 0;

	await spinner.hide();

	t.deepEqual( output, expectedOutput );
} );

test.serial( '#hide() is possible to reshow the spinner after hiding it', async ( t ) => {
	const { stream: dummyStdout, output } = createDummyStream();
	const spinner = new Spinner( {
		stdout: dummyStdout
	} );
	const framesRegexes = [
		// The first char in this command seems to be problematic…
		new RegExp( regexEscape( ansiEscapes.cursorHide[ 1 ] ), 'gi' ),
		new RegExp( `${ regexEscape( defaultSpinner[ 0 ] ) }\\s*$`, 'gi' )
	];

	await spinner.show();
	await spinner.hide();

	await new Promise( ( resolve ) => {
		process.nextTick( resolve );
	} );

	output.length = 0;

	await spinner.show();

	framesRegexes.forEach( ( regex, i ) => {
		t.regex( output[ i ], regex );
	} );
} );
