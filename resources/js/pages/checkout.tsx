import { Head, Link, useForm } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/storefront-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowLeft, MapPin, Compass } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import ProductImage from '@/components/product-image';

interface CartItem {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        sku: string;
        price: string;
        sale_price: string | null;
        image_url: string | null;
        volume: string | null;
        brand: {
            name: string;
        } | null;
    };
    total: number;
}

interface CartSummary {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    delete_tva?: boolean;
}

interface UserInfo {
    name: string;
    email: string;
    phone: string;
    address: {
        address_line_1: string;
        address_line_2: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
    };
}

interface Props {
    items: CartItem[];
    summary: CartSummary;
    user_info: UserInfo;
}

export default function CheckoutPage({ items, summary, user_info }: Props) {
    const formatCurrency = (value: number) => {
        return `${value.toFixed(2)} MAD`;
    };

    const { data, setData, post, processing, errors } = useForm({
        phone: user_info.phone || '',
        shipping_address_line_1: user_info.address.address_line_1 || '',
        shipping_address_line_2: user_info.address.address_line_2 || '',
        shipping_city: user_info.address.city || '',
        shipping_state: user_info.address.state || '',
        shipping_postal_code: user_info.address.postal_code || '',
        shipping_country: user_info.address.country || 'Morocco',
        
        same_as_shipping: true,
        
        billing_address_line_1: '',
        billing_address_line_2: '',
        billing_city: '',
        billing_state: '',
        billing_postal_code: '',
        billing_country: 'Morocco',
        
        payment_method: 'cod',
        notes: '',
        save_address: true,
    });

    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        // Load CSS dynamically for Leaflet
        if (!document.getElementById('leaflet-css')) {
            const link = document.createElement('link');
            link.id = 'leaflet-css';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }

        // Load JS dynamically for Leaflet
        if (!(window as any).L) {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.async = true;
            script.onload = () => {
                setMapLoaded(true);
            };
            document.body.appendChild(script);
        } else {
            setMapLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (!mapLoaded) return;
        
        const L = (window as any).L;
        if (!L) return;

        const mapContainer = document.getElementById('checkout-map');
        if (!mapContainer) return;

        if ((mapContainer as any)._leaflet_id) {
            return;
        }

        // Default coordinates: Center on Morocco (31.7917, -7.0926)
        const initialLat = 31.7917;
        const initialLng = -7.0926;
        const initialZoom = 6;

        // Fix Leaflet default marker icon paths in Vite bundling
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        const map = L.map('checkout-map').setView([initialLat, initialLng], initialZoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);

        const updateLocation = (lat: number, lng: number) => {
            marker.setLatLng([lat, lng]);
            map.panTo([lat, lng]);
            
            // Reverse Geocode using OpenStreetMap Nominatim
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.address) {
                        const addr = data.address;
                        const road = addr.road || addr.suburb || addr.neighbourhood || '';
                        const houseNumber = addr.house_number || '';
                        const line1 = `${houseNumber} ${road}`.trim() || data.display_name.split(',')[0] || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
                        const city = addr.city || addr.town || addr.village || addr.county || '';
                        const state = addr.state || addr.region || '';
                        const postcode = addr.postcode || '';
                        const country = addr.country || 'Morocco';

                        setData(prev => ({
                            ...prev,
                            shipping_address_line_1: line1,
                            shipping_city: city,
                            shipping_state: state,
                            shipping_postal_code: postcode,
                            shipping_country: country
                        }));
                    }
                })
                .catch(err => console.error(err));
        };

        marker.on('dragend', () => {
            const position = marker.getLatLng();
            updateLocation(position.lat, position.lng);
        });

        map.on('click', (e: any) => {
            updateLocation(e.latlng.lat, e.latlng.lng);
        });

        (window as any).checkoutMap = map;
        (window as any).checkoutMarker = marker;

    }, [mapLoaded]);

    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const L = (window as any).L;
                const map = (window as any).checkoutMap;
                const marker = (window as any).checkoutMarker;

                if (L && map && marker) {
                    marker.setLatLng([latitude, longitude]);
                    map.setView([latitude, longitude], 15);
                    
                    // Reverse geocode
                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                        .then(res => res.json())
                        .then(data => {
                            if (data && data.address) {
                                const addr = data.address;
                                const road = addr.road || addr.suburb || addr.neighbourhood || '';
                                const houseNumber = addr.house_number || '';
                                const line1 = `${houseNumber} ${road}`.trim() || data.display_name.split(',')[0];
                                const city = addr.city || addr.town || addr.village || addr.county || '';
                                const state = addr.state || addr.region || '';
                                const postcode = addr.postcode || '';
                                const country = addr.country || 'Morocco';

                                setData(prev => ({
                                    ...prev,
                                    shipping_address_line_1: line1,
                                    shipping_city: city,
                                    shipping_state: state,
                                    shipping_postal_code: postcode,
                                    shipping_country: country
                                }));
                            }
                        })
                        .catch(err => console.error(err));
                }
            },
            () => {
                toast.error("Could not obtain location automatically. Please select it manually on the map.");
            }
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/checkout');
    };

    return (
        <StorefrontLayout>
            <Head title="Secure Checkout - Luxe Parfum" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-8">
                    <Link href="/cart" className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-neutral-450 hover:text-amber-600 transition-colors font-mono">
                        <ArrowLeft className="h-3 w-3" /> Return to Cart
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Checkout Details Form */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="border-b border-stone-200 dark:border-neutral-900 pb-4">
                            <h1 className="text-3xl font-serif font-bold tracking-tight uppercase text-neutral-900 dark:text-stone-100">
                                Checkout
                            </h1>
                            <p className="text-xs text-neutral-500 font-mono mt-1">Please provide your delivery and billing details below.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8 text-sm">
                            {/* Contact Info */}
                            <div className="space-y-4">
                                <h3 className="font-serif font-bold text-lg border-b border-stone-100 dark:border-neutral-900 pb-2 text-amber-705">
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="name" className="text-xs font-mono uppercase text-stone-500">Full Name</Label>
                                        <Input id="name" value={user_info.name} disabled className="bg-stone-100/50 dark:bg-neutral-900/50" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="email" className="text-xs font-mono uppercase text-stone-500">Email Address</Label>
                                        <Input id="email" value={user_info.email} disabled className="bg-stone-100/50 dark:bg-neutral-900/50" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="phone" className="text-xs font-mono uppercase text-stone-500">Phone Number *</Label>
                                    <Input 
                                        id="phone" 
                                        value={data.phone} 
                                        onChange={(e) => setData('phone', e.target.value)} 
                                        placeholder="+1 (555) 019-2834"
                                        required 
                                        className={errors.phone ? 'border-red-500 focus:ring-red-500' : ''}
                                    />
                                    {errors.phone && <p className="text-xs text-red-550 mt-1 font-mono">{errors.phone}</p>}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="space-y-4">
                                <h3 className="font-serif font-bold text-lg border-b border-stone-100 dark:border-neutral-900 pb-2 text-amber-705">
                                    Shipping Address
                                </h3>

                                {/* Pinpoint Map Section */}
                                <div className="space-y-2 border border-stone-200 dark:border-neutral-900 p-4 bg-stone-50/50 dark:bg-neutral-900/10">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div>
                                            <Label className="text-xs font-mono uppercase text-stone-500 flex items-center gap-1.5">
                                                <MapPin className="h-3.5 w-3.5 text-amber-600" /> Pinpoint Shipping Location
                                            </Label>
                                            <span className="text-[11px] text-neutral-450">Click on the map or drag the marker to auto-populate your address.</span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleLocateMe}
                                            className="text-xs font-serif border-stone-300 flex items-center gap-1 bg-white dark:bg-neutral-900 hover:bg-stone-50"
                                        >
                                            <Compass className="h-3.5 w-3.5" /> Locate Me
                                        </Button>
                                    </div>
                                    
                                    <div 
                                        id="checkout-map" 
                                        className="h-64 w-full bg-stone-100 dark:bg-neutral-900 border border-stone-200 dark:border-neutral-850 mt-2 rounded-md overflow-hidden relative z-10"
                                        style={{ minHeight: '250px' }}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="shipping_address_line_1" className="text-xs font-mono uppercase text-stone-500">Address Line 1 *</Label>
                                    <Input 
                                        id="shipping_address_line_1" 
                                        value={data.shipping_address_line_1} 
                                        onChange={(e) => setData('shipping_address_line_1', e.target.value)} 
                                        placeholder="123 Luxury Ave, Suite 10"
                                        required 
                                        className={errors.shipping_address_line_1 ? 'border-red-500 focus:ring-red-500' : ''}
                                    />
                                    {errors.shipping_address_line_1 && <p className="text-xs text-red-550 mt-1 font-mono">{errors.shipping_address_line_1}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="shipping_address_line_2" className="text-xs font-mono uppercase text-stone-500">Address Line 2 (Optional)</Label>
                                    <Input 
                                        id="shipping_address_line_2" 
                                        value={data.shipping_address_line_2} 
                                        onChange={(e) => setData('shipping_address_line_2', e.target.value)} 
                                        placeholder="Apt, Suite, Unit, etc."
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="shipping_city" className="text-xs font-mono uppercase text-stone-500">City *</Label>
                                        <Input 
                                            id="shipping_city" 
                                            value={data.shipping_city} 
                                            onChange={(e) => setData('shipping_city', e.target.value)} 
                                            placeholder="Beverly Hills"
                                            required 
                                            className={errors.shipping_city ? 'border-red-500 focus:ring-red-550' : ''}
                                        />
                                        {errors.shipping_city && <p className="text-xs text-red-550 mt-1 font-mono">{errors.shipping_city}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="shipping_state" className="text-xs font-mono uppercase text-stone-500">State / Region *</Label>
                                        <Input 
                                            id="shipping_state" 
                                            value={data.shipping_state} 
                                            onChange={(e) => setData('shipping_state', e.target.value)} 
                                            placeholder="California"
                                            required 
                                            className={errors.shipping_state ? 'border-red-500 focus:ring-red-550' : ''}
                                        />
                                        {errors.shipping_state && <p className="text-xs text-red-550 mt-1 font-mono">{errors.shipping_state}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="shipping_postal_code" className="text-xs font-mono uppercase text-stone-500">Postal Code *</Label>
                                        <Input 
                                            id="shipping_postal_code" 
                                            value={data.shipping_postal_code} 
                                            onChange={(e) => setData('shipping_postal_code', e.target.value)} 
                                            placeholder="90210"
                                            required 
                                            className={errors.shipping_postal_code ? 'border-red-500 focus:ring-red-550' : ''}
                                        />
                                        {errors.shipping_postal_code && <p className="text-xs text-red-550 mt-1 font-mono">{errors.shipping_postal_code}</p>}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="shipping_country" className="text-xs font-mono uppercase text-stone-500">Country *</Label>
                                    <Input 
                                        id="shipping_country" 
                                        value={data.shipping_country} 
                                        onChange={(e) => setData('shipping_country', e.target.value)} 
                                        placeholder="United States"
                                        required 
                                    />
                                    {errors.shipping_country && <p className="text-xs text-red-550 mt-1 font-mono">{errors.shipping_country}</p>}
                                </div>
                            </div>

                            {/* Same as shipping billing option */}
                            <div className="flex items-center space-x-2 border border-stone-200 dark:border-neutral-900 p-4 bg-stone-50 dark:bg-neutral-900/20">
                                <Checkbox 
                                    id="same_as_shipping" 
                                    checked={data.same_as_shipping} 
                                    onCheckedChange={(checked) => setData('same_as_shipping', !!checked)}
                                />
                                <Label htmlFor="same_as_shipping" className="font-medium cursor-pointer text-xs">
                                    My billing address is the same as my shipping address
                                </Label>
                            </div>

                            {/* Billing Address (if same_as_shipping is false) */}
                            {!data.same_as_shipping && (
                                <div className="space-y-4 pt-4 border-t border-stone-100 dark:border-neutral-900">
                                    <h3 className="font-serif font-bold text-lg pb-2 text-amber-705">
                                        Billing Address
                                    </h3>
                                    <div className="space-y-1">
                                        <Label htmlFor="billing_address_line_1" className="text-xs font-mono uppercase text-stone-500">Address Line 1 *</Label>
                                        <Input 
                                            id="billing_address_line_1" 
                                            value={data.billing_address_line_1} 
                                            onChange={(e) => setData('billing_address_line_1', e.target.value)} 
                                            placeholder="456 Financial Rd"
                                            required={!data.same_as_shipping}
                                        />
                                        {errors.billing_address_line_1 && <p className="text-xs text-red-550 mt-1 font-mono">{errors.billing_address_line_1}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="billing_address_line_2" className="text-xs font-mono uppercase text-stone-500">Address Line 2 (Optional)</Label>
                                        <Input 
                                            id="billing_address_line_2" 
                                            value={data.billing_address_line_2} 
                                            onChange={(e) => setData('billing_address_line_2', e.target.value)} 
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <Label htmlFor="billing_city" className="text-xs font-mono uppercase text-stone-500">City *</Label>
                                            <Input 
                                                id="billing_city" 
                                                value={data.billing_city} 
                                                onChange={(e) => setData('billing_city', e.target.value)} 
                                                required={!data.same_as_shipping}
                                            />
                                            {errors.billing_city && <p className="text-xs text-red-550 mt-1 font-mono">{errors.billing_city}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="billing_state" className="text-xs font-mono uppercase text-stone-500">State / Region *</Label>
                                            <Input 
                                                id="billing_state" 
                                                value={data.billing_state} 
                                                onChange={(e) => setData('billing_state', e.target.value)} 
                                                required={!data.same_as_shipping}
                                            />
                                            {errors.billing_state && <p className="text-xs text-red-550 mt-1 font-mono">{errors.billing_state}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="billing_postal_code" className="text-xs font-mono uppercase text-stone-500">Postal Code *</Label>
                                            <Input 
                                                id="billing_postal_code" 
                                                value={data.billing_postal_code} 
                                                onChange={(e) => setData('billing_postal_code', e.target.value)} 
                                                required={!data.same_as_shipping}
                                            />
                                            {errors.billing_postal_code && <p className="text-xs text-red-550 mt-1 font-mono">{errors.billing_postal_code}</p>}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="billing_country" className="text-xs font-mono uppercase text-stone-500">Country *</Label>
                                        <Input 
                                            id="billing_country" 
                                            value={data.billing_country} 
                                            onChange={(e) => setData('billing_country', e.target.value)} 
                                            required={!data.same_as_shipping}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Cash on Delivery Payment */}
                            <div className="space-y-4">
                                <h3 className="font-serif font-bold text-lg border-b border-stone-100 dark:border-neutral-900 pb-2 text-amber-705">
                                    Payment Method
                                </h3>
                                <div className="p-4 border border-amber-600/25 bg-amber-500/5 rounded-none flex items-start gap-3">
                                    <input 
                                        type="radio" 
                                        id="cod" 
                                        name="payment_method" 
                                        checked={data.payment_method === 'cod'} 
                                        onChange={() => setData('payment_method', 'cod')}
                                        className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-300"
                                    />
                                    <div>
                                        <Label htmlFor="cod" className="font-serif font-bold text-sm text-neutral-800 dark:text-stone-200 cursor-pointer block">
                                            Cash on Delivery (COD)
                                        </Label>
                                        <span className="text-xs text-neutral-500 mt-1 block leading-relaxed">
                                            Pay with cash upon delivery. Please ensure you have the exact amount ready in Moroccan Dirhams (MAD) when your package is delivered to your pinpointed location.
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-1">
                                <Label htmlFor="notes" className="text-xs font-mono uppercase text-stone-500">Order Notes (Optional)</Label>
                                <Textarea 
                                    id="notes" 
                                    value={data.notes} 
                                    onChange={(e) => setData('notes', e.target.value)} 
                                    placeholder="Notes about your order, e.g. special delivery instructions." 
                                    className="min-h-24"
                                />
                            </div>

                            {/* Save Address preference */}
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="save_address" 
                                    checked={data.save_address} 
                                    onCheckedChange={(checked) => setData('save_address', !!checked)}
                                />
                                <Label htmlFor="save_address" className="font-medium cursor-pointer text-xs">
                                    Save this address to my profile settings
                                </Label>
                            </div>

                            {/* Error notification */}
                            {errors && Object.keys(errors).length > 0 && (
                                <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-none text-xs font-mono space-y-1">
                                    <p className="font-bold uppercase">Please fix the following validation errors:</p>
                                    <ul className="list-disc pl-4 space-y-0.5">
                                        {Object.values(errors).map((err, idx) => (
                                            <li key={idx}>{err}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Submit Order */}
                            <div className="pt-4">
                                <Button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="w-full bg-amber-600 hover:bg-amber-700 text-stone-100 py-6 rounded-none tracking-widest uppercase font-semibold text-xs flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" /> Processing Order...
                                        </>
                                    ) : (
                                        `Place Cash on Delivery Order (${formatCurrency(summary.total)})`
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-5">
                        <Card className="border-stone-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 rounded-none p-6 space-y-6 sticky top-28">
                            <h3 className="font-serif font-bold text-lg tracking-wide border-b border-stone-100 dark:border-neutral-900 pb-3 uppercase text-neutral-850 dark:text-stone-250">
                                Order Summary
                            </h3>

                            {/* Products List */}
                            <div className="divide-y divide-stone-100 dark:divide-neutral-900 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
                                {items.map((item) => {
                                    const price = item.product.sale_price ? parseFloat(item.product.sale_price) : parseFloat(item.product.price);
                                    return (
                                        <div key={item.id} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                                            <div className="h-16 w-12 shrink-0 bg-stone-100 dark:bg-neutral-900 border border-stone-150 dark:border-neutral-850 overflow-hidden relative">
                                                <ProductImage
                                                    src={item.product.image_url}
                                                    alt={item.product.name}
                                                    brandName={item.product.brand?.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-grow min-w-0 space-y-0.5">
                                                <h4 className="font-serif text-xs font-semibold text-neutral-800 dark:text-stone-200 truncate">{item.product.name}</h4>
                                                <p className="text-[10px] text-neutral-400 truncate">{item.product.brand?.name} &bull; {item.product.volume}</p>
                                                <p className="text-xs text-neutral-500 font-mono font-semibold">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="shrink-0 text-right font-mono text-xs font-bold text-neutral-850 dark:text-stone-200">
                                                {formatCurrency(item.total)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Financial totals */}
                            <div className="space-y-3 text-xs border-t border-stone-150 dark:border-neutral-900 pt-4">
                                <div className="flex justify-between text-neutral-600 dark:text-stone-300">
                                    <span>Subtotal</span>
                                    <span className="font-mono">{formatCurrency(summary.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-neutral-600 dark:text-stone-300">
                                    <span>Estimated Shipping</span>
                                    <span className="font-mono">{summary.shipping === 0 ? 'Complimentary' : formatCurrency(summary.shipping)}</span>
                                </div>
                                {!summary.delete_tva && summary.tax > 0 && (
                                    <div className="flex justify-between text-neutral-600 dark:text-stone-300">
                                        <span>Sales Tax (8%)</span>
                                        <span className="font-mono">{formatCurrency(summary.tax)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-sm border-t border-stone-100 dark:border-neutral-900 pt-4 text-neutral-850 dark:text-stone-100">
                                    <span>Order Total</span>
                                    <span className="font-mono text-amber-705 dark:text-amber-500">{formatCurrency(summary.total)}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
