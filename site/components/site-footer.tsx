import Link from 'next/link';
import { Clock3, Mail, MapPin, MessageCircle } from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';

export function SiteFooter({ locale = 'ar' }: { locale?: 'ar' | 'en' }) {
  const ar = locale === 'ar';
  return (
    <footer id="contact" dir={ar ? 'rtl' : 'ltr'} className="relative overflow-hidden bg-[#241713] text-white/70">
      <div className="pattern-overlay absolute inset-0 opacity-[.045]" />
      <div className="site-shell relative py-14 sm:py-16">
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-[1.25fr_.75fr_.9fr]">
          <div className="max-w-sm">
            <Link href={ar ? '/' : '/en'} className="flex items-center gap-3 text-white"><BrandLogo /><span><strong className="block text-xl">{ar ? 'تمرة' : 'Tamra'}</strong><small className="tracking-wider text-white/45">TAMRA HOSPITALITY</small></span></Link>
            <p className="mt-5 text-sm leading-7">{ar ? 'إقامة دافئة ومتكاملة في حي الأصيل شمال جدة، صُممت لتمنحك راحة البيت وخصوصية المكان.' : 'A warm, fully equipped stay in Al Aseel, North Jeddah, designed for comfort and privacy.'}</p>
          </div>
          <div><h3 className="font-semibold text-white">{ar ? 'معلومات الإقامة' : 'Stay information'}</h3><ul className="mt-5 space-y-4 text-sm"><li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-[#d2a867]" />{ar ? 'حي الأصيل، شمال جدة' : 'Al Aseel, North Jeddah'}</li><li className="flex gap-3"><Clock3 className="mt-0.5 size-4 shrink-0 text-[#d2a867]" />{ar ? 'الدخول 4:00 م · الخروج 12:00 م' : 'Check-in 4 PM · Check-out 12 PM'}</li><li><Link className="hover:text-white" href="/policies">{ar ? 'سياسة الحجز والإلغاء' : 'Booking & cancellation policy'}</Link></li></ul></div>
          <div><h3 className="font-semibold text-white">{ar ? 'تواصل معنا' : 'Contact us'}</h3><ul className="mt-5 space-y-4 text-sm"><li><a className="flex items-center gap-3 hover:text-white" href="https://wa.me/966559386212" target="_blank" rel="noreferrer"><MessageCircle className="size-4 text-[#d2a867]" /><span dir="ltr">+966 55 938 6212</span></a></li><li><a className="flex items-center gap-3 hover:text-white" href="mailto:fahad999792@gmail.com"><Mail className="size-4 text-[#d2a867]" /><span dir="ltr">fahad999792@gmail.com</span></a></li><li><Link className="inline-flex text-white/45 hover:text-white" href="/admin">{ar ? 'دخول المالك' : 'Owner login'}</Link></li></ul></div>
        </div>
        <div className="flex flex-col gap-3 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} {ar ? 'تمرة للضيافة. جميع الحقوق محفوظة.' : 'Tamra Hospitality. All rights reserved.'}</p><Link className="hover:text-white" href={ar ? '/en' : '/'}>{ar ? 'English' : 'العربية'}</Link></div>
      </div>
    </footer>
  );
}
