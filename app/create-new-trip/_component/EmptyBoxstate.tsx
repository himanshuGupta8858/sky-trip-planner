"use client";
import { Globe, Landmark, Map, Mountain, Plane } from 'lucide-react'
import { useRouter } from 'next/navigation'

const EmptyBoxState = ({ onSelectOption }: any) => {
    const router = useRouter();
    const options = [
        {
            id: 1,
            name: 'Create New Trip',
            icon: Map,
            color: 'text-blue-500',
            bgColor: 'bg-blue-100',
            href: null
        },
        {
            id: 2,
            name: 'Inspire me where to go',
            icon: Plane,
            color: 'text-green-500',
            bgColor: 'bg-green-100',
            href: '/inspire'

        },
        {
            id: 3,
            name: 'Discover Hidden gems',
            icon: Landmark,
            color: 'text-orange-700',
            bgColor: 'bg-orange-100',
            href: '/hidden-gems'

        },
        {
            id: 4,
            name: 'Adventure Destination',
            icon: Mountain,
            color: 'text-rose-500',
            bgColor: 'bg-rose-100',
            href: '/adventure'
        }
    ]
    return (
        <div className='flex flex-col items-center justify-center p-2 w-full h-full animate-in fade-in duration-500 overflow-y-auto'>
            <div className='flex items-center gap-2 mb-4 md:mb-6'>
                <Globe className='w-10 h-10 md:w-12 md:h-12 text-primary animate-pulse' />
            </div>
            <h2 className='text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight text-center px-4'>
                Start Planning your <span className='text-primary'>Next Trip</span>
            </h2>
            <p className='text-gray-500 text-center mt-2 md:mt-4 max-w-xl text-xs sm:text-sm md:text-lg relative z-10 px-4'>
                Your personal AI travel planner. Select an option below to begin your journey.
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 md:mt-10 w-full max-w-3xl px-2'>
                {options.map((option) => (
                    <div
                        key={option.id}
                        onClick={() => {
                            if (option.href) {
                                router.push(option.href);
                            } else {
                                onSelectOption(option.name);
                            }
                        }}
                        className='group flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-primary cursor-pointer hover:shadow-lg sm:hover:shadow-xl hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300 bg-white hover:bg-gray-50'
                    >
                        <div className={`p-3 sm:p-4 rounded-full mb-2 sm:mb-3 ${option.bgColor} group-hover:rotate-12 transition-transform duration-300`}>
                            <option.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${option.color}`} />
                        </div>
                        <h2 className='font-bold text-sm sm:text-md text-gray-800 group-hover:text-primary transition-colors text-center'>{option.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default EmptyBoxState