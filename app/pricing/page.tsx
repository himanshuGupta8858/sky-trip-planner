"use client";

import Footer from '@/app/_components/footer';
import { useUserDetail } from '@/app/provider';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { 
  ArrowRight, 
  Award, 
  Check, 
  ChevronDown, 
  CreditCard, 
  Globe, 
  HelpCircle, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  Users, 
  Zap 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface Plan {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  cta: string;
  colorScheme: {
    badgeBg: string;
    badgeText: string;
    buttonBg: string;
    border: string;
  };
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Explorer",
    badge: "Starter",
    description: "Ideal for travelers planning their first few adventures with intelligent AI assistance.",
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      "3 AI Trip Generations (Starter credits)",
      "Day-by-Day Smart Itineraries",
      "Interactive Google Maps & Geolocation Pins",
      "Essential Packing Checklist",
      "Basic Currency & Timezone Views",
      "Standard Response Speed",
      "Save trips to your personal dashboard"
    ],
    cta: "Start Free",
    colorScheme: {
      badgeBg: "bg-gray-100 dark:bg-neutral-800",
      badgeText: "text-gray-700 dark:text-gray-300",
      buttonBg: "bg-gray-900 hover:bg-gray-800 text-white dark:bg-neutral-800 dark:hover:bg-neutral-700",
      border: "border-gray-200 dark:border-neutral-800"
    }
  },
  {
    id: "pro",
    name: "Wanderlust Pro",
    badge: "Most Popular",
    isPopular: true,
    description: "Designed for jetsetters and frequent travelers who demand unlimited AI intelligence.",
    monthlyPrice: 9.99,
    annualPrice: 7.99,
    features: [
      "Unlimited AI Trip Generations",
      "Real-Time AI Companion with Live Tips",
      "Interactive Multi-Day Route Visualizer",
      "Live Currency Converter with Live Rates",
      "Timezone Intelligence & Quiet Hours Alert",
      "Ultra-Fast Priority AI Engine",
      "Export Printable Travel Guide (PDF)",
      "Save & Favorite Unlimited Destinations",
      "Priority Customer Support"
    ],
    cta: "Upgrade to Pro",
    colorScheme: {
      badgeBg: "bg-gradient-to-r from-teal-500 to-cyan-500",
      badgeText: "text-white",
      buttonBg: "bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 hover:opacity-95 text-white shadow-lg shadow-teal-500/25",
      border: "border-teal-400/50 dark:border-teal-500/40"
    }
  },
  {
    id: "globetrotter",
    name: "Globetrotter VIP",
    badge: "Best Value",
    description: "Comprehensive planning power for group leaders, digital nomads, and luxury travel.",
    monthlyPrice: 24.99,
    annualPrice: 19.99,
    features: [
      "Everything in Wanderlust Pro",
      "Multi-City Complex Route Optimization",
      "Group Travel Collaboration & Shared Links",
      "Offline PDF Guides with QR Code Access",
      "Custom Dietary, Accessibility & Pace Filters",
      "24/7 Dedicated AI Travel Concierge",
      "Early Access to New AI Models & Features",
      "VIP 1-on-1 Personalized Travel Setup"
    ],
    cta: "Get Globetrotter",
    colorScheme: {
      badgeBg: "bg-purple-100 dark:bg-purple-950/60",
      badgeText: "text-purple-600 dark:text-purple-300",
      buttonBg: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white shadow-lg shadow-indigo-500/25",
      border: "border-purple-300/60 dark:border-purple-800"
    }
  }
];

const faqs = [
  {
    q: "Can I switch plans or cancel at any time?",
    a: "Yes! You can upgrade, downgrade, or cancel your subscription whenever you want without any hidden cancellation fees."
  },
  {
    q: "How do AI credits work on SkyTrip?",
    a: "Free accounts start with 3 complimentary AI credits to create full multi-day itineraries and companion insights. Pro and Globetrotter plans grant unlimited generations."
  },
  {
    q: "What happens when I run out of free AI credits?",
    a: "When your credits reach 0, you can upgrade to Wanderlust Pro to unlock unlimited generations, or continue viewing and managing all your previously saved trips on your Dashboard."
  },
  {
    q: "What payment methods are supported?",
    a: "We support all major international and domestic credit/debit cards (Visa, MasterCard, American Express, Discover), Apple Pay, Google Pay, and UPI."
  },
  {
    q: "Can I export and share my itineraries with friends?",
    a: "Yes! All plans let you share trip links, and Pro/Globetrotter tiers allow you to export high-resolution printable PDFs with QR code access."
  }
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { isSignedIn, user } = useUser();
  const { userDetail, setUserDetail } = useUserDetail();
  const upgradeSubscription = useMutation(api.user.UpgradeSubscription);
  const router = useRouter();

  const currentPlanId = userDetail?.subscription || "free";
  const userCredits = userDetail?.aiCredits ?? 3;

  const handleSelectPlan = async (plan: Plan) => {
    if (!isSignedIn) {
      toast.info("Please sign in to choose a plan");
      router.push("/create-new-trip");
      return;
    }

    if (plan.id === "free") {
      router.push("/create-new-trip");
      return;
    }

    if (!userDetail?._id) {
      toast.error("User profile is still initializing. Please try again in a second.");
      return;
    }

    try {
      setLoadingPlan(plan.id);
      const creditsToAssign = plan.id === "pro" ? 999 : 9999;
      const updatedUser = await upgradeSubscription({
        uid: userDetail._id,
        plan: plan.id,
        aiCredits: creditsToAssign
      });

      if (updatedUser) {
        setUserDetail(updatedUser);
      }

      toast.success(
        `🎉 Successfully upgraded to ${plan.name}! Unlimited AI generations are now active.`,
        { duration: 4000 }
      );
    } catch (err) {
      console.error("Upgrade error:", err);
      toast.error("Failed to update subscription. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-neutral-950 relative overflow-hidden flex flex-col items-center">
      
      {/* Premium Hero Banner Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 text-white py-20 md:py-28 px-6 text-center">
        <div 
          className="absolute inset-0 opacity-15"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=1600&q=80")', 
            backgroundSize: "cover", 
            backgroundPosition: "center" 
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
        
        <div className="relative max-w-4xl mx-auto z-10 flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6 text-white/90 shadow-sm">
              <Sparkles className="w-4 h-4 text-teal-400 fill-teal-400/20" /> Simple, Transparent Travel Pricing
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
              Unlock Unlimited{" "}
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Adventures
              </span>
            </h1>
            <p className="text-base sm:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed">
              Supercharge your trips with instant day-by-day itineraries, interactive route maps, live currency conversions, and your 24/7 AI travel companion.
            </p>

            {/* Current Status Pill if Logged In */}
            {isSignedIn && (
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-xs sm:text-sm text-cyan-200">
                <span>Active Account: <strong className="text-white capitalize">{currentPlanId}</strong> Plan</span>
                <span className="text-white/40">•</span>
                <span>Credits: <strong className="text-white">{currentPlanId !== 'free' ? 'Unlimited' : `${userCredits} left`}</strong></span>
              </div>
            )}

            {/* Billing Cycle Switcher */}
            <div className="mt-10 flex items-center justify-center gap-3">
              <span className={`text-sm font-semibold transition-colors ${!isAnnual ? 'text-white' : 'text-white/60'}`}>
                Monthly
              </span>
              <button
                type="button"
                onClick={() => setIsAnnual(!isAnnual)}
                className="w-14 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-1 relative transition-colors border border-white/30 focus:outline-none focus:ring-2 focus:ring-teal-400"
                aria-label="Toggle Annual or Monthly Billing"
              >
                <motion.div
                  className="w-6 h-6 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full shadow-md"
                  animate={{ x: isAnnual ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold transition-colors ${isAnnual ? 'text-white' : 'text-white/60'}`}>
                  Yearly
                </span>
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                  Save 20%
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Pricing Cards Container */}
      <div className="w-full max-w-7xl mx-auto px-4 -mt-10 md:-mt-14 pb-20 md:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => {
            const isCurrent = currentPlanId === plan.id;
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-3xl bg-white dark:bg-neutral-900 border ${plan.colorScheme.border} ${
                  plan.isPopular 
                    ? 'ring-2 ring-teal-500 shadow-2xl shadow-teal-500/15 lg:-translate-y-4' 
                    : 'shadow-xl shadow-slate-200/50 dark:shadow-none'
                } flex flex-col justify-between p-8 transition-all hover:shadow-2xl`}
              >
                {/* Popular Ribbon */}
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-white" /> {plan.badge}
                  </div>
                )}

                <div>
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 min-h-[40px]">
                        {plan.description}
                      </p>
                    </div>
                    {!plan.isPopular && plan.badge && (
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${plan.colorScheme.badgeBg} ${plan.colorScheme.badgeText}`}>
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  {/* Price display */}
                  <div className="my-6 pb-6 border-b border-slate-100 dark:border-neutral-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
                        ${price.toFixed(2)}
                      </span>
                      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        / month
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-neutral-500 mt-1">
                      {price === 0 
                        ? 'Completely free, no credit card needed' 
                        : isAnnual 
                          ? `Billed annually at $${(price * 12).toFixed(2)} / year` 
                          : 'Billed on a flexible monthly basis'}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3.5 mb-8">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      What's Included:
                    </p>
                    {plan.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-start gap-3">
                        <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          plan.isPopular 
                            ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400' 
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-tight">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to Action Button */}
                <div>
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={loadingPlan === plan.id || isCurrent}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isCurrent 
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 dark:bg-neutral-800 dark:text-neutral-500 dark:border-neutral-700 cursor-not-allowed'
                        : plan.colorScheme.buttonBg
                    }`}
                  >
                    {loadingPlan === plan.id ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Upgrading...</span>
                      </>
                    ) : isCurrent ? (
                      <>
                        <Check className="w-4 h-4" /> Current Active Plan
                      </>
                    ) : (
                      <>
                        <span>{plan.cta}</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                  {plan.id !== 'free' && !isCurrent && (
                    <p className="text-[11px] text-center text-slate-400 dark:text-neutral-500 mt-2">
                      Instant activation • 14-day refund guarantee
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust & Guarantee Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-around gap-6 text-center md:text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">14-Day Money-Back Guarantee</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Not satisfied? Get a full refund within 14 days, no hassle.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Secure 256-Bit SSL Checkout</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Bank-level encrypted transactions powered by certified gateways.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Instant Plan Activation</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Credits and companion tools unlock in your account immediately.</p>
            </div>
          </div>
        </motion.div>

        {/* Core Value Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
          <FeatureCard
            icon={<Globe className="w-6 h-6 text-teal-600 dark:text-teal-400" />}
            title="Global Access"
            description="Generate customized travel blueprints across 120+ countries, domestic states, and local towns."
            delay={0.1}
          />
          <FeatureCard
            icon={<Sparkles className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />}
            title="Next-Gen AI Engine"
            description="Combines Groq LLaMA and Gemini intelligence for zero-wait itinerary formatting."
            delay={0.2}
          />
          <FeatureCard
            icon={<Check className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
            title="Smart Budget Savings"
            description="Accurate daily cost allocations, currency exchanges, and hotel recommendations tailored to your style."
            delay={0.3}
          />
        </div>

        {/* FAQ Accordion Section */}
        <section className="mt-20 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/50 px-3 py-1 rounded-full mb-3">
              <HelpCircle className="w-3.5 h-3.5" /> Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-5 text-left font-bold text-slate-800 dark:text-slate-100 flex justify-between items-center gap-4 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-slate-400 transition-transform duration-300 ${
                      openFaq === i ? 'rotate-180 text-teal-500' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-neutral-800">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Banner */}
        <div className="mt-20 text-center bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-blue-500/10 border border-teal-500/20 rounded-3xl p-10 max-w-4xl mx-auto">
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
            Ready to design your next trip?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto mb-6">
            Join travelers exploring the world with instant AI planning. Start completely free today.
          </p>
          <Link href="/create-new-trip">
            <button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-teal-500/25 hover:scale-105 active:scale-95 transition-all text-sm cursor-pointer">
              Start Planning for Free ✈️
            </button>
          </Link>
        </div>

      </div>

      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/80 dark:bg-neutral-900/60 backdrop-blur-sm border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 hover:border-teal-500/30 hover:shadow-lg dark:hover:shadow-neutral-950/50 transition-all duration-300 flex flex-col gap-4"
    >
      <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/20 flex items-center justify-center border border-teal-100/30 dark:border-teal-900/30">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-neutral-50 mb-1.5">{title}</h3>
        <p className="text-slate-500 dark:text-neutral-400 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
