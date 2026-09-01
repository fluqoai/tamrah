'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, CheckCircle2, Clock3, Home, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ConfirmationPage() {
  const [booking, setBooking] = useState({ ref: '', checkIn: '', checkOut: '' });
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    setBooking({ ref: search.get('ref') ?? '', checkIn: search.get('checkIn') ?? '', checkOut: search.get('checkOut') ?? '' });
  }, []);

  return <main dir="rtl" className="grid min-h-screen place-items-center bg-[#eee5d8] p-5"><section className="w-full max-w-xl overflow-hidden rounded-[2rem] border border-border bg-[#fffaf2] shadow-[0_28px_80px_rgba(59,40,32,.16)]"><div className="bg-[#394034] px-6 py-10 text-center text-white"><CheckCircle2 className="mx-auto size-14 text-[#d2a867]"/><span className="mt-4 block text-xs text-white/60">تمرة للضيافة</span><h1 className="mt-2 text-3xl font-semibold">تم تأكيد حجزك</h1><p className="mt-3 text-sm text-white/70">نتطلع لاستقبالك في جدة</p></div><div className="p-6 sm:p-8"><div className="rounded-2xl border border-border bg-white/55 p-5"><span className="text-xs text-muted-foreground">رقم الحجز</span><strong dir="ltr" className="mt-1 block font-mono text-lg">{booking.ref || '—'}</strong><div className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2"><div className="flex gap-3"><CalendarDays className="size-5 text-accent"/><div><span className="text-xs text-muted-foreground">تاريخ الدخول</span><strong className="block">{booking.checkIn || '—'}</strong></div></div><div className="flex gap-3"><CalendarDays className="size-5 text-accent"/><div><span className="text-xs text-muted-foreground">تاريخ الخروج</span><strong className="block">{booking.checkOut || '—'}</strong></div></div><div className="flex gap-3"><Clock3 className="size-5 text-accent"/><span className="text-sm">الدخول 4:00 م · الخروج 12:00 م</span></div><div className="flex gap-3"><Home className="size-5 text-accent"/><span className="text-sm">حي الأصيل، شمال جدة</span></div></div></div><p className="mt-5 text-center text-xs leading-6 text-muted-foreground">احتفظ بهذا الرابط ورقم الحجز. لأي مساعدة يمكنك التواصل معنا مباشرة عبر واتساب.</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><Button asChild variant="outline" className="h-12"><Link href="/">العودة للرئيسية</Link></Button><Button asChild className="h-12 bg-[#1f9d55] text-white hover:bg-[#168447]"><a href="https://wa.me/966559386212" target="_blank" rel="noreferrer"><MessageCircle/>واتساب تمرة</a></Button></div></div></section></main>;
}
