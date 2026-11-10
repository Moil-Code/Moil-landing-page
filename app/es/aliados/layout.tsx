import type { ReactNode } from 'react';
import { BrandPageShellEs } from '../../../src/common/components/BrandPageShellEs';
import '../../(en)/business/business.css';

export default function AliadosLayout({ children }: { children: ReactNode }) {
  return <BrandPageShellEs>{children}</BrandPageShellEs>;
}
