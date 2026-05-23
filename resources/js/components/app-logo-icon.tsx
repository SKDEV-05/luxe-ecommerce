import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
            {/* Elegant Luxury Perfume Bottle */}
            <path d="M42 22h16v6H42zM45 28h10v6H45z" fill="currentColor" />
            <path d="M50 16v6" strokeWidth="3" />
            <path d="M40 34c4-2 6 2 10 0s6-2 10 0c-4 2-6-2-10 0s-6 2-10 0z" fill="currentColor" opacity="0.8" />
            <rect x="25" y="34" width="50" height="50" rx="6" strokeWidth="3.5" />
            <path d="M28 55c8 1 14-2 22-1s14 2 22 1v23c0 3-3 5-5 5H33c-2 0-5-2-5-5V55z" fill="currentColor" opacity="0.15" stroke="none" />
            <rect x="36" y="46" width="28" height="24" rx="2" strokeWidth="1.5" />
            <text x="50" y="60" fontSize="10" fontFamily="serif" fontWeight="bold" textAnchor="middle" fill="currentColor" stroke="none">L P</text>
            <text x="50" y="66" fontSize="4.5" fontFamily="sans-serif" letterSpacing="0.5" textAnchor="middle" fill="currentColor" opacity="0.75" stroke="none">LUXE</text>
        </svg>
    );
}
