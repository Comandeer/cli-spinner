import createDummyStream from './helpers/createDummyStream';
import isInteractive from '../src/isInteractive';

describe( 'isInteractive', () => {
	const originalCI = process.env.CI;
	const originalTERM = process.env.TERM;

	beforeEach( () => {
		delete process.env.CI;
		delete process.env.TERM;
	} );

	afterEach( () => {
		process.env.CI = originalCI;
		process.env.TERM = originalTERM;
	} );

	it( 'returns true for TTY stream', () => {
		const testStream = createDummyStream();

		testStream.isTTY = true;

		const result = isInteractive( testStream );

		expect( result ).to.equal( true );
	} );

	it( 'returns false for non-TTY stream', () => {
		const testStream = createDummyStream();

		testStream.isTTY = false;

		const result = isInteractive( testStream );

		expect( result ).to.equal( false );
	} );

	it( 'returns false for TTY stream on CI', () => {
		const testStream = createDummyStream();

		process.env.CI = 'true';
		testStream.isTTY = true;

		const result = isInteractive( testStream );

		expect( result ).to.equal( false );
	} );

	it( 'returns false for TTY stream when TERM = dumb', () => {
		const testStream = createDummyStream();

		process.env.TERM = 'dumb';
		testStream.isTTY = true;

		const result = isInteractive( testStream );

		expect( result ).to.equal( false );
	} );
} );
