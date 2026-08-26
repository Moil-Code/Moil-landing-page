// PM2 process definition for the landing page.
//
// `.github/deploy.sh` runs `pm2 startOrReload ecosystem.config.js`, so this file
// is what decides how the app runs in production — the deploy does not carry a
// command of its own.
//
// The name comes from the environment so one file serves whatever the server
// calls this app; deploy.sh exports PM2_NAME before reloading. The fallback is
// only for running it by hand.
module.exports = {
	apps: [
		{
			name: process.env.PM2_NAME || 'moil-landing',
			// `next start` — NOT a static file server. This app has middleware and
			// server-rendered routes, so there is no static export to hand to nginx.
			//
			// Run through the local binary rather than `npm`/`yarn start`: PM2 keeps
			// the script path an app was ORIGINALLY started with, so an app first
			// started via a package manager reloads that package manager forever and
			// silently ignores changes made here.
			script: './node_modules/next/dist/bin/next',
			args: 'start',
			cwd: __dirname,
			instances: 1,
			exec_mode: 'fork',
			// Next reads PORT; keep it explicit so the health check's port and the
			// listening port cannot drift apart.
			env: {
				NODE_ENV: 'production',
				PORT: process.env.PORT || 3000,
			},
			// A build artifact is large and the app is long-lived; a restart storm
			// on a bad deploy should stop rather than hammer the box forever.
			max_restarts: 10,
			min_uptime: '20s',
			// Next writes its own request logs to stdout; let PM2 timestamp them so
			// a deploy transcript and the app log can be lined up.
			time: true,
		},
	],
};
