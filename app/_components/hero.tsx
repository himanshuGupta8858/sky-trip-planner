"use client"
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog'
import { useUser } from '@clerk/nextjs'
import { ChevronDown, Globe, Luggage, MapPin, Mountain, Pencil, Send, Sparkles } from 'lucide-react'
import { motion } from "motion/react"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const Hero = () => {

  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [inputValue, setInputValue] = useState('')

  const onSend = () => {
    if (!user && !isSignedIn) {
      router.push('/sign-in');
      return;
    }
    if (inputValue.trim()) {
      router.push(`/create-new-trip?prompt=${encodeURIComponent(inputValue.trim())}`);
    } else {
      router.push('/create-new-trip');
    }
  }

  const quickActions = [
    {
      label: 'Create New Trip',
      icon: Globe,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
      hoverBgColor: 'group-hover:bg-blue-200',
      badge: { type: 'text', content: '+', className: 'absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold' },
      href: '/create-new-trip',
    },
    {
      label: 'My Trips',
      icon: Luggage,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100',
      hoverBgColor: 'group-hover:bg-purple-200',
      href: '/my-trips',
    },
    {
      label: 'Inspire me where to Go',
      icon: MapPin,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100',
      hoverBgColor: 'group-hover:bg-green-200',
      badge: { type: 'icon', icon: Sparkles, className: 'w-3 h-3 text-green-600 absolute -top-0.5 -right-0.5' },
      href: '/inspire',
    },
    {
      label: 'Discover Hidden Gems',
      icon: Sparkles,
      iconColor: 'text-pink-600',
      bgColor: 'bg-pink-100',
      hoverBgColor: 'group-hover:bg-pink-200',
      href: '/hidden-gems',
    },
    {
      label: 'Adventure Destinations',
      icon: Mountain,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100',
      hoverBgColor: 'group-hover:bg-green-200',
      href: '/adventure',
    },
  ]

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-4 py-8 overflow-hidden relative'>
      <div className='max-w-4xl w-full space-y-8 relative z-10'>

        <div className='text-center space-y-4'>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className='text-5xl md:text-6xl font-bold text-gray-800 py-12'
          >
            Hey, I'm your personal{' '}
            <span className='text-primary inline-block'>Trip Planner</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-lg md:text-xl text-gray-500 max-w-2xl mx-auto'
          >
            Tell me what you want, and I'll handle the rest: flights, hotels, itineraries — all in seconds.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className='relative w-full max-w-3xl mx-auto'
        >
          <div className='relative flex items-center bg-white border-2 border-gray-200 rounded-2xl px-4 py-4 shadow-sm hover:border-gray-300 transition-colors'>
            <Pencil className='w-5 h-5 text-gray-400 mr-3' />
            <input
              type='text'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSend();
                }
              }}
              placeholder='Create a trip for Paris from New York'
              className='flex-1 outline-none text-gray-700 placeholder-gray-400 text-lg'
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className='ml-3 w-12 h-12 rounded-full bg-primary hover:bg-[#FF5A3A] transition-colors flex items-center justify-center text-white shadow-md'
              aria-label='Submit' onClick={() => onSend()}
            >
              <Send className='w-5 h-5' />
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Action Buttons */}
        <div className='flex flex-wrap justify-center gap-4 md:gap-6 mt-8'>
          {quickActions.map((action, index) => {
            const IconComponent = action.icon
            const BadgeIcon = action.badge?.icon
            const delay = 0.6 + (index * 0.1);

            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: delay }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => router.push(action.href ?? '/')}
                className='flex flex-col items-center cursor-pointer gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors group'
              >
                <div className={`w-12 h-12 rounded-full ${action.bgColor} flex items-center  justify-center ${action.hoverBgColor} transition-colors ${action.badge ? 'relative' : ''}`}>
                  <IconComponent className={`w-6 h-6 ${action.iconColor}`} />
                  {action.badge && (
                    <>
                      {action.badge.type === 'text' && (
                        <span className={action.badge.className}>{action.badge.content}</span>
                      )}
                      {action.badge.type === 'icon' && BadgeIcon && (
                        <BadgeIcon className={action.badge.className} />
                      )}
                    </>
                  )}
                </div>
                <span className='text-sm text-gray-700 font-medium'>{action.label}</span>
              </motion.button>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className='text-center mt-8 pt-4'
        >
          <p className='text-gray-700 text-base md:text-lg'>
            Not Sure where to start?{' '}
            <span className='font-bold'>See how it works</span>
            <ChevronDown className='inline-block w-4 h-4 ml-1 text-gray-700' />
          </p>
        </motion.div>

        {/* Hero Video Dialog */}
        <HeroVideoDialog
          className="block dark:hidden mt-8"
          animationStyle="from-center"
          videoSrc="/demo-video.mp4"
          thumbnailSrc="/thumbnail2.png"
          thumbnailAlt="SkyTrip Demo Video Thumbnail"
        />
      </div>
    </div>
  )
}

export default Hero