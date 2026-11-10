import { EnglishI18nProvider } from '../../../../src/common/components/EnglishI18nProvider';
import { TrialPage } from './TrialPage';
import { TRIAL_EN } from './trialContent';
import { trialMetadata } from './trialMetadata';

export const metadata = trialMetadata('en');

// Rendered per request: the scarcity countdown starts from server time.
export const dynamic = 'force-dynamic';

export default function FreeTrialPage() {
  return (
    <EnglishI18nProvider initialLang="en">
      <TrialPage copy={TRIAL_EN} serverNow={Date.now()} />
    </EnglishI18nProvider>
  );
}
