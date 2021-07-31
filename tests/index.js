import * as pkg from '../src/index.js';
import Spinner from '../src/Spinner.js';

describe( 'package', () => {
	it( 'exports Spinner as default export', () => {
		expect( pkg.default ).to.equal( Spinner );
	} );
} );
