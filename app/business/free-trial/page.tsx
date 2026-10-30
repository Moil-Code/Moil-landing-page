import { TrialPage } from './TrialPage';
import { TRIAL_EN } from './trialContent';
import { trialMetadata } from './trialMetadata';

export const metadata = trialMetadata('en');

// Rendered per request: the scarcity countdown starts from server time.
export const dynamic = 'force-dynamic';

export default function FreeTrialPage() {
  return <TrialPage copy={TRIAL_EN} serverNow={Date.now()} />;
}
