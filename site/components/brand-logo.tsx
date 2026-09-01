import Image from 'next/image';

export function BrandLogo({ size = 46, className = '' }: { size?: number; className?: string }) {
  return <Image src="/images/tamra-logo.png" alt="شعار تمرة للضيافة" width={size} height={size} priority className={`shrink-0 rounded-full object-cover shadow-[0_4px_16px_rgba(59,40,32,.22)] ${className}`} />;
}
