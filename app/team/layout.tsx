import type { ReactNode } from 'react';
import '../business/business.css';
import { BrandPageShell } from '../../src/common/components/BrandPageShell';

export default function TeamLayout({ children }: { children: ReactNode }) {
  return <BrandPageShell>{children}</BrandPageShell>;
}
