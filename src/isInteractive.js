// Totally not inspired by https://github.com/sindresorhus/is-interactive
// In fact I should be using Sindre's package, but as long as I'm stuck with CJS
// it's not an option 😿
export default function isInteractive( stream ) {
	const isCI = 'CI' in process.env;
	const isDumb = process.env.TERM === 'dumb';
	const isTTY = stream.isTTY;

	return isTTY && !isCI && !isDumb;
}
