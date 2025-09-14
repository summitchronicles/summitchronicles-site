'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Home, BookOpen, Target, User, Menu, X } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/blog', label: 'Journal', icon: BookOpen },
    { href: '/training', label: 'Training', icon: Target },
    { href: '/about', label: 'About', icon: User },
  ]

  return (
    <nav className="backdrop-mountain border-b border-slate-200/60 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 group"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-8 h-8 gradient-summit rounded-xl flex items-center justify-center group-hover:animate-glow transition-all duration-300 relative overflow-hidden">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L3 21h18L12 2zm0 4.5L18.5 19H5.5L12 6.5z"/>
              </svg>
            </div>
            <span className="text-xl font-semibold text-slate-900 tracking-tight">
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