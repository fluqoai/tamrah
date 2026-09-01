'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, CheckCircle2, CreditCard, LockKeyhole, Mail, Phone, UserRound, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';

type Unit = { id: string; title_ar: string; base_price_sar: number; max_guests: number; unit_images: { public_url: string; sort_order: number }[] };

export default function BookingPage() {
  const [params, setParams] = useState({ checkIn: '', checkOut: '', guests: '2' });
  const [available, setAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState<Unit | null>(null);
  const nights = useMemo(() => {
    if (!params.checkIn || !params.checkOut) return 0;
    return Math.max(0, Math.round((new Date(params.checkOut).getTime() - new Date(params.checkIn).getTime()) / 86400000));
  }, [params]);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const next = { checkIn: search.get('checkIn') ?? '', checkOut: search.get('checkOut') ?? '', guests: search.get('guests') ?? '2' };
    const unitId = search.get('unit') ?? '80c9be6e-4ea0-44be-883f-7ae53e117335';
    setParams(next);
    Promise.all([
      supabase.from('units').select('id,title_ar,base_price_sar,max_guests,unit_images(public_url,sort_order)').eq('id', unitId).eq('is_published', true).single(),
      next.checkIn && next.checkOut ? supabase.rpc('check_unit_availability', { requested_unit_id: unitId, requested_check_in: next.checkIn, requested_check_out: next.checkOut, requested_guests: Number(next.guests) }) : Promise.resolve({ data: null }),
    ]).then(([unitResult, availabilityResult]) => { setUnit(unitResult.data as Unit | null); setAvailable(Boolean(availabilityResult.data?.[0]?.available)); setLoading(false); });
  }, []);

  return (
    <main dir="rtl" className="min-h-screen bg-background pb-16">
      <header className="border-b border-border bg-[#fffaf2]"><div className="site-shell flex h-20 items-center justify-between"><Link href="/" className="flex items-center gap-3"><span className="brand-mark">ت</span><strong className="text-xl">تمرة</strong></Link><div className="flex items-center gap-2 text-xs text-muted-foreground"><LockKeyhole className="size-4 text-[#394034]" /> دفع آمن ومشفّر</div></div></header>
      <div className="site-shell py-10">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowRight className="size-4" /> العودة للإقامة</Link>
        <div className="grid gap-8 lg:grid-cols-[1fr_390px]">
          <section className="rounded-[1.6rem] border border-border bg-[#fffaf2] p-5 shadow-sm sm:p-8">
            <div className="mb-8"><span className="eyebrow">الخطوة 2 من 3</span><h1 className="mt-2 text-3xl font-semibold">بيانات الضيف والدفع</h1><p className="mt-3 text-sm leading-7 text-muted-foreground">أدخل بيانات التواصل كما تظهر في الهوية، وستصلك تفاصيل الحجز بعد الدفع مباشرة.</p></div>
            {!loading && !available && <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-800">هذه التواريخ غير متاحة أو غير مكتملة. عد للصفحة الرئيسية واختر موعدًا آخر.</div>}
            <form className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2"><span className="flex items-center gap-2 text-sm font-semibold"><UserRound className="size-4 text-accent" /> الاسم الكامل</span><Input required autoComplete="name" className="h-12 bg-white" placeholder="الاسم كما في الهوية" /></label>
              <label className="space-y-2"><span className="flex items-center gap-2 text-sm font-semibold"><Phone className="size-4 text-accent" /> رقم الجوال</span><Input required dir="ltr" autoComplete="tel" className="h-12 bg-white text-right" placeholder="05xxxxxxxx" /></label>
              <label className="space-y-2 sm:col-span-2"><span className="flex items-center gap-2 text-sm font-semibold"><Mail className="size-4 text-accent" /> البريد الإلكتروني</span><Input required dir="ltr" type="email" autoComplete="email" className="h-12 bg-white text-right" placeholder="name@example.com" /></label>
              <label className="flex items-start gap-3 rounded-xl border border-border bg-white/60 p-4 text-xs leading-6 sm:col-span-2"><Checkbox required className="mt-1" /><span>أوافق على <Link className="font-semibold text-primary underline" href="/policies">سياسة الحجز والإلغاء</Link>، وأفهم أن الإلغاء خلال 24 ساعة من الوصول يترتب عليه خصم 150 ريال.</span></label>
              <div className="rounded-xl border border-dashed border-accent/60 bg-[#f7efe3] p-5 sm:col-span-2"><div className="flex items-start gap-3"><CreditCard className="mt-1 size-5 text-accent" /><div><h2 className="font-semibold">بوابة الدفع قيد التفعيل</h2><p className="mt-2 text-xs leading-6 text-muted-foreground">صفحة الحجز جاهزة للربط مع الراجحي أو Neoleap. سيتم تفعيل زر الدفع فور استلام بيانات الربط من المزود.</p></div></div></div>
              <Button disabled className="h-13 w-full rounded-xl text-base sm:col-span-2">الدفع وتأكيد الحجز — {nights * (unit?.base_price_sar ?? 0)} ر.س</Button>
            </form>
          </section>

          <aside className="h-fit rounded-[1.6rem] border border-border bg-[#fffaf2] p-5 shadow-sm lg:sticky lg:top-6">
            <div className="relative h-52 overflow-hidden rounded-2xl"><Image src={unit?.unit_images?.sort((a,b)=>a.sort_order-b.sort_order)[0]?.public_url?.startsWith('/') ? unit.unit_images.sort((a,b)=>a.sort_order-b.sort_order)[0].public_url : '/images/master-window.jpeg'} alt={unit?.title_ar ?? 'شقة تمرة'} fill className="object-cover" /></div>
            <h2 className="mt-5 text-xl font-semibold">{unit?.title_ar ?? 'شقة تمرة'}</h2><p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 className="size-4 text-[#394034]" /> حجز مؤكد بعد الدفع</p>
            <dl className="mt-6 space-y-4 border-y border-border py-5 text-sm"><div className="flex justify-between gap-4"><dt className="flex items-center gap-2 text-muted-foreground"><CalendarDays className="size-4" /> الوصول</dt><dd>{params.checkIn || '—'}، 4:00 م</dd></div><div className="flex justify-between gap-4"><dt className="flex items-center gap-2 text-muted-foreground"><CalendarDays className="size-4" /> المغادرة</dt><dd>{params.checkOut || '—'}، 12:00 م</dd></div><div className="flex justify-between gap-4"><dt className="flex items-center gap-2 text-muted-foreground"><Users className="size-4" /> الضيوف</dt><dd>{params.guests}</dd></div></dl>
            <div className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><span>{nights} ليالٍ × {unit?.base_price_sar ?? 0} ر.س</span><span>{nights * (unit?.base_price_sar ?? 0)} ر.س</span></div><div className="flex justify-between"><span>الضريبة</span><span>0 ر.س</span></div><div className="flex justify-between border-t border-border pt-4 text-lg font-semibold"><span>الإجمالي</span><span>{nights * (unit?.base_price_sar ?? 0)} ر.س</span></div></div>
          </aside>
        </div>
      </div>
    </main>
  );
}
