'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Home, BookOpen, Target, User, Menu, X, Brain, Mountain, Users, Bot, Calendar, Zap } from 'lucide-react'
import { AnimatedLogo } from './icons/AnimatedLogo'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/about', label: 'About', icon: User },
    { href: '/journey', label: 'Journey', icon: Mountain },
    { href: '/blog', label: 'Blog', icon: BookOpen },
    { href: '/training', label: 'Training', icon: Target },
    { href: '/ai-search', label: 'AI Coach', icon: Brain },
    { href: '/automation', label: 'Automation', icon: Bot },
  ]

  return (
    <nav className="backdrop-mountain border-b border-slate-200/60 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 group brand"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-8 h-8 gradient-summit rounded-xl flex items-center justify-center group-hover:animate-glow transition-all duration-300 relative overflow-hidden">
              <AnimatedLogo 
                size={20} 
                variant="minimal"
                animateOnScroll={false}
                colors={{
                  primary: '#ffffff',
                  secondary: '#fbbf24',
                  accent: '#ffffff'
                }}
              />
            </div>
            <span className="text-xl font-semibold text-slate-900 tracking-tight font-montserrat">
              Summit Chronicles
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all duration-200"
              >
                <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-colors"
          >
            {isOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-slate-200/60">
            <div className="flex flex-col space-y-2">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all duration-200"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-base font-medium">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}