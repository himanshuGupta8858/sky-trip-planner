"use client";

import {
  Github,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter
} from "lucide-react";
import { motion } from "motion/react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Press", href: "#" },
    ],
    support: [
      { name: "Help Center", href: "#" },
      { name: "Contact Us", href: "/contact" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
    destinations: [
      { name: "Popular Cities", href: "#" },
      { name: "Adventure Tours", href: "#" },
      { name: "Beach Resorts", href: "#" },
      { name: "Mountain Trips", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Github, href: "https://github.com/himanshuGupta8858", label: "GitHub" },
    { icon: Twitter, href: "https://x.com/himanshuguptae", label: "Twitter" },
    { icon: Instagram, href: "https://www.instagram.com/himanshuguptae/", label: "Instagram" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/himanshugupta-tech/", label: "LinkedIn" },
  ];

  return (
    <footer className="relative w-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-neutral-200 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <motion.h3
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4"
              whileHover={{ scale: 1.05 }}
            >
              SkyTrip
            </motion.h3>
            <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
              Your AI-powered travel companion. Discover amazing destinations and plan your perfect trip with ease.
            </p>
            <div className="space-y-3">
              <motion.a
                href="mailto:info@skytrip.com"
                className="flex items-center gap-2 text-neutral-400 hover:text-blue-400 transition-colors text-sm"
                whileHover={{ x: 5 }}
              >
                <Mail className="w-4 h-4" />
                <span>info@skytrip.com</span>
              </motion.a>
              <motion.a
                href="tel:+1234567890"
                className="flex items-center gap-2 text-neutral-400 hover:text-blue-400 transition-colors text-sm"
                whileHover={{ x: 5 }}
              >
                <Phone className="w-4 h-4" />
                <span>+1 (234) 567-890</span>
              </motion.a>
              <motion.div
                className="flex items-center gap-2 text-neutral-400 text-sm"
                whileHover={{ x: 5 }}
              >
                <MapPin className="w-4 h-4" />
                <span>Varanasi, Uttar Pradesh, India</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <motion.a
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm flex items-center group"
                    whileHover={{ x: 5 }}
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 mr-0 group-hover:mr-2" />
                    {link.name}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <motion.a
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm flex items-center group"
                    whileHover={{ x: 5 }}
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 mr-0 group-hover:mr-2" />
                    {link.name}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Destinations Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-white">Destinations</h4>
            <ul className="space-y-3">
              {footerLinks.destinations.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <motion.a
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm flex items-center group"
                    whileHover={{ x: 5 }}
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 mr-0 group-hover:mr-2" />
                    {link.name}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Social Media & Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-neutral-700/50 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Media */}
            <div className="flex items-center gap-4">
              <span className="text-neutral-400 text-sm">Follow us:</span>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 rounded-full bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 flex items-center justify-center text-neutral-400 hover:text-white hover:border-blue-500/50 transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Newsletter */}
            <motion.div
              className="flex-1 max-w-md"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <motion.button
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-500 hover:to-purple-500 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="border-t border-neutral-700/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-neutral-500 text-sm text-center md:text-left">
            © {currentYear} SkyTrip. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-neutral-500 text-sm">
            <Globe className="w-4 h-4" />
            <span>Made with ❤️ for travelers</span>
          </div>
        </motion.div>
      </div>

      {/* Animated bottom border */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
    </footer>
  );
}

