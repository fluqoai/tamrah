'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarOff, CheckCircle2, Home, LoaderCircle, LogOut, Mail, Save, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';

const UNIT_ID = '80c9be6e-4ea0-44be-883f-7ae53e117335';
type Booking = { id: string; booking_reference: string; guest_name: string; check_in: string; check_out: string; total_sar: number; status: string };

export default function AdminPage() {
  const [sessionReady, setSessionReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState('fahad999792@gmail.com');
  const [message, setMessage] = useState('');
  const [price, setPrice] = useState('400');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [block, setBlock] = useState({ start: '', end: '', reason: '' });
  const [busy, setBusy] = useState(false);

  const loadDashboard = useCallback(async () => {
    const [{ data: unit }, { data: bookingRows }] = await Promise.all([
      supabase.from('units').select('base_price_sar').eq('id', UNIT_ID).single(),
      supabase.from('bookings').select('id,booking_reference,guest_name,check_in,check_out,total_sar,status').order('created_at', { ascending: false }).limit(20),
    ]);
    if (unit) setPrice(String(unit.base_price_sar));
    setBookings((bookingRows as Booking[]) ?? []);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { const active = Boolean(data.session); setSignedIn(active); setSessionReady(true); if (active) loadDashboard(); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { setSignedIn(Boolean(session)); if (session) loadDashboard(); });
    return () => listener.subscription.unsubscribe();
  }, [loadDashboard]);

  async function sendLogin() {
    setBusy(true); setMessage('');
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    setBusy(false); setMessage(error ? 'تعذر إرسال رابط الدخول.' : 'أرسلنا رابط دخول آمن إلى البريد. افتحه للمتابعة.');
  }

  async function savePrice() {
    setBusy(true); const { error } = await supabase.from('units').update({ base_price_sar: Number(price) }).eq('id', UNIT_ID); setBusy(false); setMessage(error ? 'لم يتم حفظ السعر. تأكد أنك تستخدم بريد الإدارة.' : 'تم تحديث السعر بنجاح.');
  }

  async function blockDates() {
    if (!block.start || !block.end || block.end <= block.start) { setMessage('اختر فترة صحيحة للحجب.'); return; }
    setBusy(true); const { error } = await supabase.from('blocked_dates').insert({ unit_id: UNIT_ID, start_date: block.start, end_date: block.end, reason: block.reason || 'حجب من الإدارة' }); setBusy(false);
    setMessage(error ? 'تعذر حجب الفترة؛ قد تكون متداخلة مع فترة محجوبة.' : 'تم حجب الفترة من الحجوزات.'); if (!error) setBlock({ start: '', end: '', reason: '' });
  }

  if (!sessionReady) return <main className="grid min-h-screen place-items-center bg-background"><LoaderCircle className="animate-spin text-accent" /></main>;
  if (!signedIn) return <main dir="rtl" className="grid min-h-screen place-items-center bg-[#3b2820] p-5"><section className="w-full max-w-md rounded-[1.8rem] bg-[#fffaf2] p-7 shadow-2xl"><Link href="/" className="mb-8 flex items-center gap-3"><span className="brand-mark">ت</span><strong className="text-xl">تمرة</strong></Link><span className="eyebrow">للمالك فقط</span><h1 className="mt-2 text-3xl font-semibold">دخول لوحة الإدارة</h1><p className="mt-3 text-sm leading-7 text-muted-foreground">سنرسل رابط دخول لمرة واحدة إلى بريد الإدارة المعتمد.</p><label className="mt-7 block space-y-2"><span className="flex items-center gap-2 text-sm font-semibold"><Mail className="size-4 text-accent" />البريد الإلكتروني</span><Input dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="h-12 bg-white text-right" /></label><Button onClick={sendLogin} disabled={busy} className="mt-4 h-12 w-full">{busy ? <LoaderCircle className="animate-spin" /> : 'إرسال رابط الدخول'}</Button>{message && <p className="mt-4 rounded-xl bg-muted p-3 text-xs leading-6">{message}</p>}</section></main>;

  return <main dir="rtl" className="min-h-screen bg-[#eee5d8]"><header className="bg-[#3b2820] text-white"><div className="site-shell flex h-20 items-center justify-between"><Link href="/" className="flex items-center gap-3"><span className="brand-mark">ت</span><div><strong>تمرة</strong><span className="block text-[10px] text-white/60">لوحة المالك</span></div></Link><Button onClick={() => supabase.auth.signOut()} variant="ghost" className="text-white hover:bg-white/10 hover:text-white"><LogOut />خروج</Button></div></header><div className="site-shell py-10"><div className="mb-8"><span className="eyebrow">مرحبًا فهد</span><h1 className="mt-2 text-3xl font-semibold sm:text-5xl">إدارة الإقامة والحجوزات</h1></div>{message && <div className="mb-6 flex items-center gap-2 rounded-xl bg-[#e1e7dd] p-4 text-sm text-[#394034]"><CheckCircle2 className="size-4" />{message}</div>}<div className="grid gap-5 lg:grid-cols-3"><section className="rounded-2xl border border-border bg-[#fffaf2] p-6"><span className="feature-icon"><Settings2 /></span><h2 className="mt-5 text-xl font-semibold">السعر الأساسي</h2><p className="mt-2 text-xs text-muted-foreground">يُطبّق على الليالي الجديدة فورًا.</p><div className="mt-5 flex gap-2"><Input dir="ltr" type="number" min="1" value={price} onChange={(e) => setPrice(e.target.value)} className="h-11 bg-white text-right" /><Button onClick={savePrice} disabled={busy} className="h-11"><Save />حفظ</Button></div></section><section className="rounded-2xl border border-border bg-[#fffaf2] p-6 lg:col-span-2"><span className="feature-icon"><CalendarOff /></span><h2 className="mt-5 text-xl font-semibold">حجب تواريخ</h2><div className="mt-5 grid gap-3 sm:grid-cols-3"><Input type="date" value={block.start} onChange={(e) => setBlock({ ...block, start: e.target.value })} className="h-11 bg-white" /><Input type="date" value={block.end} onChange={(e) => setBlock({ ...block, end: e.target.value })} className="h-11 bg-white" /><Input value={block.reason} onChange={(e) => setBlock({ ...block, reason: e.target.value })} placeholder="السبب (اختياري)" className="h-11 bg-white" /></div><Button onClick={blockDates} disabled={busy} className="mt-3 h-11">حجب الفترة</Button></section></div><section className="mt-6 rounded-2xl border border-border bg-[#fffaf2] p-6"><div className="flex items-center justify-between"><div><span className="eyebrow">آخر الطلبات</span><h2 className="mt-2 text-2xl font-semibold">الحجوزات</h2></div><Home className="text-accent" /></div>{bookings.length === 0 ? <div className="mt-8 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">لا توجد حجوزات حتى الآن.</div> : <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[700px] text-right text-sm"><thead className="text-muted-foreground"><tr><th className="pb-3">المرجع</th><th>الضيف</th><th>الدخول</th><th>الخروج</th><th>الإجمالي</th><th>الحالة</th></tr></thead><tbody>{bookings.map((booking) => <tr key={booking.id} className="border-t border-border"><td className="py-4 font-mono text-xs">{booking.booking_reference}</td><td>{booking.guest_name}</td><td>{booking.check_in}</td><td>{booking.check_out}</td><td>{booking.total_sar} ر.س</td><td>{booking.status}</td></tr>)}</tbody></table></div>}</section></div></main>;
}
