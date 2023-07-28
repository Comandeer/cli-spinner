import createDummyStream from './__helpers__/createDummyStream.js';
import isInteractive from '../src/isInteractive.js';

describe( 'isInteractive', () => {
	const originalCI = process.env.CI;
	const originalTERM = process.env.TERM;

	beforeEach( () => {
		delete process.env.CI;
		delete process.env.TERM;
	} );

	afterEach( () => {
		if ( originalCI !== undefined ) {
			process.env.CI = originalCI;
		}

		if ( originalTERM !== undefined ) {
			process.env.TERM = originalTERM;
		}
	} );

	it( 'returns true for TTY stream', () => {
		const { stream: testStream } = createDummyStream( {
			isTTY: true
		} );
		const result = isInteractive( testStream );

		expect( result ).to.equal( true );
	} );

	it( 'returns false for non-TTY stream', () => {
		const { stream: testStream } = createDummyStream( {
			isTTY: false
		} );
		const result = isInteractive( testStream );

		expect( result ).to.equal( false );
	} );

	it( 'returns false for TTY stream on CI', () => {
		process.env.CI = 'true';

		const { stream: testStream } = createDummyStream( {
			isTTY: true
		} );
		const result = isInteractive( testStream );

		expect( result ).to.equal( false );
	} );

	it( 'returns false for TTY stream when TERM = dumb', () => {
		process.env.TERM = 'dumb';

		const { stream: testStream } = createDummyStream( {
			isTTY: true
		} );
		const result = isInteractive( testStream );

		expect( result ).to.equal( false );
	} );
} );
