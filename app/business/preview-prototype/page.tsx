import { notFound } from 'next/navigation';
import { PreviewDesignPrototype } from './PreviewDesignPrototype';

export const metadata = {
	title: 'Preview design prototype · Moil',
	robots: { index: false, follow: false },
};

/**
 * THROWAWAY UI PROTOTYPE — never a production surface.
 *
 * Three structurally different directions for the ready-state preview,
 * switchable with `?variant=A|B|C` on this route. The winning information
 * architecture should be rebuilt in GettingToKnowYou.tsx; this route and its
 * siblings should then leave main.
 */
export default function PreviewPrototypePage() {
	if (process.env.NODE_ENV === 'production') notFound();
	return <PreviewDesignPrototype />;
}
