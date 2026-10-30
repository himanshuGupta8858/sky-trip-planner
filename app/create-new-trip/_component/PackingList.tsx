import { CheckCircle2 } from "lucide-react";
import { TripInfo } from "./chatbox";

const PackingList = ({ trip }: { trip?: TripInfo }) => {

    const packingList = [
        { category: "Essentials", items: ["Passport / ID", "Wallet & Cash", "Phone & Charger", "Tickets & Reservation"] },
        { category: "Clothing", items: ["Daily Outfits", "Undergarments", "Comfortable Shoes", "Jacket / Hoodie"] },
        { category: "Toiletries", items: ["Toothbrush & Paste", "Shampoo & Body Wash", "Deodorant", "Sunscreen"] },
        { category: "Electronics", items: ["Power Bank", "Headphones", "Camera", "Travel Adapter"] },
    ]

    return (
        <div className="my-8">
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">Packing Checklist</h2>
            <div className="grid grid-cols-1 gap-4">
                {packingList.map((category, index) => (
                    <div key={index} className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="font-semibold text-base text-neutral-800 dark:text-neutral-200 mb-3">{category.category}</h3>
                        <div className="flex flex-col gap-2">
                            {category.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-orange-500" />
                                    <span className="text-neutral-600 dark:text-neutral-400 text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PackingList
