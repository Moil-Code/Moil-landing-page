import { TrialPage } from '../../../business/free-trial/TrialPage';
import { TRIAL_ES } from '../../../business/free-trial/trialContent';
import { trialMetadata } from '../../../business/free-trial/trialMetadata';

/**
 * /es/prueba-gratis, el gemelo en español de /free-trial. Mismo cuerpo, mismo
 * comportamiento; cada botón abre el registro con lg=es. El texto es un
 * borrador hasta que lo revise una persona nativa (lo pide el brief).
 */
export const metadata = trialMetadata('es');

export const dynamic = 'force-dynamic';

export default function PruebaGratisPage() {
  return <TrialPage copy={TRIAL_ES} serverNow={Date.now()} />;
}
