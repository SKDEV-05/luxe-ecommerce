import type { ImgHTMLAttributes } from 'react';
import luxeLogo from '@/assets/luxe_logo.png';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src={luxeLogo}
            alt="Luxe Logo"
            {...props}
        />
    );
}
