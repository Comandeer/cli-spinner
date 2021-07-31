import { Duplex as DuplexStream } from 'stream';
import { Writable as WritableStream } from 'stream';

function createDummyStream( type = 'writable' ) {
	const output = [];
	const StreamConstructor = type === 'writable' ? WritableStream : DuplexStream;

	return {
		stream: new StreamConstructor( {
			write( chunk, encoding, callback ) {
				output.push( chunk.toString() );

				if ( callback ) {
					callback();
				}
			}
		} ),
		output
	};
}

export default createDummyStream;
