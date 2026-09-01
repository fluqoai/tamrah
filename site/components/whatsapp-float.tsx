import { MessageCircle } from 'lucide-react';

export function WhatsappFloat({ locale = 'ar' }: { locale?: 'ar' | 'en' }) {
  const message = locale === 'ar' ? 'مرحبًا، أود الاستفسار عن شقة تمرة في جدة.' : 'Hello, I would like to ask about Tamra apartment in Jeddah.';
  return (
    <a
      href={`https://wa.me/966559386212?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noreferrer"
      aria-label={locale === 'ar' ? 'تواصل معنا عبر واتساب' : 'Contact us on WhatsApp'}
      className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full border border-white/30 bg-[#1f9d55] p-3.5 text-white shadow-[0_14px_35px_rgba(16,80,45,.38)] transition hover:-translate-y-1 hover:bg-[#168447] sm:px-5"
    >
      <MessageCircle className="size-5" />
      <span className="hidden text-sm font-semibold sm:inline">{locale === 'ar' ? 'تواصل عبر واتساب' : 'WhatsApp us'}</span>
    </a>
  );
}
