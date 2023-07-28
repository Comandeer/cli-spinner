import { Duplex as DuplexStream, Writable as WritableStream } from 'node:stream';

export default function createDummyStream( {
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
