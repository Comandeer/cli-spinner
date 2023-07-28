import test from 'ava';
import * as pkg from '../src/index.js';
import Spinner from '../src/Spinner.js';

test( 'package exports Spinner as default export', ( t ) => {
	t.is( pkg.default, Spinner );
} );
