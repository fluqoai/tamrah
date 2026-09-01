'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Bath, BedDouble, CarFront, LoaderCircle, MapPin, Users } from 'lucide-react';
import { BookingSearch } from '@/components/booking-search';
import { PropertyGallery } from '@/components/property-gallery';
import { SiteFooter } from '@/components/site-footer';
import { WhatsappFloat } from '@/components/whatsapp-float';
import { supabase } from '@/lib/supabase';

type Unit = { id: string; title_ar: string; description_ar: string; base_price_sar: number; max_guests: number; bedrooms: number; bathrooms: number; amenities: string[]; unit_images: { public_url: string; alt_ar: string; alt_en: string; sort_order: number }[]; properties: { district_ar: string; city_ar: string; maps_url: string | null } | null };

export default function StayPage() {
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const slug = decodeURIComponent(window.location.pathname.split('/').filter(Boolean).pop() ?? '');
    supabase.from('units').select('id,title_ar,description_ar,base_price_sar,max_guests,bedrooms,bathrooms,amenities,unit_images(public_url,alt_ar,alt_en,sort_order),properties(district_ar,city_ar,maps_url)').eq('slug', slug).eq('is_published', true).single()
      .then(({ data }) => { setUnit(data as Unit | null); setLoading(false); });
  }, []);
  if (loading) return <main className="grid min-h-screen place-items-center bg-background"><LoaderCircle className="animate-spin text-accent"/></main>;
  if (!unit) return <main dir="rtl" className="grid min-h-screen place-items-center bg-background p-6 text-center"><div><h1 className="text-3xl font-semibold">هذه الإقامة غير متاحة</h1><Link href="/#stays" className="mt-5 inline-flex text-primary underline">العودة إلى الإقامات</Link></div></main>;
  const photos = [...(unit.unit_images ?? [])].sort((a,b)=>a.sort_order-b.sort_order);
  const cover = photos[0]?.public_url ?? '/images/living-window.jpeg';
  return <main dir="rtl" className="min-h-screen bg-background"><header className="border-b border-border bg-[#fffaf2]"><div className="site-shell flex h-20 items-center justify-between"><Link href="/" className="flex items-center gap-3"><span className="brand-mark">ت</span><strong className="text-xl">تمرة</strong></Link><Link href="/#stays" className="flex items-center gap-2 text-sm text-muted-foreground"><ArrowRight className="size-4"/>كل الإقامات</Link></div></header><section className="site-shell py-7 sm:py-10"><div className="relative min-h-[560px] overflow-hidden rounded-[2rem]"><img src={cover} alt={unit.title_ar} className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,19,15,.18),rgba(30,19,15,.78))]"/><div className="relative z-10 grid min-h-[560px] gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_.85fr] lg:items-center lg:p-14"><div className="self-end text-white lg:self-center"><span className="flex items-center gap-2 text-sm text-white/70"><MapPin className="size-4 text-[#d2a867]"/>{unit.properties?.district_ar || unit.properties?.city_ar}</span><h1 className="mt-4 text-4xl font-semibold sm:text-6xl">{unit.title_ar}</h1><p className="mt-5 max-w-xl leading-8 text-white/75">{unit.description_ar}</p><div className="mt-7 flex flex-wrap gap-3 text-xs"><span className="rounded-full border border-white/20 bg-white/10 px-4 py-2"><BedDouble className="ml-2 inline size-4"/>{unit.bedrooms} غرف نوم</span><span className="rounded-full border border-white/20 bg-white/10 px-4 py-2"><Bath className="ml-2 inline size-4"/>{unit.bathrooms} حمامات</span><span className="rounded-full border border-white/20 bg-white/10 px-4 py-2"><Users className="ml-2 inline size-4"/>حتى {unit.max_guests} ضيوف</span><span className="rounded-full border border-white/20 bg-white/10 px-4 py-2"><CarFront className="ml-2 inline size-4"/>موقف خاص</span></div></div><BookingSearch unitId={unit.id} price={unit.base_price_sar} maxGuests={unit.max_guests}/></div></div></section><section className="site-shell py-14"><div className="mb-8"><span className="eyebrow">صور الإقامة</span><h2 className="mt-2 text-3xl font-semibold">جولة داخل الشقة</h2></div><PropertyGallery photos={photos}/></section><SiteFooter/><WhatsappFloat/></main>;
}
