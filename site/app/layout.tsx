import type { Metadata } from 'next';
import { Noto_Kufi_Arabic } from 'next/font/google';
import './globals.css';

const notoKufi = Noto_Kufi_Arabic({ variable: '--font-tamra', subsets: ['arabic', 'latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'تمرة للضيافة | إقامة دافئة في شمال جدة',
  description: 'شقة عائلية أنيقة في حي الأصيل شمال جدة. غرفتا نوم، موقف خاص، وحجز مؤكد مباشرة.',
  openGraph: {
    title: 'تمرة للضيافة',
    description: 'إقامة دافئة في شمال جدة',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'تمرة للضيافة — إقامة دافئة في شمال جدة' }],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'تمرة للضيافة', description: 'إقامة دافئة في شمال جدة', images: ['/og.png'] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body className={`${notoKufi.variable} antialiased`}>{children}</body></html>;
}
