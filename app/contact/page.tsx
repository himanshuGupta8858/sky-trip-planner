"use client"

import {
  CheckCircle, Clock, Github, Instagram, Linkedin,
  Mail, MapPin, MessageCircle, Phone, Send, Twitter, Zap
} from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"

const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@skytrip.ai",
    sub: "We reply within 24 hours",
    color: "bg-indigo-50 text-indigo-500 border-indigo-100",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+91 98765 43210",
    sub: "Mon–Sat, 10 AM – 7 PM IST",
    color: "bg-emerald-50 text-emerald-500 border-emerald-100",
  },
  {
    icon: MapPin,
    label: "Our Office",
    value: "Varanasi, Uttar Pradesh",
    sub: "India — 221001",
    color: "bg-rose-50 text-rose-500 border-rose-100",
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "10:00 AM – 7:00 PM",
    sub: "Monday to Saturday (IST)",
    color: "bg-amber-50 text-amber-500 border-amber-100",
  },
]

const faqs = [
  {
    q: "How does SkyTrip generate my itinerary?",
    a: "SkyTrip uses advanced AI models to understand your preferences (destination, budget, travel style, duration) and generates a complete, personalised itinerary including hotels, places to visit, and timings.",
  },
  {
    q: "Is SkyTrip free to use?",
    a: "Yes! SkyTrip offers a free tier with a generous number of trip generations. For unlimited access, check out our premium plans on the Pricing page.",
  },
  {
    q: "Can I edit my generated itinerary?",
    a: "Absolutely. You can view, save, and share your trips from the My Trips dashboard. Custom edits are on the roadmap!",
  },
  {
    q: "Which countries does SkyTrip cover?",
    a: "SkyTrip covers destinations across 120+ countries worldwide — from popular tourist spots to hidden gems you've never heard of.",
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white py-24 px-6">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1596496181848-3091d4878b24?w=1600&q=80")', backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <MessageCircle className="w-4 h-4 text-blue-400" /> We'd love to hear from you
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Get in{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Have a question, feedback, or partnership idea? Our team is here to help. Drop us a message and we'll get back to you shortly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`rounded-2xl border p-6 flex flex-col gap-3 transition-all ${info.color}`}
            >
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <info.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{info.label}</p>
                <p className="font-bold text-gray-900">{info.value}</p>
                <p className="text-gray-500 text-sm mt-0.5">{info.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Form + Map */}
        <div className="grid md:grid-cols-2 gap-12">

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Send us a message</h2>
            <p className="text-gray-500 mb-8">Fill out the form and we'll respond within 24 hours.</p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-200 rounded-2xl p-10 text-center"
              >
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600">Thanks for reaching out, {form.name}. We'll get back to you at <span className="font-semibold">{form.email}</span> within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Himanshu"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@email.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us more about your query..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70"
                >
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Send Message</>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Map + Developer Social */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            {/* Embedded Google Map */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 h-72">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115348.24353756671!2d82.908706!3d25.317645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e2db760f545a9%3A0x6d9f8e4e9f731c77!2sVaranasi%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1714000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SkyTrip Office Location"
              />
            </div>

            {/* Company Info */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900">SkyTrip Technologies</h4>
                  <p className="text-gray-500 text-xs">AI-Powered Travel Platform</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                Registered in Varanasi, Uttar Pradesh, India. Built by developers who love travel and believe AI can make every journey better.
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">Follow Himanshu:</span>
                {[
                  { href: "https://github.com/himanshuGupta8858", icon: Github, color: "hover:bg-gray-900 hover:text-white" },
                  { href: "https://www.linkedin.com/in/himanshugupta-tech/", icon: Linkedin, color: "hover:bg-blue-600 hover:text-white" },
                  { href: "https://x.com/himanshuguptae", icon: Twitter, color: "hover:bg-sky-500 hover:text-white" },
                  { href: "https://www.instagram.com/himanshuguptae/", icon: Instagram, color: "hover:bg-pink-600 hover:text-white" },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 transition-all hover:scale-110 hover:shadow-md ${social.color}`}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3 block">FAQ</span>
            <h2 className="text-4xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    className="text-gray-400 shrink-0 ml-4 text-lg"
                  >
                    ▾
                  </motion.span>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
