import type { ReactNode } from 'react';
import { BrandPageShell } from '../../../src/common/components/BrandPageShell';
import '../../(en)/business/business.css';
import '../../(en)/help/help.css';

export default function AyudaLayout({ children }: { children: ReactNode }) {
  return <BrandPageShell initialLang="es">{children}</BrandPageShell>;
}
