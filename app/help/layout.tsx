import type { ReactNode } from 'react';
import { BrandPageShell } from '../../src/common/components/BrandPageShell';
import '../business/business.css';
import './help.css';

export default function HelpLayout({ children }: { children: ReactNode }) {
  return <BrandPageShell initialLang="en">{children}</BrandPageShell>;
}
