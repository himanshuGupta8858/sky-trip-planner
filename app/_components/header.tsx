"use client"
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { useFavorites } from '@/context/FavoritesContext'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { Heart, Menu, Send, Star, Trash2, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const menuOptions = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "Dashboard",
        href: "/dashboard",
    },
    {
        name: "Pricing",
        href: "/pricing",
    },
    {
        name: "Travel Tools",
        href: "/tools/converter",
    },
    {
        name: "About",
        href: "/about",
    },
    {
        name: "Contact Us",
        href: "/contact",
    },
]

const Header = () => {
    const { user, isSignedIn } = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const path = usePathname();
    const router = useRouter();
    const { favorites, removeFavorite } = useFavorites();

    const handlePlanFavorite = (destinationName: string) => {
        setIsFavoritesOpen(false);
        const promptString = `I want to plan a trip to ${destinationName}.`;
        router.push(`/create-new-trip?prompt=${encodeURIComponent(promptString)}`);
    }

    return (
        <header className='p-4 shadow-sm bg-white sticky top-0 z-50 border-b border-gray-100'>
            <div className='max-w-7xl mx-auto flex justify-between items-center'>
                {/* Logo Section */}
                <div className='flex gap-2 items-center'>
                    <Link href="/" className='flex gap-2 items-center'>
                        <Image src="/logo.svg" alt="Logo" width={40} height={40} className="w-10 h-10" />
                        <h1 className='text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent'>SkyTrip</h1>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className='hidden md:flex gap-8 items-center'>
                    {menuOptions.map((option) => (
                        <Link
                            key={option.name}
                            href={option.href}
                            className='text-base font-medium text-gray-600 hover:text-primary transition-colors hover:scale-105 active:scale-95'
                        >
                            {option.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop Actions & Auth */}
                <div className='hidden md:flex items-center gap-3'>
                    {/* Favorites Heart Button */}
                    <button
                        onClick={() => setIsFavoritesOpen(true)}
                        className='relative p-2.5 rounded-2xl border border-gray-200 hover:border-rose-300 hover:bg-rose-50/60 text-gray-600 hover:text-rose-600 transition-all cursor-pointer group flex items-center gap-1.5'
                        aria-label="View Saved Favorites"
                        title="Saved Favorites"
                    >
                        <Heart className={`w-5 h-5 transition-transform group-hover:scale-110 ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-gray-500'}`} />
                        {favorites.length > 0 && (
                            <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                                {favorites.length}
                            </span>
                        )}
                    </button>

                    {isSignedIn ? (
                        <div className='flex gap-2 items-center'>
                            {path === '/create-new-trip' ? (
                                <Link href="/my-trips">
                                    <ShimmerButton className='h-10 px-6 text-sm font-medium'>My Trips</ShimmerButton>
                                </Link>
                            ) : (
                                <Link href="/create-new-trip">
                                    <ShimmerButton className='h-10 px-6 text-sm font-medium'>Create New Trip</ShimmerButton>
                                </Link>
                            )}
                            <UserButton appearance={{
                                elements: {
                                    userButtonAvatarBox: "h-14 w-14 border-2 border-primary/10 rounded-full"
                                }
                            }} />
                        </div>
                    ) : (
                        <SignInButton mode='modal'>
                            <ShimmerButton className='h-10 px-6 text-sm font-medium'>Get Started</ShimmerButton>
                        </SignInButton>
                    )}
                </div>

                {/* Mobile Actions & Menu Toggle */}
                <div className='md:hidden flex items-center gap-2'>
                    {/* Favorites Button Mobile */}
                    <button
                        onClick={() => setIsFavoritesOpen(true)}
                        className='relative p-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-rose-50 transition-colors'
                        aria-label="View Favorites"
                    >
                        <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                        {favorites.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {favorites.length}
                            </span>
                        )}
                    </button>

                    {isSignedIn && (
                        <UserButton appearance={{
                            elements: {
                                userButtonAvatarBox: "h-18 w-18 border border-gray-200"
                            }
                        }} />
                    )}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className='p-2 rounded-full hover:bg-gray-100 transition-colors'
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMenuOpen && (
                <div className='md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl py-6 px-4 flex flex-col gap-4 animate-in slide-in-from-top-5 duration-200 z-50'>
                    {menuOptions.map((option) => (
                        <Link
                            key={option.name}
                            href={option.href}
                            onClick={() => setIsMenuOpen(false)}
                            className='text-lg font-medium text-gray-700 hover:text-primary py-2 px-2 hover:bg-gray-50 rounded-lg transition-all'
                        >
                            {option.name}
                        </Link>
                    ))}

                    <button
                        onClick={() => {
                            setIsMenuOpen(false);
                            setIsFavoritesOpen(true);
                        }}
                        className='flex items-center justify-between text-lg font-medium text-gray-700 hover:text-rose-600 py-2 px-2 hover:bg-rose-50 rounded-lg transition-all text-left'
                    >
                        <span className="flex items-center gap-2">
                            <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                            <span>Saved Favorites</span>
                        </span>
                        {favorites.length > 0 && (
                            <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {favorites.length}
                            </span>
                        )}
                    </button>

                    {!isSignedIn ? (
                        <div className="pt-2">
                            <SignInButton mode='modal'>
                                <ShimmerButton className='w-full justify-center'>Get Started</ShimmerButton>
                            </SignInButton>
                        </div>
                    ) : (
                        <div className="pt-2">
                            {path === '/create-new-trip' ? (
                                <Link href="/my-trips" onClick={() => setIsMenuOpen(false)}>
                                    <ShimmerButton className='w-full justify-center'>My Trips</ShimmerButton>
                                </Link>
                            ) : (
                                <Link href="/create-new-trip" onClick={() => setIsMenuOpen(false)}>
                                    <ShimmerButton className='w-full justify-center'>Create New Trip</ShimmerButton>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Favorites Slide-over Modal / Drawer */}
            <AnimatePresence>
                {isFavoritesOpen && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFavoritesOpen(false)}
                            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
                        />

                        {/* Drawer Box */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-rose-500 to-pink-600 text-white">
                                <div className="flex items-center gap-2">
                                    <Heart className="w-6 h-6 fill-white" />
                                    <h2 className="text-xl font-bold">Saved Favorites</h2>
                                    <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                                        {favorites.length}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setIsFavoritesOpen(false)}
                                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {favorites.length === 0 ? (
                                    <div className="text-center py-16 space-y-4">
                                        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                                            <Heart className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">No Favorites Saved Yet</h3>
                                            <p className="text-gray-500 text-sm max-w-xs mx-auto mt-1">
                                                Explore destinations and tap the heart icon on any card to save your favorite places here!
                                            </p>
                                        </div>
                                        <Link
                                            href="/inspire"
                                            onClick={() => setIsFavoritesOpen(false)}
                                            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-orange-500 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                                        >
                                            <span>Explore Destinations</span>
                                            <span>🧭</span>
                                        </Link>
                                    </div>
                                ) : (
                                    favorites.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all flex gap-3 relative group"
                                        >
                                            <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative bg-gray-100">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                {item.rating && (
                                                    <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                                                        <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                                        <span>{item.rating}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 flex flex-col justify-between py-0.5">
                                                <div>
                                                    <div className="flex justify-between items-start pr-6">
                                                        <h4 className="font-bold text-gray-900 text-base leading-tight">{item.name}</h4>
                                                    </div>
                                                    {item.tagline && (
                                                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.tagline}</p>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                                                    <button
                                                        onClick={() => handlePlanFavorite(item.name)}
                                                        className="bg-primary hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                                                    >
                                                        <span>Plan Trip</span>
                                                        <Send className="w-3 h-3" />
                                                    </button>

                                                    <button
                                                        onClick={() => removeFavorite(item.id)}
                                                        className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                                        title="Remove from favorites"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Header