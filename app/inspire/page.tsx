"use client"

import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Heart,
  Info,
  MapPin,
  Send,
  Sparkles,
  Star,
  TrendingUp,
  X
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface PopularSpot {
  name: string
  description: string
  tag?: string
}

interface Destination {
  id: string
  name: string
  tagline: string
  description: string
  image: string
  gallery: string[]
  rating: number
  tags: string[]
  color: string
  trending?: boolean
  bestTimeToVisit: string
  suggestedDuration: number
  popularSpots: PopularSpot[]
}

const destinations: Destination[] = [
  {
    id: "santorini",
    name: "Santorini, Greece",
    tagline: "Whitewashed cliffs & endless sunsets",
    description: "Perched high above the Aegean Sea, Santorini is world-famous for its dramatic volcanic caldera views, romantic cliffside cave houses, pristine blue-domed churches, and unforgettable golden sunsets.",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
    ],
    rating: 4.9,
    tags: ["Romantic", "Beach", "Culture"],
    color: "from-blue-500/80 to-indigo-700/80",
    trending: true,
    bestTimeToVisit: "May – October",
    suggestedDuration: 5,
    popularSpots: [
      { name: "Oia Village", description: "World-famous sunset viewpoint with whitewashed cave homes & iconic blue domes.", tag: "Must Visit" },
      { name: "Red Beach", description: "Striking volcanic red cliffs framing crystalline Aegean sea waters.", tag: "Scenic Beach" },
      { name: "Fira Town", description: "Bustling capital filled with cliffside cafes, boutique shopping, and vibrant nightlife.", tag: "City Life" },
      { name: "Akrotiri Archaeological Site", description: "Preserved ancient Bronze Age Minoan ruins buried by volcanic eruption.", tag: "Historical" },
    ],
  },
  {
    id: "kyoto",
    name: "Kyoto, Japan",
    tagline: "Ancient temples & blooming cherry blossoms",
    description: "Kyoto is Japan's cultural heartland, home to thousands of wooden Buddhist temples, serene Zen gardens, historic imperial palaces, traditional tea houses, and geisha entertainment districts.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80",
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80",
    ],
    rating: 4.8,
    tags: ["Cultural", "Peaceful", "Scenic"],
    color: "from-pink-500/80 to-rose-700/80",
    trending: true,
    bestTimeToVisit: "March – May & October – November",
    suggestedDuration: 5,
    popularSpots: [
      { name: "Fushimi Inari Taisha", description: "Iconic mountain trail lined with over 10,000 vivid vermilion torii gates.", tag: "Iconic Shrine" },
      { name: "Arashiyama Bamboo Grove", description: "Enchanting forest of soaring green bamboo stalks swaying in the breeze.", tag: "Nature Sanctuary" },
      { name: "Kinkaku-ji (Golden Pavilion)", description: "Breathtaking Zen temple whose top two floors are completely covered in gold leaf.", tag: "UNESCO Heritage" },
      { name: "Gion Historic District", description: "Atmospheric lantern-lit streets famous for tea houses and traditional Geisha culture.", tag: "Culture & Dining" },
    ],
  },
  {
    id: "amalfi",
    name: "Amalfi Coast, Italy",
    tagline: "Dramatic cliffs, azure sea & Italian charm",
    description: "A majestic coastline in Campania, Italy, celebrated for pastel-hued cliffside villages, steep terraced lemon orchards, sparkling turquoise sea, and world-renowned Mediterranean gastronomy.",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    ],
    rating: 4.9,
    tags: ["Luxury", "Scenic", "Foodie"],
    color: "from-amber-500/80 to-orange-700/80",
    bestTimeToVisit: "May – September",
    suggestedDuration: 6,
    popularSpots: [
      { name: "Positano", description: "Cascading cliffside village with colourful villas, pebbled beaches, and seaside dining.", tag: "Coastal Jewel" },
      { name: "Ravello & Villa Rufolo", description: "Hilltop oasis famous for sublime infinity views over the Bay of Salerno.", tag: "Panoramic Views" },
      { name: "Path of the Gods (Sentiero degli Dei)", description: "Breathtaking mountain hiking path connecting coastal cliff top villages.", tag: "Adventure Hike" },
      { name: "Amalfi Cathedral", description: "Stunning 9th-century Arab-Norman cathedral in the heart of historic Amalfi town.", tag: "Architecture" },
    ],
  },
  {
    id: "bali",
    name: "Bali, Indonesia",
    tagline: "Sacred temples, rice terraces & island vibes",
    description: "Bali is an island paradise blending tropical jungles, volcanic peaks, sacred seaside temples, world-class surf breaks, and serene spiritual wellness retreats.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80",
    ],
    rating: 4.7,
    tags: ["Spiritual", "Beach", "Adventure"],
    color: "from-green-500/80 to-teal-700/80",
    bestTimeToVisit: "April – October",
    suggestedDuration: 7,
    popularSpots: [
      { name: "Tegallalang Rice Terraces", description: "Stunning emerald sculpted valley of traditional Balinese rice paddies.", tag: "Nature & Views" },
      { name: "Uluwatu Temple", description: "Cliff-edge sea temple hosting mesmerizing sunset Kecak fire dances.", tag: "Cultural Performance" },
      { name: "Nusa Penida Kelingking Beach", description: "Famous T-Rex shaped coastal headland dropping into electric blue ocean.", tag: "Unreal Landscape" },
      { name: "Ubud Monkey Forest", description: "Sacred sanctuary home to hundreds of Balinese long-tailed macaques.", tag: "Wildlife & Nature" },
    ],
  },
  {
    id: "marrakech",
    name: "Marrakech, Morocco",
    tagline: "Vibrant souks, desert dunes & riads",
    description: "Marrakech is a captivating oasis of color, featuring sensory spice markets, intricately tiled riad courtyards, historic Moorish palaces, and nearby Sahara desert adventures.",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80",
    ],
    rating: 4.6,
    tags: ["Exotic", "Culture", "Foodie"],
    color: "from-red-500/80 to-rose-800/80",
    bestTimeToVisit: "March – May & September – November",
    suggestedDuration: 5,
    popularSpots: [
      { name: "Jemaa el-Fnaa Square", description: "Bustling historic square packed with street food, musicians, and storytellers.", tag: "Heart of Medina" },
      { name: "Jardin Majorelle", description: "Cobalt blue botanical sanctuary originally created by artist Jacques Majorelle.", tag: "Art & Oasis" },
      { name: "Bahia Palace", description: "Elaborate 19th-century palace showcasing exquisite Moroccan mosaic tilework.", tag: "Moorish Splendor" },
      { name: "Agafay Desert", description: "Stunning rocky desert landscape perfect for sunset camel rides & starlit glamping.", tag: "Desert Experience" },
    ],
  },
  {
    id: "maldives",
    name: "Maldives",
    tagline: "Overwater bungalows & crystal lagoons",
    description: "The ultimate tropical dream destination, where crystal-clear turquoise ocean waters meet private overwater villas, thriving coral reefs, and pristine white sand beaches.",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
    ],
    rating: 5.0,
    tags: ["Luxury", "Honeymoon", "Beach"],
    color: "from-cyan-500/80 to-blue-700/80",
    bestTimeToVisit: "November – April",
    suggestedDuration: 6,
    popularSpots: [
      { name: "Baa Atoll Biosphere Reserve", description: "World-class UNESCO reserve for swimming alongside whale sharks & manta rays.", tag: "Marine Life" },
      { name: "Vaadhoo Island (Sea of Stars)", description: "Fascinating natural phenomenon where bioluminescent plankton glow blue at night.", tag: "Bioluminescence" },
      { name: "Private Atoll Resorts", description: "Luxury overwater suites with private infinity pools dropping into lagoon waters.", tag: "Overwater Villas" },
      { name: "Coral Reef Gardens", description: "Vibrant coral gardens perfect for snorkeling, scuba diving, and underwater dining.", tag: "Water Sports" },
    ],
  },
]

const moods = [
  { label: "Romantic Getaway", emoji: "💑", color: "bg-rose-100 text-rose-700 hover:bg-rose-200" },
  { label: "Family Fun", emoji: "👨‍👩‍👧‍👦", color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" },
  { label: "Solo Exploration", emoji: "🧭", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
  { label: "Weekend Escape", emoji: "🌅", color: "bg-orange-100 text-orange-700 hover:bg-orange-200" },
  { label: "Luxury Travel", emoji: "✨", color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
  { label: "Budget Adventure", emoji: "🎒", color: "bg-green-100 text-green-700 hover:bg-green-200" },
]

const groupSizeOptions = [
  { id: "Solo", label: "Solo", emoji: "🧍", desc: "Just me" },
  { id: "Couple", label: "Couple", emoji: "💑", desc: "2 People" },
  { id: "Family", label: "Family", emoji: "👨‍👩‍👧‍👦", desc: "3 to 5 People" },
  { id: "Friends", label: "Friends", emoji: "👥", desc: "Group" },
]

const budgetOptions = [
  { id: "Cheap", label: "Budget", emoji: "💰", desc: "Keep it low cost" },
  { id: "Moderate", label: "Moderate", emoji: "💳", desc: "Balanced spending" },
  { id: "Luxury", label: "Luxury", emoji: "✨", desc: "Premium experience" },
]

const allInterests = [
  "Romantic",
  "Beach",
  "Culture",
  "Adventure",
  "Foodie",
  "Relaxing",
  "Nature",
  "Shopping",
  "Nightlife",
]

import { useFavorites } from "@/context/FavoritesContext"
import { useClerk, useUser } from "@clerk/nextjs"

export default function InspirePage() {
  const router = useRouter()
  const { isSignedIn } = useUser()
  const { openSignIn } = useClerk()
  const { toggleFavorite, isFavorite } = useFavorites()

  // Modal State
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null)
  const [activeStep, setActiveStep] = useState<"details" | "form">("details")
  const [activeImageIdx, setActiveImageIdx] = useState(0)

  // Form State
  const [source, setSource] = useState("")
  const [duration, setDuration] = useState<number>(5)
  const [groupSize, setGroupSize] = useState("Couple")
  const [budget, setBudget] = useState("Moderate")
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [errorMsg, setErrorMsg] = useState("")

  const openDestinationModal = (dest: Destination) => {
    setSelectedDest(dest)
    setActiveStep("details")
    setActiveImageIdx(0)
    setDuration(dest.suggestedDuration || 5)
    setSelectedInterests(dest.tags || [])
    setErrorMsg("")
  }

  const closeModal = () => {
    setSelectedDest(null)
    setActiveStep("details")
    setErrorMsg("")
  }

  const toggleInterest = (tag: string) => {
    if (selectedInterests.includes(tag)) {
      setSelectedInterests(selectedInterests.filter((t) => t !== tag))
    } else {
      setSelectedInterests([...selectedInterests, tag])
    }
  }

  const handleHeroPlanClick = () => {
    if (!isSignedIn) {
      openSignIn()
      return
    }
    router.push("/create-new-trip")
  }

  const handleStartPlanning = () => {
    if (!isSignedIn) {
      openSignIn()
      return
    }
    setActiveStep("form")
  }

  const handleFavoriteClick = (e: React.MouseEvent, dest: Destination) => {
    e.stopPropagation()
    if (!isSignedIn) {
      openSignIn()
      return
    }
    toggleFavorite({
      id: dest.id,
      name: dest.name,
      tagline: dest.tagline,
      image: dest.image,
      rating: dest.rating,
      tags: dest.tags,
      suggestedDuration: dest.suggestedDuration,
      description: dest.description,
    })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSignedIn) {
      openSignIn()
      return
    }
    if (!source.trim()) {
      setErrorMsg("Please enter your starting location.")
      return
    }
    setErrorMsg("")

    if (!selectedDest) return

    const promptString = `I want to plan a trip to ${selectedDest.name} starting from ${source.trim()}. Duration: ${duration} days. Group size: ${groupSize}. Budget: ${budget}. Travel style & activities: ${selectedInterests.join(", ")}.`
    router.push(`/create-new-trip?prompt=${encodeURIComponent(promptString)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <span className="font-semibold text-gray-800">Inspire Me</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1400&q=80")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" /> Curated by AI Travel Experts
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Where Will Your
              <br />
              <span className="bg-gradient-to-r from-yellow-200 to-amber-300 bg-clip-text text-transparent">
                Next Story Begin?
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Let us spark your wanderlust. Explore handpicked destinations tailored to your mood and travel style.
            </p>
            <motion.button
              onClick={handleHeroPlanClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-orange-600 font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer"
            >
              Plan My Dream Trip ✈️
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Mood Filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">What's your travel mood?</h2>
          <div className="flex flex-wrap gap-3 mb-16">
            {moods.map((mood, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all cursor-pointer ${mood.color}`}
              >
                <span>{mood.emoji}</span>
                <span>{mood.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Destinations Grid Header */}
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800">Top Picks For You</h2>
          <div className="flex items-center gap-2 text-orange-600 text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>Trending destinations</span>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest, index) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -8, scale: 1.01 }}
              onClick={() => openDestinationModal(dest)}
              className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white"
            >
              <div className="relative h-72 w-full overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${dest.color} opacity-60`} />
                {dest.trending && (
                  <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <TrendingUp className="w-3 h-3" /> Trending
                  </div>
                )}
                <button
                  onClick={(e) => handleFavoriteClick(e, dest)}
                  className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-sm ${
                    isFavorite(dest.id)
                      ? "bg-white text-rose-500 scale-105"
                      : "bg-white/20 text-white hover:bg-white/40"
                  }`}
                  aria-label="Toggle Favorite"
                  title={isFavorite(dest.id) ? "Remove from Favorites" : "Save to Favorites"}
                >
                  <Heart className={`w-4 h-4 transition-transform ${isFavorite(dest.id) ? "fill-rose-500 text-rose-500" : "text-white"}`} />
                </button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 opacity-90" />
                  <h3 className="text-xl font-bold">{dest.name}</h3>
                </div>
                <p className="text-white/80 text-sm mb-3">{dest.tagline}</p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {dest.tags.map((tag, t) => (
                      <span key={t} className="bg-white/20 backdrop-blur-sm text-xs px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold">{dest.rating}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    openDestinationModal(dest)
                  }}
                  className="mt-4 w-full bg-white text-gray-800 font-semibold py-2.5 rounded-xl text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-50 flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Plan This Trip</span>
                  <span>→</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Destination & Trip Form Popup Modal */}
      <AnimatePresence>
        {selectedDest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative z-10 w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* STEP 1: DESTINATION DETAILS VIEW */}
              {activeStep === "details" && (
                <div className="flex-1 overflow-y-auto">
                  {/* Hero Gallery Header */}
                  <div className="relative h-72 sm:h-80 w-full bg-gray-900">
                    <img
                      src={selectedDest.gallery[activeImageIdx] || selectedDest.image}
                      alt={selectedDest.name}
                      className="w-full h-full object-cover transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                    {/* Image Selector Thumbnails */}
                    <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {selectedDest.gallery.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImageIdx(idx)}
                            className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                              activeImageIdx === idx ? "border-white scale-105 shadow-lg" : "border-white/50 opacity-70 hover:opacity-100"
                            }`}
                          >
                            <img src={img} alt="preview" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-semibold">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span>{selectedDest.rating} Rating</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Header Info */}
                    <div>
                      <div className="flex items-center gap-2 text-orange-600 font-semibold text-sm mb-1">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedDest.name}</span>
                      </div>
                      <h2 className="text-3xl font-extrabold text-gray-900">{selectedDest.tagline}</h2>
                    </div>

                    {/* Info Badges */}
                    <div className="flex flex-wrap gap-4 pt-1 border-y border-gray-100 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100">
                        <Calendar className="w-4 h-4 text-orange-500" />
                        <span>Best Season: <strong className="text-gray-800">{selectedDest.bestTimeToVisit}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span>Suggested: <strong className="text-gray-800">{selectedDest.suggestedDuration} Days</strong></span>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">About Destination</h3>
                      <p className="text-gray-600 leading-relaxed text-base">{selectedDest.description}</p>
                    </div>

                    {/* Popular Spots */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-orange-500" />
                        <span>Popular Highlights & Must-Visit Locations</span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedDest.popularSpots.map((spot, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 hover:border-orange-300 hover:bg-orange-50/30 transition-all"
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <h4 className="font-bold text-gray-900 text-sm">{spot.name}</h4>
                              {spot.tag && (
                                <span className="bg-orange-100 text-orange-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                                  {spot.tag}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-xs leading-relaxed">{spot.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer CTA */}
                  <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-gray-100 p-6 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 block font-medium">Ready for an adventure?</span>
                      <span className="text-sm font-bold text-gray-800">Customize your personalized trip</span>
                    </div>

                    <button
                      onClick={handleStartPlanning}
                      className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Plan This Trip</span>
                      <span>✈️</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: TRIP CUSTOMIZATION FORM VIEW */}
              {activeStep === "form" && (
                <div className="flex-1 overflow-y-auto">
                  {/* Form Header */}
                  <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-6 sm:p-8 text-white relative">
                    <button
                      onClick={() => setActiveStep("details")}
                      className="flex items-center gap-2 text-white/80 hover:text-white mb-3 text-sm font-medium transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Overview</span>
                    </button>
                    <h2 className="text-2xl sm:text-3xl font-extrabold">Plan Your Trip to {selectedDest.name}</h2>
                    <p className="text-white/90 text-sm mt-1">
                      Enter your details below and our AI will build a personalized day-by-day itinerary instantly.
                    </p>
                  </div>

                  {/* Form Content */}
                  <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-6">
                    {errorMsg && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
                        <Info className="w-4 h-4 text-red-500 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Destination (Pre-filled) */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Destination</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={selectedDest.name}
                          readOnly
                          className="w-full bg-gray-100 border border-gray-200 text-gray-800 font-semibold px-4 py-3 rounded-xl focus:outline-none cursor-not-allowed"
                        />
                        <Check className="absolute right-4 top-3.5 w-5 h-5 text-emerald-500" />
                      </div>
                    </div>

                    {/* Source / Starting Location */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Starting From (Source City) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={source}
                          onChange={(e) => setSource(e.target.value)}
                          placeholder="e.g., New Delhi, Mumbai, New York, London"
                          className="w-full bg-white border border-gray-300 focus:border-orange-500 text-gray-800 pl-12 pr-4 py-3 rounded-xl focus:outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Duration in Days */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Trip Duration (Days): <span className="text-orange-600">{duration} Days</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[3, 5, 7, 10, 14].map((d) => (
                          <button
                            type="button"
                            key={d}
                            onClick={() => setDuration(d)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                              duration === d
                                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {d} Days
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Group Size / Traveling With */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Who is Traveling?</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {groupSizeOptions.map((opt) => (
                          <button
                            type="button"
                            key={opt.id}
                            onClick={() => setGroupSize(opt.id)}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                              groupSize === opt.id
                                ? "border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                          >
                            <span className="text-2xl block mb-1">{opt.emoji}</span>
                            <span className="font-bold text-sm text-gray-800 block">{opt.label}</span>
                            <span className="text-xs text-gray-500 block">{opt.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Budget Level */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Budget Preference</label>
                      <div className="grid grid-cols-3 gap-3">
                        {budgetOptions.map((opt) => (
                          <button
                            type="button"
                            key={opt.id}
                            onClick={() => setBudget(opt.id)}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                              budget === opt.id
                                ? "border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                          >
                            <span className="text-xl block mb-1">{opt.emoji}</span>
                            <span className="font-bold text-sm text-gray-800 block">{opt.label}</span>
                            <span className="text-xs text-gray-500 block">{opt.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Travel Style / Adventures / Interests */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Adventures & Travel Style (Select All That Apply)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {allInterests.map((interest) => {
                          const isSelected = selectedInterests.includes(interest)
                          return (
                            <button
                              type="button"
                              key={interest}
                              onClick={() => toggleInterest(interest)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                                isSelected
                                  ? "bg-orange-500 text-white shadow-sm shadow-orange-500/20"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                              <span>{interest}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-gray-100">
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
                      >
                        <Send className="w-5 h-5" />
                        <span>Generate Trip with AI</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

