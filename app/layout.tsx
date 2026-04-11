import type { Metadata } from 'next';
import './globals.css';
import { createClient } from '@supabase/supabase-js';

const DEFAULT_TITLE = '(주)와이앤케이 YNK';
const DEFAULT_DESC  = 'YNK LED 조명 전문기업 — 고품질 LED 조명 솔루션';
const DEFAULT_ICON  = '/ynk-icon.svg';

export async function generateMetadata(): Promise<Metadata> {
  let title = DEFAULT_TITLE;
  let description = DEFAULT_DESC;
  let iconUrl = DEFAULT_ICON;

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data } = await supabase
      .from('site_settings')
      .select('config')
      .eq('category', 'site')
      .maybeSingle();

    if (data?.config) {
      title       = data.config.site_name   || title;
      description = data.config.description || description;
      iconUrl     = data.config.logo_url    || iconUrl;
    }
  } catch { /* use defaults */ }

  return {
    title,
    description,
    keywords: 'LED 조명, YNK, 와이앤케이, LED 모듈, 조명기구, 실내조명, 산업조명',
    icons: {
      icon: [
        { url: iconUrl, sizes: 'any' },
      ],
      shortcut: iconUrl,
      apple: iconUrl,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
