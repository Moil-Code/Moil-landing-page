import type { ReactNode } from 'react';
import { BrandPageShellEs } from '../../../src/common/components/BrandPageShellEs';
import '../../(en)/business/business.css';
import '../../(en)/help/help.css';

export default function AyudaLayout({ children }: { children: ReactNode }) {
  return <BrandPageShellEs>{children}</BrandPageShellEs>;
}
