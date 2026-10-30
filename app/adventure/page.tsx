"use client"

import { motion } from "motion/react"
import { ArrowLeft, Flame, Heart, Mountain, Shield, Star, Wind, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const adventures = [
  {
    name: "Patagonia, Chile",
    tagline: "Trek through untamed wilderness at the end of the world",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    rating: 4.9,
    difficulty: "Hard",
    activity: "Trekking",
    color: "from-cyan-700/80 to-blue-900/90",
    thrill: 5,
    duration: "10-14 days",
  },
  {
    name: "Queenstown, New Zealand",
    tagline: "The world's adventure capital — bungee, skydive, ski, and more",
    image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80",
    rating: 4.9,
    difficulty: "Moderate",
    activity: "Multi-Sport",
    color: "from-green-700/80 to-teal-900/90",
    thrill: 5,
    duration: "7-10 days",
  },
  {
    name: "Iceland Ring Road",
    tagline: "Waterfalls, glaciers, volcanoes & the Northern Lights",
    image: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800&q=80",
    rating: 4.8,
    difficulty: "Easy",
    activity: "Road Trip",
    color: "from-indigo-700/80 to-purple-900/90",
    thrill: 4,
    duration: "10-12 days",
  },
  {
    name: "Everest Base Camp, Nepal",
    tagline: "Stand at the foot of the world's highest peak",
    image: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&q=80",
    rating: 5.0,
    difficulty: "Expert",
    activity: "Trekking",
    color: "from-stone-700/80 to-gray-900/90",
    thrill: 5,
    duration: "14-18 days",
  },
  {
    name: "Amazon Rainforest, Brazil",
    tagline: "Plunge into the lungs of the Earth — jungle, river & wildlife",
    image: "https://images.unsplash.com/photo-1504884790557-80daa3a9e621?w=800&q=80",
    rating: 4.7,
    difficulty: "Moderate",
    activity: "Jungle Expedition",
    color: "from-green-800/80 to-emerald-950/90",
    thrill: 4,
    duration: "5-8 days",
  },
  {
    name: "Sahara Desert, Morocco",
    tagline: "Camel rides, starlit camps & endless golden dunes",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80",
    rating: 4.8,
    difficulty: "Easy",
    activity: "Desert Safari",
    color: "from-amber-700/80 to-orange-900/90",
    thrill: 3,
    duration: "3-5 days",
  },
]

const difficultyColor: Record<string, string> = {
  Easy: "bg-green-100 text-green-700",
  Moderate: "bg-yellow-100 text-yellow-700",
  Hard: "bg-orange-100 text-orange-700",
  Expert: "bg-red-100 text-red-700",
}

const activityTypes = [
  { label: "Trekking", emoji: "🥾" },
  { label: "Diving", emoji: "🤿" },
  { label: "Skydiving", emoji: "🪂" },
  { label: "Safari", emoji: "🦁" },
  { label: "Surfing", emoji: "🏄" },
  { label: "Rock Climbing", emoji: "🧗" },
  { label: "Kayaking", emoji: "🛶" },
  { label: "Paragliding", emoji: "🪁" },
]

import { useClerk, useUser } from "@clerk/nextjs"
import { useFavorites } from "@/context/FavoritesContext"

export default function AdventurePage() {
  const router = useRouter()
  const { isSignedIn } = useUser()
  const { openSignIn } = useClerk()
  const { toggleFavorite, isFavorite } = useFavorites()

  const handlePlanClick = (destinationName?: string) => {
    if (!isSignedIn) {
      openSignIn()
      return
    }
    if (destinationName) {
      const promptString = `I want to plan an adventure trip to ${destinationName}.`
      router.push(`/create-new-trip?prompt=${encodeURIComponent(promptString)}`)
    } else {
      router.push("/create-new-trip")
    }
  }

  const handleFavoriteClick = (e: React.MouseEvent, adv: typeof adventures[0]) => {
    e.stopPropagation()
    if (!isSignedIn) {
      openSignIn()
      return
    }
    toggleFavorite({
      id: adv.name,
      name: adv.name,
      tagline: adv.tagline,
      image: adv.image,
      rating: adv.rating,
      tags: [adv.difficulty, adv.activity],
      description: adv.tagline,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="h-5 w-px bg-white/20" />
          <div className="flex items-center gap-2">
            <Mountain className="w-5 h-5 text-orange-400" />
            <span className="font-semibold">Adventure Destinations</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/60 to-gray-950" />
        <div className="relative max-w-7xl mx-auto px-6 py-28 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Flame className="w-4 h-4" /> Thrilling experiences await
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Dare to <br />
              <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Adventure
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Push your limits. Life begins at the edge of your comfort zone. Explore destinations that will leave you breathless — literally.
            </p>
            <motion.button
              onClick={() => handlePlanClick()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-10 py-4 rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all cursor-pointer"
            >
              Plan My Adventure 🏔️
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Activity Type Filter */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-white mb-6">Filter by Activity</h2>
        <div className="flex flex-wrap gap-3 mb-16">
          {activityTypes.map((act, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-white/10 hover:bg-orange-500/20 border border-white/10 hover:border-orange-400/40 text-white px-5 py-2.5 rounded-full font-medium transition-all text-sm cursor-pointer"
            >
              <span>{act.emoji}</span>
              <span>{act.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Zap, value: "100+", label: "Thrill-Seeking Destinations", color: "text-yellow-400" },
            { icon: Shield, value: "Safety First", label: "All Vetted & Rated", color: "text-green-400" },
            { icon: Wind, value: "All Levels", label: "Easy to Expert Routes", color: "text-blue-400" },
            { icon: Star, value: "4.8★ Avg", label: "By Adventure Travellers", color: "text-orange-400" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-colors"
            >
              <stat.icon className={`w-7 h-7 mx-auto mb-2 ${stat.color}`} />
              <div className="font-bold text-white text-lg">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Adventure Cards */}
        <h2 className="text-3xl font-bold text-white mb-8">Top Adventure Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adventures.map((adv, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="group relative rounded-3xl overflow-hidden border border-white/10 hover:border-orange-400/40 transition-all duration-300 shadow-xl hover:shadow-orange-500/20 cursor-pointer bg-gray-900"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={adv.image}
                  alt={adv.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${adv.color}`} />
                <button
                  onClick={(e) => handleFavoriteClick(e, adv)}
                  className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all cursor-pointer ${
                    isFavorite(adv.name)
                      ? "bg-white text-rose-500 shadow-md scale-105"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                  aria-label="Toggle Favorite"
                >
                  <Heart className={`w-4 h-4 transition-transform ${isFavorite(adv.name) ? "fill-rose-500 text-rose-500" : "text-white"}`} />
                </button>

                {/* Thrill meter */}
                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm rounded-xl px-3 py-1.5">
                  <div className="flex items-center gap-1 text-xs text-orange-400 font-bold mb-0.5">
                    <Flame className="w-3 h-3" /> Thrill Level
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className={`w-4 h-1.5 rounded-full ${n <= adv.thrill ? 'bg-orange-500' : 'bg-white/20'}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-bold text-xl">{adv.name}</h3>
                  <p className="text-white/70 text-sm mt-1">{adv.tagline}</p>
                </div>
              </div>

              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyColor[adv.difficulty]}`}>
                    {adv.difficulty}
                  </span>
                  <span className="text-xs bg-white/10 text-gray-300 px-2.5 py-1 rounded-full">
                    {adv.activity}
                  </span>
                  <span className="text-xs bg-white/10 text-gray-300 px-2.5 py-1 rounded-full ml-auto">
                    ⏱️ {adv.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-white">{adv.rating}</span>
                    <span className="text-gray-500 text-sm">/ 5.0</span>
                  </div>
                </div>

                <motion.button
                  onClick={() => handlePlanClick(adv.name)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-xl text-sm hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-500/20 cursor-pointer"
                >
                  Plan This Adventure →
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
