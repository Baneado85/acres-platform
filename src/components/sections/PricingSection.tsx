'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Building2, Check, Crown, Zap } from 'lucide-react'
import { useInView } from 'react-intersection-observer'

const plans = [
  {
    icon: Zap,
    name: 'Servicio por junta',
    tagline: 'Procesar una sesion real de ACRES',
    priceMonthly: 1890,
    priceYearly: 15990,
    features: ['Procesamiento de una junta virtual', 'Transcripcion y resumen ejecutivo', 'Cuadro de asistencia y quorum', 'Revision de poderes cargados', 'Conteo de votos por participacion', 'Borrador de acta y acuerdos'],
  },
  {
    icon: Building2,
    name: 'Professional',
    tagline: 'GOBIA operativo para varias juntas',
    priceMonthly: 5490,
    priceYearly: 47990,
    popular: true,
    features: ['Base de accionistas y poderes', 'Documentos IA ilimitados', 'Dashboard de sesiones', 'Integracion Google Meet/Drive', 'Votacion dentro de plataforma', 'Registro blockchain de evidencias'],
  },
  {
    icon: Crown,
    name: 'Enterprise Governance',
    tagline: 'Plataforma interna completa para ACRES',
    priceMonthly: 0,
    priceYearly: 0,
    features: ['Usuarios internos ilimitados', 'IA corporativa personalizada', 'Integracion documental y legal', 'API empresarial', 'SLA y seguridad avanzada', 'Capacitacion a abogados y operaciones'],
  },
]

export default function PricingSection() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [yearly, setYearly] = useState(true)

  return (
    <section id="pricing" ref={ref} className="relative px-6 py-32">
      <div className="cyber-grid-bg absolute inset-0 opacity-20" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="mb-16 text-center">
          <div className="glass mb-6 inline-flex items-center gap-2 rounded-full border border-acres-gold/20 px-4 py-2">
            <Crown className="h-3 w-3 text-acres-gold" />
            <span className="font-mono text-xs uppercase tracking-widest text-acres-gold">Modelo comercial</span>
          </div>
          <h2 className="mb-4 font-display text-4xl font-800 leading-tight text-white md:text-6xl">
            Formas de vender GOBIA
            <br />
            <span className="gradient-text-cyan">a ACRES sin empezar gigante</span>
          </h2>
          <div className="glass inline-flex items-center gap-3 rounded-xl border border-acres-cyan/20 p-1">
            <button onClick={() => setYearly(false)} className={`rounded-lg px-5 py-2 text-sm font-medium ${!yearly ? 'bg-acres-cyan/20 text-acres-cyan' : 'text-slate-400'}`}>Mensual</button>
            <button onClick={() => setYearly(true)} className={`rounded-lg px-5 py-2 text-sm font-medium ${yearly ? 'bg-acres-cyan/20 text-acres-cyan' : 'text-slate-400'}`}>Anual</button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => {
            const price = plan.priceMonthly === 0 ? null : yearly ? Math.floor(plan.priceYearly / 12) : plan.priceMonthly
            return (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.12 }} className={`glass relative rounded-2xl border p-8 transition-all hover:shadow-2xl ${plan.popular ? 'scale-105 border-acres-purple/50 shadow-acres-purple/20' : 'border-acres-cyan/20 shadow-acres-cyan/10'}`}>
                {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-acres-purple to-acres-violet px-5 py-2 text-xs font-700 text-white">Más recomendable</div>}
                <plan.icon className="mb-4 h-10 w-10 rounded-xl bg-acres-cyan/10 p-2 text-acres-cyan" />
                <h3 className="mb-1 font-display text-xl font-800 text-white">{plan.name}</h3>
                <p className="mb-8 text-sm text-slate-400">{plan.tagline}</p>
                <div className="mb-8 border-b border-acres-cyan/10 pb-8">
                  {price === null ? (
                    <div>
                      <div className="mb-1 font-display text-3xl font-800 text-white">A medida</div>
                      <p className="font-mono text-xs text-acres-gold">Cotización enterprise</p>
                    </div>
                  ) : (
                    <div>
                      <span className="font-mono text-sm text-slate-400">S/. </span>
                      <span className="font-display text-5xl font-800 text-white">{price.toLocaleString('es-PE')}</span>
                      <span className="text-sm text-slate-400"> /mes</span>
                    </div>
                  )}
                </div>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-acres-cyan" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-acres-cyan to-acres-purple py-4 text-sm font-semibold text-white transition-all hover:opacity-90">
                  Solicitar propuesta
                  <ArrowRight className="h-4 w-4" />
                </a>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
