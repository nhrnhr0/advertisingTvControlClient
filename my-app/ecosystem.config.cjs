module.exports = {
    apps: [
        {
            name: 'my_app',
            script: './build/index.js',
            watch: false,
            ignore_watch: ['database'],
            autorestart: true,
            // ----------------------------------------------------
            // when I try to inject a .env it's just being ignored:
            // ----------------------------------------------------
            env: {
                PORT: 3028,
                ENV_PATH: "./.env",
		SVELTEKIT_PORT: 3028
            }
        }
    ]
};
