import { Spacing, Top } from '_tosslib/components';
import * as styles from './PageLayout.styles';
interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}
export function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div css={styles.wrapper}>
      <Top.Top03 css={styles.title}>{title}</Top.Top03>
      {children}
      <Spacing size={24} />
    </div>
  );
}
