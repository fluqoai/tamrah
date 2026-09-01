import Image from 'next/image';

const photos = [
  { src: '/images/living-window.jpeg', ar: 'الصالة بإطلالة هادئة', en: 'Bright living room' },
  { src: '/images/master-bedroom.jpeg', ar: 'غرفة النوم الرئيسية', en: 'Master bedroom' },
  { src: '/images/living-dining.jpeg', ar: 'مساحة المعيشة والطعام', en: 'Living and dining space' },
  { src: '/images/twin-bedroom.jpeg', ar: 'غرفة السريرين', en: 'Twin bedroom' },
  { src: '/images/kitchen.jpeg', ar: 'المطبخ', en: 'Kitchen' },
  { src: '/images/living-room.jpeg', ar: 'غرفة المعيشة', en: 'Living room' },
  { src: '/images/dining.jpeg', ar: 'منطقة الطعام', en: 'Dining area' },
  { src: '/images/master-window.jpeg', ar: 'جلسة غرفة النوم', en: 'Bedroom seating' },
  { src: '/images/living-night.jpeg', ar: 'أجواء المساء', en: 'Evening ambience' },
];

export function PropertyGallery({ locale = 'ar' }: { locale?: 'ar' | 'en' }) {
  return (
    <div className="grid auto-rows-[220px] gap-3 sm:grid-cols-2 sm:auto-rows-[260px] lg:grid-cols-4">
      {photos.map((photo, index) => (
        <figure
          key={photo.src}
          className={`group relative overflow-hidden rounded-[1.4rem] bg-[#ded1bf] shadow-[0_16px_40px_rgba(59,40,32,.1)] ${index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''} ${index === 5 ? 'lg:col-span-2' : ''}`}
        >
          <Image src={photo.src} alt={locale === 'ar' ? photo.ar : photo.en} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-[1.035]" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-5 pb-4 pt-12 text-sm font-semibold text-white opacity-90">
            {locale === 'ar' ? photo.ar : photo.en}
          </div>
        </figure>
      ))}
    </div>
  );
}
