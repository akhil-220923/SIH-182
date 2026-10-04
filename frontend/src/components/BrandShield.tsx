import React from 'react';

interface BrandShieldProps {
  className?: string;
  glow?: boolean;
}

export const BrandShield: React.FC<BrandShieldProps> = ({ className = 'w-6 h-6', glow = false }) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${glow ? 'group' : ''}`}>
      {glow && (
        <div className="absolute inset-0 bg-[#0052FF]/30 blur-lg rounded-full group-hover:bg-[#0052FF]/50 transition-all pointer-events-none" />
      )}
      <svg
        viewBox="0 0 156 184"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} relative z-10 transition-transform`}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M156.282 104.257C156.282 146.692 78.3938 183.634 78.3938 183.634C78.3938 183.634 0.50478 146.692 0.50478 104.257C0.50478 93.2381 0.509268 83.5104 0.513558 74.2098C0.522088 55.7192 0.52984 38.9167 0.5 17.0094C49.9579 -5.62206 106.836 -5.59857 156.282 17.0588V104.257ZM72.3134 30.3623H62.2633V40.3298H52.2132V123.406H62.2633V133.376H72.3134V123.406H82.3636V133.376H92.4137V122.448C105.183 119.755 112.514 111.51 112.514 99.2681C112.514 90.7144 106.987 82.981 97.5309 80.5203C105.882 78.0597 110.672 70.9121 110.672 62.9443C110.672 51.6072 103.818 43.6576 92.4137 41.1626V30.3623H82.3636V40.3298H72.3134V30.3623ZM81.1969 53.3361C89.6709 53.3361 94.5834 57.2028 94.5834 63.7645C94.5834 70.3262 89.9165 74.193 82.0565 74.193H67.9332V53.3361H81.1969ZM82.1794 86.8477C91.6359 86.8477 96.4256 90.7144 96.4256 98.4479C96.4256 105.478 90.6534 109.814 81.3197 109.814H67.9332V86.8477H82.1794Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};


