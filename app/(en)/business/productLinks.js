'use strict';

/**
 * Where each Moil product lives on the marketing site.
 *
 * ── THE DEFECT ──────────────────────────────────────────────────────
 * QA 2026-09-11: the product menu sent people to the wrong place. Two
 * of the three entries were wrong and both were wrong silently — a link
 * that scrolls somewhere plausible does not look broken, it looks like
 * the product is thin.
 *
 *   Business Plan  -> /business          the page you are already on
 *   Moil360        -> /business#pricing  the PRICING table, not the
 *                                        product
 *
 * So somebody who clicked "Moil360" to find out what Moil360 is landed
 * on a price list for something they had not been shown yet.
 *
 * ── ONE VOCABULARY, BECAUSE THERE WERE TWO COPIES ───────────────────
 * The same three entries were written out twice — the desktop dropdown
 * in `components/BusinessNav.tsx` and the mobile menu in
 * `BusinessPageContent.tsx` — which is why the same wrong href had to be
 * fixed in two places and why the next edit would have fixed only one.
 * Both read this now.
 *
 * ── AN ANCHOR IS A CLAIM ABOUT THE PAGE ─────────────────────────────
 * `#product-moil360` is only better than `#pricing` if the id exists.
 * `evals/productNavTargets.test.js` resolves every in-page href against
 * the ids actually rendered, so a link pointing at nothing fails there
 * rather than on a visitor's screen — which is the shape of this whole
 * defect and the only part of it a person could not see.
 *
 * Pure data. No I/O, no React.
 */

/**
 * The anchor ids this file promises the /business page renders.
 * Named as PRODUCTS rather than as sections: `#pricing` and
 * `#capabilities` describe where a thing happens to sit today, and a
 * product link should survive the page being rearranged.
 */
const PRODUCT_ANCHORS = {
	businessPlan: 'product-business-plan',
	moil360: 'product-moil360',
};

/**
 * The product menu, in the order it is shown.
 *
 * `label` is the visible text; the nav dropdown carries its own copy and
 * imagery and reads only `id` and `href`, so the two cannot disagree
 * about WHERE a product is while still differing about how it is
 * described.
 */
const PRODUCT_LINKS = [
	{
		id: 'businessPlan',
		label: 'Business Plan',
		href: `/business#${PRODUCT_ANCHORS.businessPlan}`,
	},
	{
		id: 'moil360',
		label: 'Moil360',
		href: `/business#${PRODUCT_ANCHORS.moil360}`,
	},
	{
		// A different page, not an anchor — and that is why it was the one
		// entry that was already right.
		id: 'hiring',
		label: 'Hiring',
		href: '/candidate',
	},
];

/**
 * @param {string} id
 * @returns {string}
 */
function productHref(id) {
	const found = PRODUCT_LINKS.find((p) => p.id === id);
	return found ? found.href : '/business';
}

module.exports = { PRODUCT_ANCHORS, PRODUCT_LINKS, productHref };
