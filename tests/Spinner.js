import consoleControl from 'console-control-strings';
import createDummyStream from './helpers/createDummyStream.js';
import defaultSpinner from '../src/defaultSpinner.js';
import Spinner from '../src/Spinner.js';

const DEFAULT_INTERVAL = 80;

describe( 'Spinner', () => {
	it( 'is a function', () => {
		expect( Spinner ).to.be.a( 'function' );
	} );

	describe( '#constructor()', () => {
		it( 'accepts stream as stdout option', () => {
			const { stream: dummyStdout } = createDummyStream();

			expect( () => {
				new Spinner( {
					stdout: 'stream'
				} );
			} ).to.throw( TypeError, 'Custom stdout must be a valid writable/duplex stream' );

			expect( () => {
				new Spinner( {
					stdout: dummyStdout
				} );
			} ).not.to.throw( TypeError, 'Custom stdout must be a valid writable/duplex stream' );
		} );

		it( 'accepts number as interval option', () => {
			expect( () => {
				new Spinner( {
					interval: false
				} );
			} ).to.throw( TypeError, 'Custom interval must be a valid number' );

			expect( () => {
				new Spinner( {
					interval: 5
				} );
			} ).not.to.throw( TypeError, 'Custom interval must be a valid number' );
		} );

		it( 'accepts string as label option', () => {
			expect( () => {
				new Spinner( {
					label: {}
				} );
			} ).to.throw( TypeError, 'Custom label must be a valid string' );

			expect( () => {
				new Spinner( {
					label: 'hublabubla'
				} );
			} ).not.to.throw( TypeError, 'Custom label must be a valid string' );
		} );

		it( 'accepts array of strings as spinner option', () => {
			expect( () => {
				new Spinner( {
					spinner: [ 1, true, 'a' ]
				} );
			} ).to.throw( TypeError, 'Custom spinner must be a valid array of strings' );

			expect( () => {
				new Spinner( {
					spinner: [ 'a', 'b', 'c' ]
				} );
			} ).not.to.throw( TypeError, 'Custom spinner must be a valid array of strings' );
		} );
	} );

	describe( '#show()', () => {
		let clock;

		beforeEach( () => {
			clock = sinon.useFakeTimers( {
				toFake: [ 'setTimeout' ]
			} );
		} );

		afterEach( () => {
			clock.restore();
		} );

		it( 'displays correct control sequence to hide cursor', () => {
			const { stream: dummyStdout, output } = createDummyStream();
			const spinner = new Spinner( {
				stdout: dummyStdout
			} );
			const expectedOutput = [
				consoleControl.hideCursor()
			];

			spinner.show();

			expect( output ).to.deep.equal( expectedOutput );
		} );

		it( 'display correct frame on every tick', async () => {
			const { stream: dummyStdout, output } = createDummyStream();
			const spinner = new Spinner( {
				stdout: dummyStdout
			} );
			const clockTick = DEFAULT_INTERVAL * 4;
			// First frame is drawn immediately.
			const expectedFramesCount = clockTick / DEFAULT_INTERVAL + 1;
			const framesRegexes = [
				new RegExp( `\\${ defaultSpinner[ 0 ] }\\s*$`, 'gi' ),
				new RegExp( `\\${ defaultSpinner[ 1 ] }\\s*$`, 'gi' ),
				new RegExp( `\\${ defaultSpinner[ 2 ] }\\s*$`, 'gi' ),
				new RegExp( `\\${ defaultSpinner[ 3 ] }\\s*$`, 'gi' )
			];

			spinner.show();

			output.length = 0;

			await clock.tickAsync( clockTick );

			expect( output ).to.have.lengthOf( expectedFramesCount );

			framesRegexes.forEach( ( regex, i ) => {
				expect( output[ i ] ).to.match( regex );
			} );
		} );

		it( 'display custom spinner', async () => {
			const { stream: dummyStdout, output } = createDummyStream();
			const spinnerFrames = [
				'Ω',
				'Ę'
			];
			const spinner = new Spinner( {
				spinner: spinnerFrames,
				stdout: dummyStdout
			} );
			const clockTick = DEFAULT_INTERVAL;
			// First frame is drawn immediately.
			const expectedFramesCount = clockTick / DEFAULT_INTERVAL + 1;
			const framesRegexes = [
				new RegExp( `\\${ spinnerFrames[ 0 ] }\\s*$`, 'gi' ),
				new RegExp( `\\${ spinnerFrames[ 1 ] }\\s*$`, 'gi' )
			];

			spinner.show();

			output.length = 0;

			await clock.tickAsync( clockTick );

			expect( output ).to.have.lengthOf( expectedFramesCount );

			framesRegexes.forEach( ( regex, i ) => {
				expect( output[ i ] ).to.match( regex );
			} );
		} );

		it( 'ticks according to passed interval', async () => {
			const interval = 1;
			const { stream: dummyStdout, output } = createDummyStream();
			const spinner = new Spinner( {
				interval: 1,
				stdout: dummyStdout
			} );
			const clockTick = interval * 10;
			// First frame is drawn immediately.
			const expectedFramesCount = clockTick / interval + 1;

			spinner.show();

			output.length = 0;

			await clock.tickAsync( clockTick );

			expect( output ).to.have.lengthOf( expectedFramesCount );
		} );

		it( 'does nothing if spinner is already shown', () => {
			const { stream: dummyStdout, output } = createDummyStream();
			const spinner = new Spinner( {
				stdout: dummyStdout
			} );

			spinner.show();

			output.length = 0;

			spinner.show();

			expect( output ).to.deep.equal( [] );
		} );
	} );

	describe( '#hide()', () => {
		let clock;

		beforeEach( () => {
			clock = sinon.useFakeTimers( {
				toFake: [ 'setTimeout' ]
			} );
		} );

		afterEach( () => {
			clock.restore();
		} );

		it( 'does nothing if spinner is not already shown', () => {
			const { stream: dummyStdout, output } = createDummyStream();
			const spinner = new Spinner( {
				stdout: dummyStdout
			} );

			spinner.hide();

			expect( output ).to.deep.equal( [] );
		} );

		it( 'erases line and shows cursor', () => {
			const { stream: dummyStdout, output } = createDummyStream();
			const spinner = new Spinner( {
				stdout: dummyStdout
			} );
			const expectedOutput = [
				consoleControl.gotoSOL() + consoleControl.eraseLine() + consoleControl.showCursor()
			];

			spinner.show();

			output.length = 0;

			spinner.hide();

			expect( output ).to.deep.equal( expectedOutput );
		} );

		it( 'is possible to reshow the spinner after hiding it', async () => {
			const { stream: dummyStdout, output } = createDummyStream();
			const spinner = new Spinner( {
				stdout: dummyStdout
			} );
			const expectedOutput = [
				consoleControl.hideCursor()
			];

			spinner.show();
			spinner.hide();

			await new Promise( ( resolve ) => {
				process.nextTick( resolve );
			} );

			output.length = 0;

			spinner.show();

			expect( output ).to.deep.equal( expectedOutput );
		} );
	} );
} );
