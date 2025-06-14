import ThemeProvider from '@/components/ThemeProvider';
import GlobalStaticMethods from '@/utils/globalMessage';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { App } from 'antd';
import type { Metadata } from 'next';
import './globals.css';

import { staticPath } from '@/utils/path-utils';

export const metadata: Metadata = {
  title: '时区转换工具',
  description: '轻松管理不同时区的时间转换',
  icons: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      url: staticPath('/images/favicon/favicon.svg'),
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '96x96',
      url: staticPath('/images/favicon/favicon-96x96.png'),
    },
    {
      rel: 'apple-touch-icon',
      url: staticPath('/images/favicon/apple-touch-icon.png'),
    },
    {
      rel: 'shortcut icon',
      url: staticPath('/images/favicon/favicon.ico'),
    },
  ],
  manifest: staticPath('/images/favicon/site.webmanifest'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body>
        <AntdRegistry>
          <ThemeProvider>
            <App>
              <GlobalStaticMethods />
              {children}
            </App>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
