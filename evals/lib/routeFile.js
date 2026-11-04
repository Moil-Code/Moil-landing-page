'use strict';

/**
 * The file that serves a URL route, looking through route groups.
 *
 * `/business` is served from app/(en)/business/page.tsx and
 * `/es/plan-de-marketing-para-mi-negocio` from app/es/(guias)/…/page.tsx: a
 * folder named `(x)` is a route GROUP, never a URL segment. Evals that check
 * "this link resolves to a real page" go through here so a group added or
 * moved later cannot make every link look broken (or, worse, make a check
 * that silently finds nothing).
 *
 *   routeFile(root, '/partners/iedc')            -> 'app/(en)/partners/iedc/page.tsx'
 *   routeFile(root, '/terms', 'layout.tsx')      -> 'app/(en)/terms/layout.tsx'
 *   routeFile(root, '/nope')                     -> null
 */
const fs = require('fs');
const path = require('path');

const isGroup = (name) => /^\(.*\)$/.test(name);

function routeFile(root, route, leaf = 'page.tsx') {
	const segments = String(route).split('?')[0].split('/').filter(Boolean);
	const search = (dir, rest) => {
		if (rest.length === 0) {
			const direct = path.join(dir, leaf);
			if (fs.existsSync(direct)) return direct;
		}
		let entries;
		try {
			entries = fs.readdirSync(dir, { withFileTypes: true });
		} catch {
			return null;
		}
		for (const e of entries) {
			if (!e.isDirectory()) continue;
			if (rest.length && e.name === rest[0]) {
				const hit = search(path.join(dir, e.name), rest.slice(1));
				if (hit) return hit;
			} else if (isGroup(e.name)) {
				const hit = search(path.join(dir, e.name), rest);
				if (hit) return hit;
			}
		}
		return null;
	};
	const hit = search(path.join(root, 'app'), segments);
	return hit ? path.relative(root, hit).split(path.sep).join('/') : null;
}

module.exports = { routeFile };
