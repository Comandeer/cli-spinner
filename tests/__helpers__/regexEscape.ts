export default function regexEscape( input: string ): string {
	return input.replace( /\\/g, '\\\\' ).replace( /([[\]/])/g, '\\$1' );
}
