import type { Metadata } from 'next';
import { Noto_Kufi_Arabic } from 'next/font/google';
import './globals.css';

const notoKufi = Noto_Kufi_Arabic({ variable: '--font-tamra', subsets: ['arabic', 'latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'تمرة للضيافة | إقامة دافئة في شمال جدة',
  description: 'شقة عائلية أنيقة في حي الأصيل شمال جدة. غرفتا نوم، موقف خاص، وحجز مؤكد مباشرة.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body className={`${notoKufi.variable} antialiased`}>{children}</body></html>;
}
