'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Menu, X, Zap } from 'lucide-react'
import Link from 'next/link'

const navLinks = [
  {
    label: 'Plataforma',
    href: '#platform',
    children: [
      { label: 'IA para Gobernanza', href: '#platform' },
      { label: 'Documentos Legales', href: '#documents' },
      { label: 'Analytics', href: '#analytics' },
    ],
  },
  { label: 'Módulos', href: '#modules' },
  { label: 'Automatización', href: '#automation' },
  { label: 'Precios', href: '#pricing' },
  { label: 'Casos', href: '#cases' },
  { label: 'Contacto', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-strong border-b border-acres-cyan/10 shadow-2xl shadow-acres-cyan/5' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-acres-cyan to-acres-purple">
                <Zap className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-acres-cyan to-acres-purple opacity-30 blur-md transition-opacity group-hover:opacity-60" />
            </div>
            <div>
              <div className="font-display text-sm font-800 uppercase leading-none tracking-widest text-white">ACRES</div>
              <div className="mt-0.5 font-mono text-[9px] uppercase leading-none tracking-[0.2em] text-acres-cyan/70">
                Sociedad Titulizadora
              </div>
            </div>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a href={link.href} className="group flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-acres-cyan">
                  {link.label}
                  {link.children && <ChevronDown className="h-3 w-3 opacity-50 transition-transform group-hover:opacity-100" />}
                </a>
                <AnimatePresence>
                  {link.children && activeDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="glass-strong absolute left-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-acres-cyan/15 shadow-xl shadow-acres-cyan/10"
                    >
                      {link.children.map((child) => (
                        <a key={child.label} href={child.href} className="block border-b border-acres-cyan/5 px-4 py-3 text-sm text-slate-300 transition-all last:border-0 hover:bg-acres-cyan/5 hover:text-acres-cyan">
                          {child.label}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button className="rounded-lg border border-acres-cyan/30 px-4 py-2 text-sm font-medium text-acres-cyan transition-all hover:bg-acres-cyan/10">
              Iniciar Sesión
            </button>
            <a href="#contact" className="rounded-lg bg-gradient-to-r from-acres-cyan to-acres-purple px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-acres-cyan/20 transition-all hover:opacity-90">
              Demo Empresarial
            </a>
          </div>

          <button className="p-2 text-slate-300 transition-colors hover:text-acres-cyan lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Abrir menú">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass-strong border-t border-acres-cyan/10 lg:hidden">
            <div className="space-y-1 px-6 py-4">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-acres-cyan/5 hover:text-acres-cyan" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
