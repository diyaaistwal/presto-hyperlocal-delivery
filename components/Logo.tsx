
import React from 'react';

interface LogoProps {
  className?: string;
}

/**
 * Renders the official Prestó logo matching the provided design.
 * Features a yellow scooter with flying delivery items and the brand typography.
 */
export const Logo: React.FC<LogoProps> = ({ className = "w-32 h-32" }) => {
  return (
    <div className={`${className} flex items-center justify-center select-none`} aria-label="Prestó Logo">
      <svg 
        viewBox="0 0 400 400" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Flying Items */}
        {/* Grey Box */}
        <rect x="120" y="85" width="16" height="16" rx="4" fill="#94A3B8" stroke="#1E293B" strokeWidth="4" />
        
        {/* Red Item (Bag/Hat) */}
        <path d="M180 80L220 90L215 115L175 105Z" fill="#EF4444" stroke="#1E293B" strokeWidth="4" strokeLinejoin="round" />
        <path d="M220 90L240 95" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
        
        {/* Envelope */}
        <rect x="225" y="110" width="22" height="16" rx="2" fill="white" stroke="#1E293B" strokeWidth="3" />
        <path d="M225 110L236 118L247 110" stroke="#1E293B" strokeWidth="3" fill="none" />

        {/* Coffee Cup */}
        <path d="M250 95H275L270 120H255Z" fill="#78350F" stroke="#1E293B" strokeWidth="4" />
        <rect x="248" y="90" width="29" height="6" rx="2" fill="#D1D5DB" stroke="#1E293B" strokeWidth="3" />

        {/* Speed Lines */}
        <line x1="230" y1="140" x2="310" y2="140" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
        <line x1="245" y1="155" x2="300" y2="155" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
        <line x1="235" y1="170" x2="315" y2="170" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
        <line x1="250" y1="185" x2="290" y2="185" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />

        {/* Scooter Body */}
        <path 
          d="M165 95C140 95 125 120 125 150C125 180 145 200 170 205H220C240 205 255 190 255 170C255 140 240 120 220 115" 
          stroke="#1E293B" 
          strokeWidth="10" 
          strokeLinecap="round"
        />
        <path 
          d="M165 95C140 95 125 120 125 150C125 180 145 200 170 205H220C240 205 255 190 255 170C255 140 240 120 220 115" 
          fill="#FACC15" 
        />
        
        {/* Handlebars */}
        <path d="M160 95L175 110" stroke="#1E293B" strokeWidth="10" strokeLinecap="round" />
        
        {/* Seat */}
        <rect x="180" y="115" width="55" height="12" rx="6" fill="#475569" stroke="#1E293B" strokeWidth="4" />
        <rect x="185" y="135" width="45" height="10" rx="5" fill="#475569" stroke="#1E293B" strokeWidth="4" />

        {/* Wheels */}
        <circle cx="150" cy="205" r="22" fill="white" stroke="#1E293B" strokeWidth="10" />
        <circle cx="230" cy="205" r="22" fill="white" stroke="#1E293B" strokeWidth="10" />

        {/* PRESTÓ Text */}
        <text 
          x="200" 
          y="280" 
          textAnchor="middle"
          className="font-[Inter] font-black text-[64px] tracking-[0.05em]" 
          fill="#1E293B"
        >
          PRESTÓ
        </text>
        
        {/* Tagline */}
        <text 
          x="200" 
          y="330" 
          textAnchor="middle"
          className="font-[Inter] font-bold text-[24px] uppercase tracking-[0.3em]" 
          fill="#1E293B"
        >
          LIFE, DELIVERED.
        </text>
      </svg>
    </div>
  );
};
