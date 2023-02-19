import adapter from '@sveltejs/adapter-auto';
import node_adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),
	kit: {
		// adapter: adapter()
		adapter: node_adapter({ out: 'build', envPrefix: 'SVELTEKIT_'
		}),

	}
};

export default config;
