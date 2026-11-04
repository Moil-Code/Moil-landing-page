#!/usr/bin/env node
'use strict';

/**
 * A page ships one translation table.
 *   node --test evals/localeBundles.test.js
 *
 * I18nProvider imported BOTH tables (src/common/translations/en.ts ~35 KB and
 * es.ts ~37 KB) into the client JavaScript of every page that renders it,
 * though each page renders one language. The table now comes from a thin
 * wrapper that imports only its own (EnglishI18nProvider, SpanishI18nProvider);
 * the provider fetches the other one with import() only when a visitor
 * actually asks for it. These checks are on the import graph, which is what
 * decides what the bundler puts in a page's chunks.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

// The tables a file imports STATICALLY, resolved to src/common/translations:
// 'en', 'es', or 'both' for the index that re-exports both. `import type` and
// import() are not static imports and do not count.
const TABLE_DIR = path.join(root, 'src/common/translations');
function staticTables(file) {
	const src = strip(read(file));
	const found = new Set();
	for (const m of src.matchAll(/^\s*import\s+(?!type\b)[^;]*?from\s+['"]([^'"]+)['"]/gm)) {
		const spec = m[1];
		let abs;
		if (spec.startsWith('.')) abs = path.resolve(path.dirname(path.join(root, file)), spec);
		else if (/^(~~|@)\//.test(spec)) abs = path.join(root, spec.slice(spec.indexOf('/') + 1));
		else continue;
		if (abs === TABLE_DIR || abs === path.join(TABLE_DIR, 'index')) found.add('both');
		else if (abs === path.join(TABLE_DIR, 'en')) found.add('en');
		else if (abs === path.join(TABLE_DIR, 'es')) found.add('es');
	}
	return found;
}

function walk(dir, out = []) {
	for (const e of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
		const rel = `${dir}/${e.name}`;
		if (e.isDirectory()) walk(rel, out);
		else if (/\.(tsx?|jsx?)$/.test(e.name)) out.push(rel);
	}
	return out;
}

describe('one translation table per page', () => {
	it('the provider core imports no table statically, and loads the other with import()', () => {
		const core = read('src/common/components/I18nProvider.tsx');
		assert.equal(staticTables('src/common/components/I18nProvider.tsx').size, 0, 'I18nProvider.tsx imports a table statically');
		assert.match(core, /import\('\.\.\/translations\/es'\)/);
		assert.match(core, /import\('\.\.\/translations\/en'\)/);
	});

	it('each wrapper imports only its own table', () => {
		assert.deepEqual([...staticTables('src/common/components/EnglishI18nProvider.tsx')], ['en']);
		assert.deepEqual([...staticTables('src/common/components/SpanishI18nProvider.tsx')], ['es']);
	});

	it('no client module imports both tables, or the index that re-exports both', () => {
		const files = [...walk('app'), ...walk('src')].filter((f) => !f.startsWith('src/common/translations/'));
		assert.ok(files.length > 200, `walked only ${files.length} files`);
		for (const f of files) {
			if (!/^\s*['"]use client['"]/.test(read(f))) continue;
			const t = staticTables(f);
			assert.ok(!t.has('both'), `${f} imports the index of both tables`);
			assert.ok(!(t.has('en') && t.has('es')), `${f} imports both tables`);
		}
	});

	it('the Spanish tree never mounts the English provider, nor the English tree the Spanish one', () => {
		for (const f of walk('app/es')) {
			const src = strip(read(f));
			assert.doesNotMatch(src, /EnglishI18nProvider|\bBrandPageShell\b(?!Es)/, `${f} mounts the English provider`);
		}
		for (const f of walk('app/(en)')) {
			const src = strip(read(f));
			assert.doesNotMatch(src, /SpanishI18nProvider|BrandPageShellEs/, `${f} mounts the Spanish provider`);
		}
	});

	it('every page that mounts a provider picks one by language', () => {
		const files = [...walk('app'), ...walk('src')];
		const mounts = files.filter((f) => /<(I18nProvider)\b/.test(strip(read(f))));
		// Only the two wrappers render the core provider.
		assert.deepEqual(mounts.sort(), [
			'src/common/components/EnglishI18nProvider.tsx',
			'src/common/components/SpanishI18nProvider.tsx',
		]);
	});
});
