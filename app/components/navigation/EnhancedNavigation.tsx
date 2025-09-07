"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Bars3Icon,
  XMarkIcon,
  MapPinIcon,
  UserIcon,
  MapIcon,
  BookOpenIcon,
  PhoneIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

const navigation = [
  {
    name: "My Story",
    href: "/my-story",
    icon: UserIcon,
    description: "Personal journey into mountaineering"
  },
  {
    name: "The Journey", 
    href: "/the-journey",
    icon: MapPinIcon,
    description: "Seven Summits expedition progress"
  },
  {
    name: "Blogs",
    href: "/blogs", 
    icon: BookOpenIcon,
    description: "Real expedition stories and lessons"
  },
  {
    name: "Training",
    href: "/training",
    icon: MapIcon,
    description: "Live training data and analytics"
  },
  {
    name: "Sponsorship",
    href: "/sponsorship",
    icon: SparklesIcon,
    description: "Partner with me for expeditions"
  },
  {
    name: "Connect",
    href: "/connect",
    icon: PhoneIcon,
    description: "Work together and partnerships"
  },
  {
    name: "Ask Sunith",
    href: "/ask-sunith",
    icon: SparklesIcon,
    description: "AI-powered mountaineering advice",
    special: true
  }
];

export default function EnhancedNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-2xl' 
            : 'bg-black/60 backdrop-blur-md border-b border-white/5'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group relative">
            <motion.div
              className="text-lg sm:text-xl font-bold tracking-wide text-white"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Summit Chronicles
              <motion.div
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-summitGold group-hover:w-full transition-all duration-300"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-1 text-sm font-medium">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group relative"
                >
                  <motion.div
                    className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                      isActive
                        ? item.special 
                          ? 'bg-summitGold text-black'
                          : 'bg-white/10 text-white'
                        : item.special
                          ? 'bg-summitGold/10 text-summitGold border border-summitGold/20'
                          : 'text-white/80 hover:text-summitGold hover:bg-white/5'
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center gap-2">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <item.icon className="w-4 h-4" />
                      </motion.div>
                      {item.name}
                    </span>

                    {/* Active indicator */}
                    {isActive && !item.special && (
                      <motion.div
                        className="absolute -bottom-1 left-1/2 w-1 h-1 bg-summitGold rounded-full"
                        layoutId="activeIndicator"
                        style={{ transform: "translateX(-50%)" }}
                      />
                    )}

                    {/* Hover tooltip */}
                    <motion.div
                      className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-black/90 backdrop-blur-sm text-white text-xs rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0, y: -10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                    >
                      {item.description}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45" />
                    </motion.div>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2 text-white hover:text-summitGold transition-colors duration-300 relative"
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </motion.div>
          </motion.button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-black/95 backdrop-blur-xl border-l border-white/10 z-50 lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="p-6 pt-20">
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, staggerChildren: 0.1 }}
                >
                  {navigation.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className="group block"
                          onClick={() => setIsOpen(false)}
                        >
                          <motion.div
                            className={`p-4 rounded-2xl border transition-all duration-300 ${
                              isActive
                                ? item.special
                                  ? 'bg-summitGold/20 border-summitGold text-summitGold'
                                  : 'bg-white/10 border-white/20 text-white'
                                : item.special
                                  ? 'bg-summitGold/5 border-summitGold/20 text-summitGold hover:bg-summitGold/10'
                                  : 'border-white/10 text-white/80 hover:text-summitGold hover:bg-white/5 hover:border-summitGold/30'
                            }`}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <motion.div
                                whileHover={{ scale: 1.2, rotate: 360 }}
                                transition={{ duration: 0.5 }}
                              >
                                <item.icon className="w-5 h-5" />
                              </motion.div>
                              <span className="font-medium">{item.name}</span>
                              {isActive && (
                                <motion.div
                                  className="w-2 h-2 bg-summitGold rounded-full ml-auto"
                                  layoutId="mobileActiveIndicator"
                                />
                              )}
                            </div>
                            <p className="text-sm opacity-70 ml-8">
                              {item.description}
                            </p>
                          </motion.div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Contact Info */}
                <motion.div
                  className="mt-8 pt-8 border-t border-white/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-center">
                    <p className="text-white/60 text-sm mb-2">Follow the journey</p>
                    <p className="text-summitGold font-medium">3 of 7 Summits Complete</p>
                    <div className="w-24 h-1.5 bg-white/10 rounded-full mx-auto mt-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-summitGold to-yellow-400 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${Math.round((3/7) * 100)}%` }}
                        transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}