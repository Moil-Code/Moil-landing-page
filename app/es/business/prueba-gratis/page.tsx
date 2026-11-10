import { SpanishI18nProvider } from '../../../../src/common/components/SpanishI18nProvider';
import { TrialPage } from '../../../(en)/business/free-trial/TrialPage';
import { TRIAL_ES } from '../../../(en)/business/free-trial/trialContent';
import { trialMetadata } from '../../../(en)/business/free-trial/trialMetadata';

/**
 * /es/prueba-gratis, el gemelo en español de /free-trial. Mismo cuerpo, mismo
 * comportamiento; cada botón abre el registro con lg=es. El texto es un
 * borrador hasta que lo revise una persona nativa (lo pide el brief).
 */
export const metadata = trialMetadata('es');

export const dynamic = 'force-dynamic';

export default function PruebaGratisPage() {
  return (
    <SpanishI18nProvider>
      <TrialPage copy={TRIAL_ES} serverNow={Date.now()} />
    </SpanishI18nProvider>
  );
}
