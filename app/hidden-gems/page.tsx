"use client"

import { AnimatePresence, motion } from "motion/react"
import {
  ArrowLeft,
  Calendar,
  Camera,
  Check,
  Clock,
  Compass,
  Dices,
  Eye,
  Heart,
  Info,
  MapPin,
  RefreshCw,
  Send,
  Sparkles,
  Star,
  Users,
  Wallet,
  X
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useClerk, useUser } from "@clerk/nextjs"
import { useFavorites } from "@/context/FavoritesContext"

interface HighlightSpot {
  name: string
  description: string
  tag?: string
}

interface HiddenGem {
  id: string
  name: string
  tagline: string
  description: string
  image: string
  gallery: string[]
  rating: number
  visitors: string
  tags: string[]
  badge: string
  badgeColor: string
  vibe: string
  color: string
  fact: string
  secretTip: string
  bestTimeToVisit: string
  suggestedDuration: number
  popularSpots: HighlightSpot[]
}

const hiddenGems: HiddenGem[] = [
  {
    id: "faroe-islands",
    name: "Faroe Islands, Denmark",
    tagline: "Dramatic cliffs over the North Atlantic — virtually untouched",
    description: "An archipelago of 18 mountainous volcanic islands between Iceland and Norway. Experience emerald fjords, dramatic waterfalls tumbling directly into the ocean, and pristine mossy valleys.",
    image: "https://images.unsplash.com/photo-1504706886208-fb20e5d2b0bb?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1504706886208-fb20e5d2b0bb?w=800&q=80",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
    ],
    rating: 4.9,
    visitors: "2K/year",
    tags: ["Off-Beat", "Nature", "Scenic"],
    badge: "Under the Radar",
    badgeColor: "bg-emerald-500",
    vibe: "Off-Beat Nature",
    color: "from-teal-600/80 to-emerald-900/80",
    fact: "Only 54,000 people live here — outnumbered by sheep 3:1.",
    secretTip: "Hire a local boat captain in Sørvágur to see sea stacks hidden from mainland trails.",
    bestTimeToVisit: "June – August",
    suggestedDuration: 6,
    popularSpots: [
      { name: "Múlafossur Waterfall", description: "Breathtaking cascade dropping over cliff edges directly into the Atlantic ocean.", tag: "Must See" },
      { name: "Sørvágsvatn (Lake Above Ocean)", description: "Visual optical illusion lake that appears to float high above sea level.", tag: "Unreal View" },
      { name: "Mykines Island", description: "Remote island sanctuary populated by thousands of Atlantic puffins.", tag: "Wildlife" },
    ],
  },
  {
    id: "kotor",
    name: "Kotor, Montenegro",
    tagline: "A medieval gem hidden between mountains and the sea",
    description: "Tucked inside a secluded bay on Montenegro's Adriatic coast, Kotor boasts a labyrinthine UNESCO Old Town surrounded by steep limestone cliffs and Venetian-era fortifications.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80",
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    ],
    rating: 4.8,
    visitors: "5K/year",
    tags: ["Medieval", "Coastal", "Culture"],
    badge: "Secret Find",
    badgeColor: "bg-blue-500",
    vibe: "Medieval Cities",
    color: "from-blue-700/80 to-slate-900/80",
    fact: "Old city walls built in the 9th century, still perfectly preserved.",
    secretTip: "Hike the fortress stairs before 8 AM to catch sunrise over the bay with zero crowds.",
    bestTimeToVisit: "May – September",
    suggestedDuration: 4,
    popularSpots: [
      { name: "San Giovanni Fortress", description: "Climb 1,350 historic steps for sweeping panorama of Bay of Kotor.", tag: "Panoramic View" },
      { name: "Kotor Old Town", description: "Cobblestone alleys filled with centuries-old palaces and cozy cat cafes.", tag: "UNESCO Heritage" },
      { name: "Our Lady of the Rocks", description: "Picturesque man-made islet housing a sacred 17th-century church.", tag: "Boat Trip" },
    ],
  },
  {
    id: "jiufen",
    name: "Jiufen, Taiwan",
    tagline: "Lantern-lit alleys that inspired Studio Ghibli's Spirited Away",
    description: "A mountain town perched above the ocean near Taipei, known for narrow stone alleys, glowing red paper lanterns, traditional tea houses, and savory local street delicacies.",
    image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80",
    ],
    rating: 4.7,
    visitors: "8K/year",
    tags: ["Cinematic", "Food", "Culture"],
    badge: "Hidden Gem",
    badgeColor: "bg-red-500",
    vibe: "Exotic Wonders",
    color: "from-orange-600/80 to-red-900/80",
    fact: "Said to be the visual inspiration for Hayao Miyazaki's Spirited Away.",
    secretTip: "Visit during dusk when rain fog settles over Shuqi Road for mystical photos.",
    bestTimeToVisit: "October – April",
    suggestedDuration: 3,
    popularSpots: [
      { name: "A-Mei Tea House", description: "Iconic multi-story wooden teahouse offering oolong tea with ocean fog views.", tag: "Iconic Spot" },
      { name: "Jiufen Old Street", description: "Bustling street filled with taro balls, herbal cakes, and artisan craft shops.", tag: "Foodie Paradise" },
      { name: "Teapot Mountain Trail", description: "Scenic ridge hike with sweeping views of the Pacific coastline.", tag: "Scenic Hike" },
    ],
  },
  {
    id: "socotra",
    name: "Socotra, Yemen",
    tagline: "The Galápagos of the Indian Ocean — alien landscapes await",
    description: "An isolated archipelago boasting surreal biodiversity where one-third of plant species are found nowhere else on planet Earth, framed by turquoise waters and white sand dunes.",
    image: "https://images.unsplash.com/photo-1504884790557-80daa3a9e621?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1504884790557-80daa3a9e621?w=800&q=80",
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80",
    ],
    rating: 4.9,
    visitors: "<1K/year",
    tags: ["Exotic", "Wildlife", "Unique"],
    badge: "Rare & Remote",
    badgeColor: "bg-purple-500",
    vibe: "Exotic Wonders",
    color: "from-purple-700/80 to-indigo-900/80",
    fact: "Home to iconic umbrella-shaped Dragon's Blood Trees.",
    secretTip: "Camp under the stars at Arher Beach where massive sand dunes plunge into the sea.",
    bestTimeToVisit: "October – March",
    suggestedDuration: 7,
    popularSpots: [
      { name: "Diksam Plateau", description: "Dense forests of prehistoric Dragon's Blood trees high up in mountain canyons.", tag: "Unique Flora" },
      { name: "Detwah Lagoon", description: "Electric blue marine lagoon with powdery white sand dunes and stingrays.", tag: "Pristine Beach" },
      { name: "Hoq Cave", description: "Enormous 3km deep cavern filled with stalagmites and ancient inscriptions.", tag: "Exploration" },
    ],
  },
  {
    id: "hallstatt",
    name: "Hallstatt, Austria",
    tagline: "A fairy-tale alpine village reflected in a mirror lake",
    description: "Nestled between the Hallstätter See and the Dachstein Alps, this 7,000-year-old salt-mining town features pastel 16th-century wooden houses, quiet alpine waters, and mountain cable cars.",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80",
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80",
    ],
    rating: 4.9,
    visitors: "3K/year",
    tags: ["Romantic", "Alpine", "Scenic"],
    badge: "Fairy-tale",
    badgeColor: "bg-pink-500",
    vibe: "Fairy-tale Castles",
    color: "from-pink-600/80 to-rose-900/80",
    fact: "So beautiful, China built an exact replica of the entire village.",
    secretTip: "Rent an electric swan boat in early morning to experience silent mirror reflections.",
    bestTimeToVisit: "May – October & December",
    suggestedDuration: 3,
    popularSpots: [
      { name: "Hallstatt Skywalk", description: "Free-hanging viewing platform projecting 350 meters above the roofs and lake.", tag: "Skyline View" },
      { name: "Ancient Salt Mine", description: "World's oldest salt mine featuring subterranean slides and prehistoric artifacts.", tag: "Historic Mine" },
      { name: "Classic Village Viewpoint", description: "World famous postcard photo spot overlooking church tower and lake.", tag: "Postcard View" },
    ],
  },
  {
    id: "colmar",
    name: "Colmar, France",
    tagline: "Pastel-coloured Alsatian buildings straight from a storybook",
    description: "Located along the Alsatian Wine Route, Colmar is famed for cobblestone streets lined with half-timbered medieval houses, flower-decked canals, and world-class Riesling wine.",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    ],
    rating: 4.7,
    visitors: "6K/year",
    tags: ["Romantic", "Culture", "Foodie"],
    badge: "Local Favourite",
    badgeColor: "bg-amber-500",
    vibe: "Medieval Cities",
    color: "from-amber-600/80 to-yellow-900/80",
    fact: "Birthplace of Frédéric-Auguste Bartholdi, creator of the Statue of Liberty.",
    secretTip: "Take a flat-bottomed boat along the Lauch river at dusk for candlelit canal reflections.",
    bestTimeToVisit: "May – September & December",
    suggestedDuration: 4,
    popularSpots: [
      { name: "Little Venice (La Petite Venise)", description: "Charming canal quarter with flower boxes hanging over timbered houses.", tag: "Canal Cruise" },
      { name: "Unterlinden Museum", description: "Renowned fine art museum housed inside a former 13th-century convent.", tag: "Art & History" },
      { name: "Pfister House", description: "Exquisite 1537 Renaissance merchant house with painted wooden galleries.", tag: "Architecture" },
    ],
  },
  {
    id: "shirakawa-go",
    name: "Shirakawa-go, Japan",
    tagline: "Thatch-roofed mountain villages nestled in snowy valleys",
    description: "A UNESCO mountain sanctuary surrounded by pine forests, famous for traditional Gassho-style steep thatched farmhouses built to withstand heavy winter snowfalls.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80",
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80",
    ],
    rating: 4.9,
    visitors: "4K/year",
    tags: ["Heritage", "Snow", "Culture"],
    badge: "Snow Village",
    badgeColor: "bg-cyan-500",
    vibe: "Fairy-tale Castles",
    color: "from-cyan-600/80 to-blue-900/80",
    fact: "House roofs are held together without a single nail using straw ropes.",
    secretTip: "Stay overnight in a minshuku (traditional gassho homestay) to taste irori hearth dinners.",
    bestTimeToVisit: "December – February & October",
    suggestedDuration: 3,
    popularSpots: [
      { name: "Ogimachi Village", description: "Main cluster of 59 preserved gassho farmhouses nestled under pine slopes.", tag: "UNESCO Village" },
      { name: "Shiroyama Viewpoint", description: "Panoramic hilltop overlook offering winter wonderland landscape views.", tag: "Best Overlook" },
      { name: "Wada House", description: "Largest preserved farmhouse open for visitors to explore ancient wooden interiors.", tag: "Historical House" },
    ],
  },
  {
    id: "lake-bled",
    name: "Lake Bled, Slovenia",
    tagline: "Emerald alpine waters surrounding a tear-drop island church",
    description: "A serene Slovenian lake surrounded by the Julian Alps, featuring a cliff-top medieval castle and a tiny island church accessible by traditional wooden Pletna boats.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80",
    ],
    rating: 4.8,
    visitors: "4.5K/year",
    tags: ["Island", "Nature", "Romance"],
    badge: "Emerald Oasis",
    badgeColor: "bg-teal-500",
    vibe: "Secret Islands",
    color: "from-teal-600/80 to-emerald-900/80",
    fact: "Local tradition dictates grooms must carry their brides up 99 steps to the island church.",
    secretTip: "Sample original Bled cream cake (Kremšnita) at Park Restaurant overlooking the lake.",
    bestTimeToVisit: "May – September",
    suggestedDuration: 4,
    popularSpots: [
      { name: "Bled Island & Church", description: "Island church where visitors ring the wishing bell for good fortune.", tag: "Wishing Bell" },
      { name: "Bled Castle", description: "11th-century cliffside castle perched 130 meters above the lake.", tag: "Castle View" },
      { name: "Ojstrica Hike", description: "Short steep trail leading to the most famous aerial viewpoint over Bled.", tag: "Postcard Hike" },
    ],
  },
  {
    id: "meteora",
    name: "Meteora, Greece",
    tagline: "Monasteries perched atop towering sandstone rock pillars",
    description: "A breathtaking UNESCO sanctuary in central Greece where 14th-century Byzantine monasteries perch precariously on top of colossal natural rock columns.",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
    ],
    rating: 4.9,
    visitors: "3.5K/year",
    tags: ["Spiritual", "Cliffs", "History"],
    badge: "Monasteries in Sky",
    badgeColor: "bg-indigo-500",
    vibe: "Off-Beat Nature",
    color: "from-indigo-700/80 to-slate-900/80",
    fact: "Monks originally hauled materials up in net ladders suspended over 1,000 ft drops.",
    secretTip: "Watch golden sunset rays light up the monolithic pillars from Psaropetra Rock.",
    bestTimeToVisit: "April – June & September – November",
    suggestedDuration: 3,
    popularSpots: [
      { name: "Great Meteoron Monastery", description: "Largest and oldest cliff-top monastery with ancient frescoes and cellars.", tag: "Main Monastery" },
      { name: "Sunset Rock (Psaropetra)", description: "Famous sunset viewing cliff watching golden rays illuminate the rock pinnacles.", tag: "Golden Sunset" },
      { name: "Monastery of Holy Trinity", description: "Dramatic isolated monastery featured in James Bond's 'For Your Eyes Only'.", tag: "Iconic Location" },
    ],
  },
]

const stats = [
  { icon: Eye, value: "200+", label: "Hidden Gems Curated" },
  { icon: Compass, value: "50+", label: "Countries Covered" },
  { icon: Camera, value: "4.9★", label: "Avg. Visitor Rating" },
  { icon: Heart, value: "10K+", label: "Happy Explorers" },
]

const vibes = [
  "All Secrets",
  "Off-Beat Nature",
  "Medieval Cities",
  "Exotic Wonders",
  "Fairy-tale Castles",
  "Secret Islands",
]

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const randomDurations = [3, 4, 5, 6, 7]
const randomGroupSizes = ["Solo (1 Person)", "Couple (2 People)", "Friends (Group)", "Family (3-5 People)"]
const randomBudgets = ["Budget Saver", "Moderate Balanced", "Luxury Premium"]

export default function HiddenGemsPage() {
  const router = useRouter()
  const { isSignedIn } = useUser()
  const { openSignIn } = useClerk()
  const { toggleFavorite, isFavorite } = useFavorites()

  // Filter State
  const [selectedVibe, setSelectedVibe] = useState("All Secrets")

  // Modal State
  const [selectedGem, setSelectedGem] = useState<HiddenGem | null>(null)
  const [activeStep, setActiveStep] = useState<"details" | "form">("details")
  const [activeImageIdx, setActiveImageIdx] = useState(0)

  // Quick Random Auto Specs
  const [sourceCity, setSourceCity] = useState("")
  const [randomDays, setRandomDays] = useState(5)
  const [randomGroup, setRandomGroup] = useState("Couple (2 People)")
  const [randomBudget, setRandomBudget] = useState("Moderate Balanced")
  const [errorMsg, setErrorMsg] = useState("")

  const filteredGems =
    selectedVibe === "All Secrets"
      ? hiddenGems
      : hiddenGems.filter((g) => g.vibe === selectedVibe)

  const randomizeSpecs = () => {
    setRandomDays(getRandomItem(randomDurations))
    setRandomGroup(getRandomItem(randomGroupSizes))
    setRandomBudget(getRandomItem(randomBudgets))
  }

  const openGemModal = (gem: HiddenGem) => {
    setSelectedGem(gem)
    setActiveStep("details")
    setActiveImageIdx(0)
    setSourceCity("")
    randomizeSpecs()
    setErrorMsg("")
  }

  const handleSurpriseMe = () => {
    const randomGem = getRandomItem(hiddenGems)
    openGemModal(randomGem)
  }

  const closeModal = () => {
    setSelectedGem(null)
    setActiveStep("details")
    setErrorMsg("")
  }

  const handleGoToForm = () => {
    if (!isSignedIn) {
      openSignIn()
      return
    }
    setActiveStep("form")
  }

  const handleConfirmAndGoToChatbot = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSignedIn) {
      openSignIn()
      return
    }
    if (!sourceCity.trim()) {
      setErrorMsg("Please enter your starting location.")
      return
    }
    setErrorMsg("")

    if (!selectedGem) return

    const promptString = `I want to plan a secret trip to ${selectedGem.name} starting from ${sourceCity.trim()}. Duration: ${randomDays} days. Group size: ${randomGroup}. Budget: ${randomBudget}. Vibe: ${selectedGem.vibe}. Key highlights: ${selectedGem.popularSpots.map(s => s.name).join(", ")}.`
    router.push(`/create-new-trip?prompt=${encodeURIComponent(promptString)}`)
  }

  const handleFavoriteClick = (e: React.MouseEvent, gem: HiddenGem) => {
    e.stopPropagation()
    if (!isSignedIn) {
      openSignIn()
      return
    }
    toggleFavorite({
      id: gem.id,
      name: gem.name,
      tagline: gem.tagline,
      image: gem.image,
      rating: gem.rating,
      tags: gem.tags,
      suggestedDuration: gem.suggestedDuration,
      description: gem.fact,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/60">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-emerald-100/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-500 hover:text-emerald-700 transition-colors group cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <div className="h-5 w-px bg-emerald-200/60" />
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-gray-800">Hidden Gems</span>
            </div>
          </div>

          <button
            onClick={handleSurpriseMe}
            className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-4 py-2 rounded-full border border-emerald-200/80 transition-all cursor-pointer shadow-xs"
          >
            <Dices className="w-4 h-4 text-emerald-600 animate-spin-slow" />
            <span>Surprise Me 🎲</span>
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-800 via-teal-700 to-cyan-800 text-white">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1531804155340-a5c492364f01?w=1400&q=80")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
              <Compass className="w-4 h-4 text-emerald-300" /> Places 99% of travellers haven't found yet
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover
              <br />
              <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                Hidden Gems
              </span>
            </h1>
            <p className="text-xl text-white/85 max-w-2xl mx-auto mb-10">
              Skip the tourist traps. Explore secret destinations handpicked by our AI — extraordinary places only the savviest travellers know about.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.button
                onClick={handleSurpriseMe}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-teal-800 font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer border border-emerald-100 flex items-center gap-2"
              >
                <Dices className="w-5 h-5 text-emerald-600" />
                <span>Surprise Me With a Secret Escape 🎲</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-emerald-100/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex flex-col items-center text-center gap-2"
            >
              <stat.icon className="w-6 h-6 text-emerald-600" />
              <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
              <span className="text-sm text-gray-500">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-4xl font-bold text-gray-800 mb-4">
            World's Best Kept Secrets
          </motion.h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto mb-8">
            These destinations are awe-inspiring — and still blissfully crowd-free.
          </p>

          {/* Vibe Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {vibes.map((vibe, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedVibe(vibe)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  selectedVibe === vibe
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105"
                    : "bg-emerald-50/70 text-emerald-800 border border-emerald-100/80 hover:bg-emerald-100"
                }`}
              >
                {vibe}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGems.map((gem, index) => (
            <motion.div
              key={gem.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 * index }}
              whileHover={{ y: -8, scale: 1.01 }}
              onClick={() => openGemModal(gem)}
              className="group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white border border-emerald-100/60 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={gem.image}
                    alt={gem.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(gem.name)}/800/600`
                    }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${gem.color}`} />
                  <div className={`absolute top-4 left-4 ${gem.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md`}>
                    {gem.badge}
                  </div>
                  <button
                    onClick={(e) => handleFavoriteClick(e, gem)}
                    className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-sm ${
                      isFavorite(gem.id)
                        ? "bg-white text-rose-500 scale-105"
                        : "bg-white/20 text-white hover:bg-white/40"
                    }`}
                    aria-label="Toggle Favorite"
                  >
                    <Heart className={`w-4 h-4 transition-transform ${isFavorite(gem.id) ? "fill-rose-500 text-rose-500" : "text-white"}`} />
                  </button>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                      <h3 className="text-white font-bold text-xl">{gem.name}</h3>
                    </div>
                    <p className="text-white/80 text-xs font-medium leading-snug line-clamp-1">{gem.tagline}</p>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Fun Fact / Did you know */}
                  <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl px-4 py-3 text-xs text-emerald-800 font-medium leading-relaxed">
                    💡 <span className="font-bold">Did you know?</span> {gem.fact}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-wrap gap-1">
                      {gem.tags.map((tag, t) => (
                        <span key={t} className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-emerald-100/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-gray-700">{gem.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    openGemModal(gem)
                  }}
                  className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-md shadow-emerald-600/15 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Secret Gem</span>
                  <span>→</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Destination & Quick Launch Modal */}
      <AnimatePresence>
        {selectedGem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
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

              {/* STEP 1: DESTINATION DETAILS OVERVIEW */}
              {activeStep === "details" && (
                <div className="flex-1 overflow-y-auto">
                  {/* Hero Gallery Header */}
                  <div className="relative h-72 sm:h-80 w-full bg-gray-900">
                    <img
                      src={selectedGem.gallery[activeImageIdx] || selectedGem.image}
                      alt={selectedGem.name}
                      className="w-full h-full object-cover transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                    {/* Image Selector Thumbnails */}
                    <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {selectedGem.gallery.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImageIdx(idx)}
                            className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                              activeImageIdx === idx ? "border-emerald-400 scale-105 shadow-lg" : "border-white/50 opacity-70 hover:opacity-100"
                            }`}
                          >
                            <img src={img} alt="preview" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-semibold">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span>{selectedGem.rating} Secret Rating</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Header Info */}
                    <div>
                      <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-1">
                        <Compass className="w-4 h-4 text-emerald-600" />
                        <span>{selectedGem.name}</span>
                      </div>
                      <h2 className="text-3xl font-extrabold text-gray-900">{selectedGem.tagline}</h2>
                    </div>

                    {/* Info Badges */}
                    <div className="flex flex-wrap gap-3 pt-1 border-y border-gray-100 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>Best Season: <strong className="text-gray-800">{selectedGem.bestTimeToVisit}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        <span>Suggested Stay: <strong className="text-gray-800">{selectedGem.suggestedDuration} Days</strong></span>
                      </div>
                      <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                        <Eye className="w-4 h-4 text-emerald-600" />
                        <span>Footfall: <strong className="text-gray-800">{selectedGem.visitors}</strong></span>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">About This Hidden Gem</h3>
                      <p className="text-gray-600 leading-relaxed text-base">{selectedGem.description}</p>
                    </div>

                    {/* Secret Insider Tip */}
                    <div className="bg-emerald-50/90 border border-emerald-200/80 rounded-2xl p-4 text-emerald-900 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Secret Insider Tip</span>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed">{selectedGem.secretTip}</p>
                    </div>

                    {/* Popular Highlights */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-emerald-600" />
                        <span>Secret Spots & Must-See Locations</span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedGem.popularSpots.map((spot, idx) => (
                          <div
                            key={idx}
                            className="bg-emerald-50/40 border border-emerald-100/80 rounded-2xl p-4 hover:border-emerald-300 hover:bg-emerald-50/70 transition-all"
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <h4 className="font-bold text-gray-900 text-sm">{spot.name}</h4>
                              {spot.tag && (
                                <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
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

                  {/* Modal Footer Actions */}
                  <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-gray-100 p-6 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
                    <button
                      onClick={handleSurpriseMe}
                      className="w-full sm:w-auto bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-5 py-3 rounded-2xl border border-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                    >
                      <Dices className="w-4 h-4 text-emerald-600" />
                      <span>Surprise Me 🎲</span>
                    </button>

                    <button
                      onClick={handleGoToForm}
                      className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Plan Secret Trip</span>
                      <span>🗺️</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: CONFIRMATION & SOURCE INPUT VIEW */}
              {activeStep === "form" && (
                <div className="flex-1 overflow-y-auto">
                  {/* Form Header */}
                  <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-cyan-800 p-6 sm:p-8 text-white relative">
                    <button
                      onClick={() => setActiveStep("details")}
                      className="flex items-center gap-2 text-white/80 hover:text-white mb-3 text-sm font-medium transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Overview</span>
                    </button>
                    <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs mb-1">
                      <Compass className="w-4 h-4" />
                      <span>{selectedGem.badge}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold">Plan Your Trip to {selectedGem.name}</h2>
                    <p className="text-white/85 text-xs sm:text-sm mt-1">
                      Confirm your starting location and auto-generated secret package specs below.
                    </p>
                  </div>

                  {/* Form Content */}
                  <form onSubmit={handleConfirmAndGoToChatbot} className="p-6 sm:p-8 space-y-6">
                    {errorMsg && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
                        <Info className="w-4 h-4 text-red-500 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Only ask for Source City */}
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">
                        Where are you starting from? (Source City) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={sourceCity}
                          onChange={(e) => setSourceCity(e.target.value)}
                          placeholder="e.g., New Delhi, Mumbai, New York, London"
                          className="w-full bg-white border border-gray-300 focus:border-emerald-500 text-gray-800 pl-12 pr-4 py-3 rounded-xl focus:outline-none transition-all"
                          autoFocus
                          required
                        />
                      </div>
                    </div>

                    {/* Randomized Details Confirmation Card */}
                    <div className="bg-emerald-50/80 border border-emerald-200/70 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-emerald-200/50 pb-2">
                        <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                          <Dices className="w-4 h-4 text-emerald-600" /> Auto-Generated Secret Package Specs
                        </span>
                        <button
                          type="button"
                          onClick={randomizeSpecs}
                          className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" /> Re-roll Specs
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs text-gray-700">
                        <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                          <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-bold">Duration</span>
                            <strong className="text-gray-900 font-bold">{randomDays} Days</strong>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                          <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-bold">Travelers</span>
                            <strong className="text-gray-900 font-bold">{randomGroup}</strong>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                          <Wallet className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-bold">Budget</span>
                            <strong className="text-gray-900 font-bold">{randomBudget}</strong>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-bold">Vibe</span>
                            <strong className="text-gray-900 font-bold">{selectedGem.vibe}</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
                      >
                        <Send className="w-5 h-5" />
                        <span>Confirm & Launch Chatbot Itinerary</span>
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
