export default function regexEscape( input ) {
	return input.replace( /\\/g, '\\\\' ).replace( /([[\]/])/g, '\\$1' );
}
