import Image from 'next/image';
import Link from 'next/link';
import { BedDouble, CarFront, ChevronLeft, Languages, MapPin, Menu, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingSearch } from '@/components/booking-search';

const highlights = [
  { icon: BedDouble, value: 'غرفتا نوم', caption: 'سرير مزدوج وسريران منفردان' },
  { icon: Users, value: 'حتى 5 ضيوف', caption: 'مساحة مريحة للعائلة والأصدقاء' },
  { icon: CarFront, value: 'موقف خاص', caption: 'موقف مظلل بجوار السكن' },
  { icon: ShieldCheck, value: 'حجز مؤكد', caption: 'تأكيد فوري وسياسة إلغاء مرنة' },
];

const gallery = [
  { src: '/images/living-window.jpeg', alt: 'غرفة المعيشة في شقة تمرة' },
  { src: '/images/master-window.jpeg', alt: 'غرفة النوم الرئيسية' },
  { src: '/images/dining.jpeg', alt: 'منطقة الطعام' },
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
          <div className="flex items-center gap-2"><Button variant="ghost" className="h-10 rounded-full px-3" aria-label="Switch to English"><Languages /> EN</Button><Button variant="outline" size="icon-lg" className="rounded-full lg:hidden" aria-label="فتح القائمة"><Menu /></Button></div>
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

      <section id="details" className="site-shell py-14 sm:py-20">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><span className="eyebrow">تفاصيل الإقامة</span><h2 className="mt-3 text-3xl font-semibold sm:text-5xl">كل ما تحتاجه، في مكان واحد</h2></div><div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="size-4 text-accent" /> حي الأصيل، شمال جدة</div></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{highlights.map(({ icon: Icon, value, caption }) => <article key={value} className="feature-card"><span className="feature-icon"><Icon /></span><h3>{value}</h3><p>{caption}</p></article>)}</div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">{gallery.map((image, index) => <figure key={image.src} className={`gallery-card ${index === 0 ? 'md:translate-y-8' : ''}`}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 hover:scale-105" /></figure>)}</div>
      </section>

      <section id="policies" className="bg-[#394034] text-[#fffaf1]"><div className="site-shell grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-center"><div><span className="text-xs font-semibold text-[#d6b170]">حجز بطمأنينة</span><h2 className="mt-3 text-3xl font-semibold sm:text-5xl">خطط براحتك، والباقي علينا</h2><p className="mt-5 max-w-2xl leading-8 text-white/70">إلغاء مجاني قبل الوصول بأكثر من 24 ساعة، وتأكيد فوري بمجرد اكتمال الدفع.</p></div><Button className="h-13 rounded-full bg-[#b08a52] px-8 text-base text-[#251812] hover:bg-[#c39a5d]">ابدأ الحجز <ChevronLeft /></Button></div></section>
      <footer id="contact" className="bg-[#261a16] text-white/75"><div className="site-shell flex flex-col justify-between gap-8 py-10 sm:flex-row sm:items-center"><div><strong className="text-xl text-white">تمرة</strong><p className="mt-2 text-sm">ضيافتنا... من القلب</p></div><div className="flex flex-wrap gap-5 text-sm"><a href="https://wa.me/966559386212">واتساب 0559386212</a><a href="mailto:fahad999792@gmail.com">fahad999792@gmail.com</a></div></div></footer>
    </main>
  );
}
