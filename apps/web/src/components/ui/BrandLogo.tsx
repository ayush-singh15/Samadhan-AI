import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  const height = size === 'sm' ? 32 : size === 'lg' ? 52 : 40;

  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 70 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ height: `${height}px`, width: 'auto' }}
      >
        <g transform="translate(4, 4)">
          {/* Citizen Path / Arch 1 (Warm Amber/Saffron) */}
          <path
            d="M4 38 C 12 20, 24 12, 34 26 C 40 34, 46 36, 52 24"
            stroke="#E65100"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="4" cy="38" r="3.5" fill="#E65100" />

          {/* Gov / Admin Base Foundation Arch (Trust Deep Navy) */}
          <path
            d="M12 44 C 24 30, 36 28, 48 44"
            stroke="#0F2942"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="30" cy="18" r="4" fill="#0F2942" />

          {/* University & Industry Innovation Bridge (Civic Teal) */}
          <path
            d="M10 26 C 20 8, 38 8, 48 26 C 54 36, 58 40, 62 44"
            stroke="#0E8388"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="62" cy="44" r="3.5" fill="#0E8388" />

          {/* Central Keystone Node representing Quad-Helix convergence */}
          <circle cx="30" cy="30" r="3.5" fill="#FFFFFF" stroke="#0F2942" strokeWidth="2.5" />
        </g>
      </svg>
    );
  }

  const textColor = variant === 'dark' ? '#FFFFFF' : '#0F2942';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 68 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: `${height}px`, width: 'auto' }}
        className="shrink-0"
      >
        <g transform="translate(2, 4)">
          <path
            d="M4 38 C 12 20, 24 12, 34 26 C 40 34, 46 36, 52 24"
            stroke="#E65100"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="4" cy="38" r="3.5" fill="#E65100" />

          <path
            d="M12 44 C 24 30, 36 28, 48 44"
            stroke={variant === 'dark' ? '#38BDF8' : '#0F2942'}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="30" cy="18" r="4" fill={variant === 'dark' ? '#38BDF8' : '#0F2942'} />

          <path
            d="M10 26 C 20 8, 38 8, 48 26 C 54 36, 58 40, 62 44"
            stroke="#0E8388"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="62" cy="44" r="3.5" fill="#0E8388" />

          <circle cx="30" cy="30" r="3.5" fill="#FFFFFF" stroke="#0F2942" strokeWidth="2.5" />
        </g>
      </svg>

      <div className="flex flex-col justify-center leading-none">
        <span
          className="font-extrabold tracking-tight"
          style={{
            fontSize: size === 'sm' ? '1.15rem' : size === 'lg' ? '1.75rem' : '1.4rem',
            color: textColor,
            fontFamily: "'Plus Jakarta Sans', 'Manrope', sans-serif",
          }}
        >
          Samadhan<span className="text-[#0E8388]">AI</span>
        </span>
        <span
          className="text-[9px] font-bold tracking-wider uppercase mt-0.5"
          style={{ color: variant === 'dark' ? '#94A3B8' : '#64748B' }}
        >
          Civic Innovation Mesh
        </span>
      </div>
    </div>
  );
};
