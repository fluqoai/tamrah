'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CalendarDays, CheckCircle2, ChevronLeft, Clock3, LoaderCircle, Users, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';

type Quote = { available: boolean; nights: number; nightly_rate_sar: number; total_sar: number };

export function BookingSearch({ unitId = '80c9be6e-4ea0-44be-883f-7ae53e117335', price = 400, maxGuests = 5 }: { unitId?: string; price?: number; maxGuests?: number }) {
  const today = new Date().toISOString().slice(0, 10);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function checkAvailability(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setQuote(null); setError('');
    if (!checkIn || !checkOut || checkOut <= checkIn) { setError('اختر تاريخ خروج بعد تاريخ الدخول.'); return; }
    setLoading(true);
    const { data, error: requestError } = await supabase.rpc('check_unit_availability', {
      requested_unit_id: unitId, requested_check_in: checkIn, requested_check_out: checkOut, requested_guests: Number(guests),
    });
    setLoading(false);
    if (requestError || !data?.[0]) { setError('تعذر التحقق الآن. حاول مرة أخرى بعد قليل.'); return; }
    setQuote(data[0] as Quote);
  }

  return (
    <form onSubmit={checkAvailability} className="booking-panel self-end rounded-[1.6rem] border border-white/45 bg-[#fffaf2]/95 p-4 shadow-2xl backdrop-blur-xl sm:p-6 lg:self-center" aria-label="ابحث عن موعد متاح">
      <div className="mb-5 flex items-start justify-between gap-4"><div><p className="text-xs font-medium text-accent-foreground">احجز إقامتك</p><h2 className="mt-1 text-2xl font-semibold text-primary">اختر موعد الوصول</h2></div><div className="text-left"><strong className="text-2xl text-primary">{price} ر.س</strong><span className="block text-xs text-muted-foreground">لليلة</span></div></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="booking-field"><span><CalendarDays />تاريخ الدخول</span><Input required min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} type="date" aria-label="تاريخ الدخول" /></label>
        <label className="booking-field"><span><CalendarDays />تاريخ الخروج</span><Input required min={checkIn || today} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} type="date" aria-label="تاريخ الخروج" /></label>
        <label className="booking-field sm:col-span-2"><span><Users />عدد الضيوف</span><select value={guests} onChange={(e) => setGuests(e.target.value)} aria-label="عدد الضيوف" className="h-10 w-full bg-transparent text-sm outline-none">{Array.from({ length: maxGuests }, (_, index) => index + 1).map((guest) => <option key={guest} value={guest}>{guest} {guest === 1 ? 'ضيف' : 'ضيوف'}</option>)}</select></label>
      </div>
      <Button disabled={loading} type="submit" size="lg" className="mt-4 h-13 w-full rounded-xl bg-primary text-base text-primary-foreground hover:bg-primary/90">{loading ? <><LoaderCircle className="animate-spin" /> جارٍ التحقق</> : <>تحقق من التوفر <ChevronLeft /></>}</Button>
      {error && <p role="alert" className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-800"><XCircle className="size-4" />{error}</p>}
      {quote && <div className={`mt-3 rounded-xl p-3 text-sm ${quote.available ? 'bg-[#e4eadf] text-[#394034]' : 'bg-red-50 text-red-800'}`}>{quote.available ? <div className="flex flex-wrap items-center justify-between gap-3"><span className="flex items-center gap-2"><CheckCircle2 className="size-4" />متاح لمدة {quote.nights} ليالٍ — الإجمالي {quote.total_sar} ر.س</span><Link className="inline-flex h-8 items-center gap-1 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground" href={`/book?unit=${unitId}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}>متابعة <ChevronLeft className="size-4" /></Link></div> : <span className="flex items-center gap-2"><XCircle className="size-4" />هذه التواريخ غير متاحة، جرّب موعدًا آخر.</span>}</div>}
      {!quote && <p className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground"><Clock3 className="size-3.5" /> إلغاء مجاني حتى 24 ساعة قبل الوصول</p>}
    </form>
  );
}
