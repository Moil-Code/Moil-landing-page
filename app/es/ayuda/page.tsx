import type { Metadata } from 'next';
import { baseURL1 } from '../../../src/common/constants/baseUrl';
import { HelpPageBody } from '../../../src/common/help/HelpPageBody';
import '../../help/help.css';

/** /es/ayuda — the Spanish twin of /help. Same list, same schema, Spanish document. */
export const metadata: Metadata = {
  title: 'Centro de ayuda — primeros pasos, planes, publicación, facturación',
  description: 'Respuestas claras a lo que más nos preguntan los dueños de negocio: cómo empezar, qué incluyen Professional y Market Pro, cómo se publica en tus cuentas, la facturación y tus datos.',
  alternates: {
    canonical: `${baseURL1}/es/ayuda`,
    languages: { en: `${baseURL1}/help`, es: `${baseURL1}/es/ayuda`, 'x-default': `${baseURL1}/help` },
  },
  openGraph: { title: 'Centro de ayuda | Moil', description: 'Primeros pasos, planes, publicación, facturación y tus datos, explicados con claridad.', url: `${baseURL1}/es/ayuda`, locale: 'es_US' },
};

export default function AyudaPage() {
  return <HelpPageBody lang="es" />;
}
