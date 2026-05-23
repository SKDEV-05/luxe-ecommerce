import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-amber-600 text-white">
                <AppLogoIcon className="size-5 text-white" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-serif font-bold uppercase tracking-wider text-neutral-800 dark:text-stone-200">
                    Luxe Parfum
                </span>
                <span className="truncate text-[9px] font-mono uppercase tracking-widest text-neutral-450">
                    E-Commerce
                </span>
            </div>
        </>
    );
}
