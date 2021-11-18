const Spinner = require( './cli-spinner.cjs' );
const spinner = new Spinner();

( async function() {
	await spinner.show();

	await new Promise( ( resolve ) => {
		setTimeout( resolve, 10000 );
	} );

	await spinner.hide();
}() );
