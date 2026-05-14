'use client'

import { ArrowRight, Cpu, Play, Shield, TrendingUp, Users } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: 85, suffix: '%', label: 'Reducción trabajo manual', icon: TrendingUp },
  { value: 70, suffix: '%', label: 'Flujos legales más rápidos', icon: Cpu },
  { value: 95, suffix: '%', label: 'Trazabilidad de votos', icon: Shield },
  { value: 100, suffix: '%', label: 'Evidencia auditable', icon: Users },
]

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      let start = 0
      const step = (timestamp: number) => {
        if (!start) start = timestamp
        const progress = Math.min((timestamp - start) / 1800, 1)
        setCount(Math.floor(progress * target))
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
      observer.disconnect()
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function HeroSection() {
  return (
    <section id="platform" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-28">
      <div className="cyber-grid-bg absolute inset-0 opacity-30" />
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.16),transparent_62%)]" />

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <div className="glass mb-8 inline-flex items-center gap-2 rounded-full border border-acres-cyan/20 px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-acres-cyan" />
          <span className="font-mono text-xs uppercase tracking-widest text-acres-cyan">Software interno para ACRES</span>
        </div>

        <h1 className="mb-6 font-display text-5xl font-800 leading-none tracking-tight text-white md:text-7xl lg:text-8xl">
          GOBIA
          <br />
          <span className="gradient-text-cyan">Juntas automatizadas</span>
          <br />
          <span className="text-4xl text-slate-300 md:text-5xl lg:text-6xl">para accionistas de ACRES</span>
        </h1>

        <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-slate-400 md:text-xl">
          Plataforma interna para que ACRES gestione juntas virtuales por Google Meet: asistencia, poderes, quórum, votaciones, acuerdos, transcripción, actas y evidencia sellada en blockchain.
        </p>

        <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href="#contact" className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-acres-cyan to-acres-purple px-8 py-4 text-sm font-semibold text-white shadow-2xl shadow-acres-cyan/30 transition-all hover:opacity-90">
            Presentar propuesta
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a href="#documents" className="glass group flex items-center gap-2 rounded-xl border border-acres-cyan/20 px-8 py-4 text-sm font-medium text-acres-cyan transition-all hover:bg-acres-cyan/10">
            <Play className="h-4 w-4" />
            Ver flujo de junta
          </a>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className="glass group rounded-2xl border border-acres-cyan/10 p-6 transition-all hover:border-acres-cyan/30 hover:shadow-lg hover:shadow-acres-cyan/10">
              <div className="mb-3 flex items-center justify-between">
                <stat.icon className="h-5 w-5 text-acres-cyan opacity-70" />
                <div className="h-2 w-2 rounded-full bg-acres-cyan" />
              </div>
              <div className="mb-1 font-display text-3xl font-800 text-white">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs leading-tight text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-8 top-1/2 hidden h-72 w-72 -translate-y-1/2 xl:block">
        <div className="absolute inset-0 animate-spin-slow rounded-full border border-acres-cyan/20" />
        <div className="absolute inset-8 rounded-full border border-acres-purple/20" />
        <div className="absolute inset-20 flex items-center justify-center rounded-full border border-acres-cyan/30 bg-gradient-to-br from-acres-cyan/20 to-acres-purple/20">
          <Cpu className="h-12 w-12 text-acres-cyan" />
        </div>
      </div>
    </section>
  )
}
