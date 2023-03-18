import { sveltekit } from '@sveltejs/kit/vite';
import path from "path"

/** @type {import('vite').UserConfig} */
const config = {
	resolve: {
        alias: {
            '$components': path.resolve('./src/components/'),
            '$src': path.resolve('./src/'),
			'$utils': path.resolve('./src/utils/'),
			'$stores': path.resolve('./src/stores/'),
        },
    },
	plugins: [sveltekit()]
};

export default config;
