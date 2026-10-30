"use client"

import {
  Code2, Github, Globe, Instagram, Linkedin,
  MapPin, Plane, Rocket, Sparkles, Star, Twitter, Users, Zap
} from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"

const stats = [
  { icon: Users, value: "10K+", label: "Happy Travellers", color: "text-blue-500" },
  { icon: Plane, value: "50K+", label: "Trips Planned", color: "text-indigo-500" },
  { icon: MapPin, value: "120+", label: "Countries Covered", color: "text-emerald-500" },
  { icon: Star, value: "4.9★", label: "Average Rating", color: "text-yellow-500" },
]

const techStack = [
  { name: "Next.js 15", icon: "⚡", desc: "App Router & Server Components" },
  { name: "Google Gemini AI", icon: "🤖", desc: "Intelligent trip planning engine" },
  { name: "Convex", icon: "🗄️", desc: "Real-time backend & database" },
  { name: "Clerk Auth", icon: "🔐", desc: "Secure authentication" },
  { name: "Tailwind CSS", icon: "🎨", desc: "Modern utility-first styling" },
  { name: "OpenRouter AI", icon: "🧠", desc: "Multi-model AI orchestration" },
]

const values = [
  {
    icon: Sparkles,
    title: "AI-First Design",
    desc: "Every feature is powered by cutting-edge AI to give you hyper-personalised travel plans in seconds.",
    color: "bg-purple-50 border-purple-100",
    iconColor: "text-purple-500",
  },
  {
    icon: Rocket,
    title: "Speed & Simplicity",
    desc: "From idea to complete itinerary in under 30 seconds. No forms, no friction — just conversation.",
    color: "bg-blue-50 border-blue-100",
    iconColor: "text-blue-500",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    desc: "Plan trips anywhere on the planet — from famous cities to the world's most hidden corners.",
    color: "bg-emerald-50 border-emerald-100",
    iconColor: "text-emerald-500",
  },
  {
    icon: Zap,
    title: "Always Improving",
    desc: "Constantly trained on new travel data, hotel listings, and real user feedback to get smarter every day.",
    color: "bg-orange-50 border-orange-100",
    iconColor: "text-orange-500",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 text-white py-28 px-6">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&q=80")', backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 text-yellow-400" /> Built with passion for travellers
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              About{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                SkyTrip
              </span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              SkyTrip is an AI-powered travel planning platform that turns your travel dreams into detailed, personalised itineraries — hotels, places, timings, and more — all in one conversation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center ${s.color}`}>
                <s.icon className="w-7 h-7" />
              </div>
              <span className="text-4xl font-extrabold text-gray-900">{s.value}</span>
              <span className="text-sm text-gray-500 font-medium">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4 block">Our Mission</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6 leading-snug">
              Making world-class travel planning accessible to everyone
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-6">
              Travel planning used to take hours of research across dozens of tabs. SkyTrip replaces all of that with a single, intelligent conversation. Tell us where you want to go — we handle the rest.
            </p>
            <p className="text-gray-500 text-lg leading-relaxed">
              Whether you're a solo backpacker on a budget or planning a luxury honeymoon, SkyTrip crafts a personalised itinerary that fits your style, timeline, and budget — powered by the latest AI.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl h-80"
          >
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
              alt="Travel planning"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-2xl font-bold">The World Awaits</p>
              <p className="text-white/70 text-sm">Start your journey with SkyTrip</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3 block">What We Stand For</span>
            <h2 className="text-4xl font-extrabold text-gray-900">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className={`rounded-2xl border p-8 transition-all ${v.color}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-5 shadow-sm ${v.iconColor}`}>
                  <v.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{v.title}</h3>
                <p className="text-gray-600 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3 block">Under the Hood</span>
          <h2 className="text-4xl font-extrabold text-gray-900">Built with Modern Tech</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {techStack.map((tech, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.03, y: -3 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <span className="text-3xl mb-3 block">{tech.icon}</span>
              <h4 className="font-bold text-gray-900 mb-1">{tech.name}</h4>
              <p className="text-gray-500 text-sm">{tech.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Developer Card */}
      <section className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-3 block">The Creator</span>
            <h2 className="text-4xl font-extrabold text-white">Meet the Developer</h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10"
          >
            <div className="shrink-0">
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-5xl font-extrabold shadow-2xl border-4 border-white/20">
                HG
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-extrabold text-white mb-1">Himanshu Gupta</h3>
              <p className="text-indigo-300 font-semibold text-lg mb-4 flex items-center gap-2 justify-center md:justify-start">
                <Code2 className="w-5 h-5" /> Full-Stack Developer & AI Enthusiast
              </p>
              <p className="text-white/70 leading-relaxed mb-6 text-base">
                Hi! I'm Himanshu — a passionate full-stack developer who loves building products at the intersection of AI and real-world utility. SkyTrip is my vision of making travel planning effortless and intelligent for everyone. I believe technology should remove friction, not add it.
              </p>

              <div className="flex items-center gap-4 justify-center md:justify-start flex-wrap">
                <a
                  href="https://github.com/himanshuGupta8858"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
                >
                  <Github className="w-4 h-4" /> GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/himanshugupta-tech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-600/80 hover:bg-blue-600 border border-blue-500/30 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
                <a
                  href="https://x.com/himanshuguptae"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-sky-500/80 hover:bg-sky-500 border border-sky-400/30 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
                >
                  <Twitter className="w-4 h-4" /> Twitter
                </a>
                <a
                  href="https://www.instagram.com/himanshuguptae/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-pink-600/80 hover:bg-pink-600 border border-pink-500/30 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
                >
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Ready to explore the world?</h2>
          <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of travellers who plan smarter with SkyTrip.
          </p>
          <Link href="/create-new-trip">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold px-10 py-4 rounded-2xl shadow-xl hover:shadow-indigo-200 transition-all text-lg"
            >
              Start Planning for Free ✈️
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
