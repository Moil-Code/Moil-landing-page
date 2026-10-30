import type { ReactNode } from 'react';
import { BrandPageShell } from '../../../src/common/components/BrandPageShell';
import '../../business/business.css';

export default function AliadosLayout({ children }: { children: ReactNode }) {
  return <BrandPageShell initialLang="es">{children}</BrandPageShell>;
}
