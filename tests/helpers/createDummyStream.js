import { Duplex as DuplexStream } from 'stream';
import { Writable as WritableStream } from 'stream';

function createDummyStream( {
	type = 'writable',
	isTTY = true
} = {} ) {
	const output = [];
	const StreamConstructor = type === 'writable' ? WritableStream : DuplexStream;
	const stream = new StreamConstructor( {
		write( chunk, encoding, callback ) {
			output.push( chunk.toString() );

			if ( callback ) {
				callback();
			}
		}
	} );

	stream.isTTY = isTTY;

	return {
		stream,
		output
	};
}

export default createDummyStream;
