'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BedDouble, ChevronLeft, LoaderCircle, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type UnitImage = { public_url: string; alt_ar: string; alt_en: string; sort_order: number };
type Unit = { id: string; slug: string; title_ar: string; title_en: string; description_ar: string; description_en: string; base_price_sar: number; max_guests: number; bedrooms: number; unit_images: UnitImage[] };

export function UnitsShowcase({ locale = 'ar' }: { locale?: 'ar' | 'en' }) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('units').select('id,slug,title_ar,title_en,description_ar,description_en,base_price_sar,max_guests,bedrooms,unit_images(public_url,alt_ar,alt_en,sort_order)').eq('is_published', true).order('created_at')
      .then(({ data }) => { setUnits((data as Unit[]) ?? []); setLoading(false); });
  }, []);

  const ar = locale === 'ar';
  return <section id="stays" className="site-shell py-14 sm:py-20"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><span className="eyebrow">{ar?'إقامات تمرة':'TAMRA STAYS'}</span><h2 className="mt-3 text-3xl font-semibold sm:text-5xl">{ar?'اختر الشقة المناسبة لك':'Choose your perfect apartment'}</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">{ar?'كل شقة جديدة ينشرها المالك تظهر هنا تلقائيًا بسعرها وصورها وتفاصيلها الخاصة.':'Every new apartment published by the owner appears here automatically with its own photos, price, and details.'}</p></div><span className="rounded-full border border-border bg-white/45 px-4 py-2 text-xs text-muted-foreground">{units.length} {ar?(units.length===1?'شقة متاحة':'شقق متاحة'):(units.length===1?'stay':'stays')}</span></div>{loading ? <div className="grid min-h-52 place-items-center"><LoaderCircle className="animate-spin text-accent"/></div> : units.length === 0 ? <div className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">{ar?'لا توجد وحدات منشورة حاليًا.':'No published stays are available.'}</div> : <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{units.map((unit) => { const image = [...(unit.unit_images ?? [])].sort((a,b)=>a.sort_order-b.sort_order)[0]; const src = image?.public_url ?? '/images/living-window.jpeg'; const title=ar?unit.title_ar:unit.title_en; return <article key={unit.id} className="group overflow-hidden rounded-[1.6rem] border border-border bg-[#fffaf2] shadow-[0_16px_45px_rgba(59,40,32,.08)]"><Link href={`/stays/${unit.slug}${ar?'':'?lang=en'}`} className="relative block h-64 overflow-hidden bg-[#ded1bf]"><img src={src} alt={(ar?image?.alt_ar:image?.alt_en)||title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/><span className={`absolute bottom-4 ${ar?'right-4':'left-4'} rounded-full bg-[#fffaf2]/95 px-4 py-2 text-sm font-bold text-primary shadow`}>{ar?`${unit.base_price_sar} ر.س / ليلة`:`SAR ${unit.base_price_sar} / night`}</span></Link><div className="p-5"><h3 className="text-xl font-semibold">{title}</h3><p className="mt-2 line-clamp-2 text-xs leading-6 text-muted-foreground">{ar?unit.description_ar:unit.description_en}</p><div className="mt-4 flex gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><BedDouble className="size-4 text-accent"/>{unit.bedrooms} {ar?'غرف':'bedrooms'}</span><span className="flex items-center gap-1.5"><Users className="size-4 text-accent"/>{ar?'حتى ':''}{unit.max_guests} {ar?'ضيوف':'guests'}</span></div><Link href={`/stays/${unit.slug}${ar?'':'?lang=en'}`} className="mt-5 inline-flex items-center gap-1 font-semibold text-primary">{ar?'التفاصيل والحجز':'Details & booking'} <ChevronLeft className="size-4"/></Link></div></article>})}</div>}</section>;
}
