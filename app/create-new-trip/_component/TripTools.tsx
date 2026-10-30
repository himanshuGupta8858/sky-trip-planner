"use client";
import { Check, Download, Luggage, Share2, Shirt, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TripInfo } from "./chatbox";

const PackingList = ({ trip }: { trip: TripInfo | undefined }) => {

    // Simple logic to generate "Smart" items based on destination
    const generateList = () => {
        const dest = trip?.destination?.toLowerCase() || "";
        const desc = trip?.itinerary?.[0]?.day_plan?.toLowerCase() || ""; // Check first day for clues

        const essentials = [
            { name: "Passport / ID", checked: false },
            { name: "Wallet & Cash", checked: false },
            { name: "Medications", checked: false },
            { name: "Toiletries Kit", checked: false },
        ];

        const clothing = [
            { name: "Underwear & Socks", checked: false },
            { name: "Comfortable Shoes", checked: false },
            { name: "Sleepwear", checked: false },
        ];

        const gadgets = [
            { name: "Phone Charger", checked: false },
            { name: "Power Bank", checked: false },
            { name: "Headphones", checked: false },
            { name: "Universal Adapter", checked: false },
        ];

        // "Smart" additions
        if (dest.includes("beach") || dest.includes("sea") || dest.includes("ocean") || dest.includes("island") || desc.includes("beach")) {
            clothing.push({ name: "Swimwear", checked: false });
            clothing.push({ name: "Flip Flops", checked: false });
            essentials.push({ name: "Sunscreen", checked: false });
            essentials.push({ name: "Sunglasses", checked: false });
        } else if (dest.includes("mountain") || dest.includes("hill") || dest.includes("snow") || dest.includes("winter")) {
            clothing.push({ name: "Thermal Wear", checked: false });
            clothing.push({ name: "Heavy Jacket", checked: false });
            clothing.push({ name: "Gloves & Beanie", checked: false });
            clothing.push({ name: "Hiking Boots", checked: false });
        } else {
            // Default city travel
            clothing.push({ name: "Casual Outfits", checked: false });
            clothing.push({ name: "Light Jacket", checked: false });
        }

        if (trip?.duration && parseInt(trip.duration) > 5) {
            essentials.push({ name: "Laundry Bag", checked: false });
        }

        return { essentials, clothing, gadgets };
    };

    const [items, setItems] = useState<{
        essentials: { name: string; checked: boolean }[];
        clothing: { name: string; checked: boolean }[];
        gadgets: { name: string; checked: boolean }[];
    }>({ essentials: [], clothing: [], gadgets: [] });

    useEffect(() => {
        if (trip) {
            setItems(generateList());
        }
    }, [trip]);

    const toggleItem = (category: keyof typeof items, index: number) => {
        setItems(prev => {
            const newCategory = [...prev[category]];
            newCategory[index] = { ...newCategory[index], checked: !newCategory[index].checked };
            return { ...prev, [category]: newCategory };
        });
    };

    if (!trip) return null;

    return (
        <div className="mt-8 mb-8 no-print">
            <div className="bg-white dark:bg-black/20 backdrop-blur-xl border border-neutral-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-teal-100 dark:bg-teal-500/20 rounded-2xl shadow-sm">
                        <Luggage className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-800 dark:text-white tracking-tight">Smart Packing List</h2>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">AI-suggested items for your {trip?.destination || "trip"}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Essentials */}
                    <div>
                        <h3 className="font-bold flex items-center gap-2 mb-4 text-neutral-700 dark:text-neutral-200">
                            <Check className="w-4 h-4 text-green-500" /> Essentials
                        </h3>
                        <ul className="space-y-3">
                            {items.essentials.map((item, i) => (
                                <li key={i} className="flex items-center gap-3 group cursor-pointer" onClick={() => toggleItem('essentials', i)}>
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${item.checked ? 'bg-teal-500 border-teal-500' : 'border-neutral-300 dark:border-neutral-600 group-hover:border-teal-400'}`}>
                                        {item.checked && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <span className={`text-sm ${item.checked ? 'text-neutral-400 line-through' : 'text-neutral-600 dark:text-neutral-300'}`}>{item.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Clothing */}
                    <div>
                        <h3 className="font-bold flex items-center gap-2 mb-4 text-neutral-700 dark:text-neutral-200">
                            <Shirt className="w-4 h-4 text-blue-500" /> Clothing
                        </h3>
                        <ul className="space-y-3">
                            {items.clothing.map((item, i) => (
                                <li key={i} className="flex items-center gap-3 group cursor-pointer" onClick={() => toggleItem('clothing', i)}>
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${item.checked ? 'bg-blue-500 border-blue-500' : 'border-neutral-300 dark:border-neutral-600 group-hover:border-blue-400'}`}>
                                        {item.checked && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <span className={`text-sm ${item.checked ? 'text-neutral-400 line-through' : 'text-neutral-600 dark:text-neutral-300'}`}>{item.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Gadgets */}
                    <div>
                        <h3 className="font-bold flex items-center gap-2 mb-4 text-neutral-700 dark:text-neutral-200">
                            <Smartphone className="w-4 h-4 text-purple-500" /> Gadgets
                        </h3>
                        <ul className="space-y-3">
                            {items.gadgets.map((item, i) => (
                                <li key={i} className="flex items-center gap-3 group cursor-pointer" onClick={() => toggleItem('gadgets', i)}>
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${item.checked ? 'bg-purple-500 border-purple-500' : 'border-neutral-300 dark:border-neutral-600 group-hover:border-purple-400'}`}>
                                        {item.checked && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <span className={`text-sm ${item.checked ? 'text-neutral-400 line-through' : 'text-neutral-600 dark:text-neutral-300'}`}>{item.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ShareExport = ({ trip }: { trip: TripInfo | undefined }) => {

    if (!trip) return null;

    const handleShare = () => {
        // Copy current URL to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    const handleDownload = () => {
        window.print();
    };

    return (
        <div className="fixed bottom-10 right-10 flex flex-col gap-4 z-50 no-print">
            <button
                onClick={handleShare}
                className="bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white p-4 rounded-full shadow-xl shadow-blue-900/10 hover:shadow-2xl hover:scale-105 transition-all border border-neutral-100 dark:border-neutral-700 flex items-center justify-center group"
                title="Share Trip"
            >
                <Share2 className="w-6 h-6 group-hover:text-blue-600 transition-colors" />
            </button>
            <button
                onClick={handleDownload}
                className="bg-black dark:bg-white text-white dark:text-black p-4 rounded-full shadow-xl shadow-black/20 hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center group"
                title="Download PDF"
            >
                <Download className="w-6 h-6" />
            </button>
        </div>
    )
}

export { PackingList, ShareExport };
