import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800']
});

export const metadata = {
  title: 'Aman Sharma · Experience Systems',
  description:
    'Aman Sharma 的产品体验导航站，聚焦策略、体验系统、设计工程与协作流程，帮助团队快速评估合作价值。'
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
