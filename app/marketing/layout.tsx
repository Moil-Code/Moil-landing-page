import { content360Styles } from './content360Styles';

// Server component — injects CSS in the initial HTML, preventing flash of unstyled content
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: content360Styles }} />
      {children}
    </>
  );
}
