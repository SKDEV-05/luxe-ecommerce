import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Settings, Percent, Truck, Info, Save } from 'lucide-react';

interface StoreSettings {
    id: number;
    delete_tva: boolean;
    delivery_free: boolean;
    delivery_fee: string;
    delivery_free_threshold: string;
}

interface Props {
    settings: StoreSettings;
}

export default function SettingsPage({ settings }: Props) {
    const breadcrumbs = [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Store Settings', href: '/admin/settings' },
    ];

    const { data, setData, put, processing, errors } = useForm({
        delete_tva: settings.delete_tva,
        delivery_free: settings.delivery_free,
        delivery_fee: parseFloat(settings.delivery_fee),
        delivery_free_threshold: parseFloat(settings.delivery_free_threshold),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/settings', {
            onSuccess: () => {
                toast.success('Store settings updated successfully');
            },
            onError: () => {
                toast.error('Failed to update store settings');
            }
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Store Settings - Admin" />

            <div className="space-y-6 max-w-4xl mx-auto">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
                        <Settings className="h-8 w-8 text-amber-600 dark:text-amber-500" />
                        Store Settings
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                        Configure business rules, tax calculations (TVA), and global shipping costs.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Tax Settings */}
                    <Card className="border-neutral-150 dark:border-neutral-800 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-serif font-bold flex items-center gap-2 text-neutral-800 dark:text-stone-200">
                                <Percent className="h-5 w-5 text-amber-650" />
                                Value-Added Tax (TVA) Settings
                            </CardTitle>
                            <CardDescription>
                                Manage how sales tax is calculated and displayed on checkout.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start space-x-3 p-4 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-850">
                                <Checkbox 
                                    id="delete_tva" 
                                    checked={data.delete_tva}
                                    onCheckedChange={(checked) => setData('delete_tva', !!checked)}
                                    className="mt-1"
                                />
                                <div className="space-y-1">
                                    <Label htmlFor="delete_tva" className="font-semibold text-sm cursor-pointer text-neutral-800 dark:text-stone-200 block">
                                        Delete TVA (VAT) Completely
                                    </Label>
                                    <span className="text-xs text-neutral-500 leading-relaxed block">
                                        When checked, tax is set to 0.00 MAD, and the "Sales Tax" line is completely hidden from the shopping cart summaries, invoice calculations, and order receipts.
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping & Delivery Settings */}
                    <Card className="border-neutral-150 dark:border-neutral-800 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-serif font-bold flex items-center gap-2 text-neutral-800 dark:text-stone-200">
                                <Truck className="h-5 w-5 text-amber-650" />
                                Shipping & Delivery Fees
                            </CardTitle>
                            <CardDescription>
                                Set flat delivery fees, offer conditional free shipping, or make shipping globally free.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-start space-x-3 p-4 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-850">
                                <Checkbox 
                                    id="delivery_free" 
                                    checked={data.delivery_free}
                                    onCheckedChange={(checked) => setData('delivery_free', !!checked)}
                                    className="mt-1"
                                />
                                <div className="space-y-1">
                                    <Label htmlFor="delivery_free" className="font-semibold text-sm cursor-pointer text-neutral-800 dark:text-stone-200 block">
                                        Make Delivery Always Free
                                    </Label>
                                    <span className="text-xs text-neutral-500 leading-relaxed block">
                                        When checked, delivery is 100% free (0.00 MAD) for all customer orders, regardless of the order total.
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                                <div className={`space-y-2 transition-opacity duration-200 ${data.delivery_free ? 'opacity-40 pointer-events-none' : ''}`}>
                                    <Label htmlFor="delivery_fee" className="text-xs font-mono uppercase text-neutral-500 dark:text-neutral-400">
                                        Standard Delivery Fee (MAD)
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="delivery_fee"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.delivery_fee}
                                            onChange={(e) => setData('delivery_fee', parseFloat(e.target.value) || 0)}
                                            disabled={data.delivery_free}
                                            required={!data.delivery_free}
                                            className="font-mono text-sm"
                                        />
                                        <span className="absolute right-3 top-2.5 text-xs text-neutral-450 font-mono">MAD</span>
                                    </div>
                                    <p className="text-[11px] text-neutral-450">Charged to orders that do not qualify for free shipping.</p>
                                    {errors.delivery_fee && <p className="text-xs text-red-550 mt-1 font-mono">{errors.delivery_fee}</p>}
                                </div>

                                <div className={`space-y-2 transition-opacity duration-200 ${data.delivery_free ? 'opacity-40 pointer-events-none' : ''}`}>
                                    <Label htmlFor="delivery_free_threshold" className="text-xs font-mono uppercase text-neutral-500 dark:text-neutral-400">
                                        Free Delivery Threshold (MAD)
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="delivery_free_threshold"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.delivery_free_threshold}
                                            onChange={(e) => setData('delivery_free_threshold', parseFloat(e.target.value) || 0)}
                                            disabled={data.delivery_free}
                                            required={!data.delivery_free}
                                            className="font-mono text-sm"
                                        />
                                        <span className="absolute right-3 top-2.5 text-xs text-neutral-450 font-mono">MAD</span>
                                    </div>
                                    <p className="text-[11px] text-neutral-450">Orders with a subtotal equal to or above this amount get free shipping.</p>
                                    {errors.delivery_free_threshold && <p className="text-xs text-red-550 mt-1 font-mono">{errors.delivery_free_threshold}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Information Note */}
                    <div className="flex gap-2.5 items-start bg-amber-50/50 dark:bg-amber-950/10 border border-amber-500/20 p-4 text-neutral-650 dark:text-neutral-350 text-xs rounded-none">
                        <Info className="h-4 w-4 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <span className="font-semibold block text-neutral-800 dark:text-stone-200">Production Impact Note</span>
                            <p className="leading-relaxed">
                                Settings changes take effect immediately on all new shopping carts and checkouts. Active orders that have already been created will retain the billing amounts and settings calculated at their time of placement.
                            </p>
                        </div>
                    </div>

                    {/* Save Action */}
                    <div className="flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-850 pt-6">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-amber-600 hover:bg-amber-700 text-stone-100 px-6 py-6 rounded-none tracking-widest uppercase font-semibold text-xs flex items-center gap-2"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Saving Settings...' : 'Save Settings'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
