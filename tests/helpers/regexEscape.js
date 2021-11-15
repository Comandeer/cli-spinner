function regexEscape( input ) {
	return input.replace( /\\/g, '\\\\' ).replace( /([[\]/])/g, '\\$1' );
}

export default regexEscape;
