#!/usr/bin/env node
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

function walk(directory, out = []) {
	const absolute = path.join(root, directory);
	if (!fs.existsSync(absolute)) return out;
	for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
		if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
		const relative = path.join(directory, entry.name);
		if (entry.isDirectory()) walk(relative, out);
		else if (/\.(tsx?|jsx?|mjs)$/.test(entry.name)) out.push(relative);
	}
	return out;
}

describe('production link configuration', () => {
	it('uses the production candidate and business applications', () => {
		const config = read('src/common/constants/baseUrl.tsx');
		assert.match(config, /workerBaseUrl\s*=\s*["']https:\/\/candidate\.moilapp\.com/);
		assert.match(config, /businessBaseUrl\s*=\s*["']https:\/\/business\.moilapp\.com/);
		assert.doesNotMatch(config, /employee-beta|employer-beta/);
	});

	it('contains no stagebeta application origins in executable source', () => {
		const hits = [];
		for (const file of [...walk('app'), ...walk('src')]) {
			const code = read(file)
				.replace(/\/\*[\s\S]*?\*\//g, '')
				.replace(/(^|[^:])\/\/.*$/gm, '$1');
			for (const origin of ['employee-beta.moilapp.com', 'employer-beta.moilapp.com']) {
				if (code.includes(origin)) hits.push(`${file} — ${origin}`);
			}
		}
		assert.deepEqual(hits, [], `stagebeta origins in production source:\n  ${hits.join('\n  ')}`);
	});

	it('does not carry stagebeta-only deploy assertions', () => {
		assert.equal(fs.existsSync(path.join(root, 'evals/stagebetaDeploy.test.js')), false);
		assert.equal(fs.existsSync(path.join(root, 'evals/linkConfig.test.js')), false);
	});
});
