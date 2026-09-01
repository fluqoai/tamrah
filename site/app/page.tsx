import Image from 'next/image';
import Link from 'next/link';
import { BedDouble, CarFront, ChevronLeft, Languages, MapPin, Menu, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingSearch } from '@/components/booking-search';
import { PropertyGallery } from '@/components/property-gallery';
import { SiteFooter } from '@/components/site-footer';
import { WhatsappFloat } from '@/components/whatsapp-float';
import { UnitsShowcase } from '@/components/units-showcase';

const highlights = [
  { icon: BedDouble, value: 'غرفتا نوم', caption: 'سرير مزدوج وسريران منفردان' },
  { icon: Users, value: 'حتى 5 ضيوف', caption: 'مساحة مريحة للعائلة والأصدقاء' },
  { icon: CarFront, value: 'موقف خاص', caption: 'موقف مظلل بجوار السكن' },
  { icon: ShieldCheck, value: 'حجز مؤكد', caption: 'تأكيد فوري وسياسة إلغاء مرنة' },
];

export default function Home() {
  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="relative z-20 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="site-shell flex h-20 items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3" aria-label="تمرة - الرئيسية">
            <span className="brand-mark" aria-hidden="true">ت</span>
            <span><strong className="block text-xl leading-none">تمرة</strong><span className="mt-1 block text-[10px] tracking-[0.08em] text-muted-foreground">TAMRA HOSPITALITY</span></span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm lg:flex" aria-label="التنقل الرئيسي">
            <Link className="font-semibold text-primary" href="#stay">الإقامة</Link><Link className="text-muted-foreground hover:text-foreground" href="#details">عن المكان</Link><Link className="text-muted-foreground hover:text-foreground" href="#policies">السياسات</Link><Link className="text-muted-foreground hover:text-foreground" href="#contact">تواصل معنا</Link>
          </nav>
          <div className="flex items-center gap-2"><Link href="/en" className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium hover:bg-muted" aria-label="Switch to English"><Languages className="size-4" /> EN</Link><details className="group relative lg:hidden"><summary className="flex size-11 cursor-pointer list-none items-center justify-center rounded-full border border-border bg-transparent" aria-label="فتح القائمة"><Menu className="size-5"/></summary><nav className="absolute left-0 top-13 z-50 grid min-w-48 gap-1 rounded-2xl border border-border bg-[#fffaf2] p-2 text-sm shadow-xl"><a className="rounded-xl px-4 py-3 hover:bg-muted" href="#stays">الإقامات</a><a className="rounded-xl px-4 py-3 hover:bg-muted" href="#details">عن المكان</a><a className="rounded-xl px-4 py-3 hover:bg-muted" href="#policies">السياسات</a><a className="rounded-xl px-4 py-3 hover:bg-muted" href="#contact">تواصل معنا</a></nav></details></div>
        </div>
      </header>

      <section id="stay" className="site-shell py-6 sm:py-10">
        <div className="hero-card relative min-h-[620px] overflow-hidden rounded-[2rem] sm:min-h-[680px] lg:min-h-[610px]">
          <Image src="/images/living-window.jpeg" alt="إقامة تمرة في شمال جدة" fill priority sizes="(max-width: 768px) 100vw, 1280px" className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,19,15,.15),rgba(30,19,15,.72))]" /><div className="pattern-overlay absolute inset-0 opacity-20" />
          <div className="relative z-10 grid min-h-[620px] content-between gap-10 p-5 sm:min-h-[680px] sm:p-10 lg:min-h-[610px] lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:p-14">
            <div className="max-w-2xl self-end text-[#fffaf1] lg:self-center">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs backdrop-blur-md"><Sparkles className="size-4 text-[#d6b170]" /> إقامة سعودية بروح دافئة</span>
              <h1 className="text-balance text-4xl font-semibold leading-[1.35] sm:text-6xl lg:text-[4.4rem]">هدوء يشبه البيت،<br />وضيافة من القلب</h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/80 sm:text-lg">شقة عائلية أنيقة في حي الأصيل شمال جدة، بتفاصيل خشبية دافئة ومساحات صُممت لإقامة مريحة لا تُنسى.</p>
            </div>
            <BookingSearch />
          </div>
        </div>
      </section>

      <UnitsShowcase />

      <section id="details" className="site-shell py-14 sm:py-20">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><span className="eyebrow">تفاصيل الإقامة</span><h2 className="mt-3 text-3xl font-semibold sm:text-5xl">كل ما تحتاجه، في مكان واحد</h2></div><div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="size-4 text-accent" /> حي الأصيل، شمال جدة</div></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{highlights.map(({ icon: Icon, value, caption }) => <article key={value} className="feature-card"><span className="feature-icon"><Icon /></span><h3>{value}</h3><p>{caption}</p></article>)}</div>
        <div className="mb-8 mt-16 flex items-end justify-between gap-4"><div><span className="eyebrow">جولة داخل تمرة</span><h2 className="mt-2 text-3xl font-semibold sm:text-4xl">شاهد تفاصيل إقامتك</h2></div><span className="rounded-full border border-border bg-white/40 px-4 py-2 text-xs text-muted-foreground">9 صور</span></div>
        <PropertyGallery />
      </section>

      <section id="policies" className="bg-[#394034] text-[#fffaf1]"><div className="site-shell grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-center"><div><span className="text-xs font-semibold text-[#d6b170]">حجز بطمأنينة</span><h2 className="mt-3 text-3xl font-semibold sm:text-5xl">خطط براحتك، والباقي علينا</h2><p className="mt-5 max-w-2xl leading-8 text-white/70">إلغاء مجاني قبل الوصول بأكثر من 24 ساعة، وتأكيد فوري بمجرد اكتمال الدفع.</p></div><a href="#stays" className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[#b08a52] px-8 text-base font-semibold text-[#251812] hover:bg-[#c39a5d]">ابدأ الحجز <ChevronLeft /></a></div></section>
      <SiteFooter />
      <WhatsappFloat />
    </main>
  );
}
