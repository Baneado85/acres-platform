'use client'

import { motion } from 'framer-motion'
import { Award, BarChart2, Clock, Shield, TrendingDown, Zap } from 'lucide-react'
import { useInView } from 'react-intersection-observer'

const results = [
  { icon: TrendingDown, metric: '85%', label: 'Menos trabajo manual', detail: 'Menos tiempo escuchando grabaciones y armando cuadros a mano.' },
  { icon: Zap, metric: '70%', label: 'Flujos más rápidos', detail: 'Actas y acuerdos pasan de días a horas con revisión legal.' },
  { icon: Shield, metric: '95%', label: 'Precisión asistida', detail: 'Conteo auditable con validación humana obligatoria.' },
  { icon: Clock, metric: '3x', label: 'Cierre documental', detail: 'Más velocidad para cerrar paquetes post junta.' },
  { icon: Award, metric: '99%', label: 'Trazabilidad', detail: 'Cada dato queda asociado a sesion, asistente, poder, voto, documento y hash.' },
  { icon: BarChart2, metric: '40%', label: 'Productividad', detail: 'Equipos legales enfocan más tiempo en criterio y menos en transcripción.' },
]

export default function CaseStudies() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  return (
    <section id="cases" ref={ref} className="relative px-6 py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-acres-navy/30 to-transparent" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="mb-20 text-center">
          <div className="glass mb-6 inline-flex items-center gap-2 rounded-full border border-acres-cyan/20 px-4 py-2">
            <Award className="h-3 w-3 text-acres-cyan" />
            <span className="font-mono text-xs uppercase tracking-widest text-acres-cyan">Impacto esperado</span>
          </div>
          <h2 className="mb-4 font-display text-4xl font-800 leading-tight text-white md:text-6xl">
            Impacto para
            <br />
            <span className="gradient-text-cyan">los abogados de ACRES</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {results.map((result, i) => (
            <motion.div key={result.label} initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: i * 0.08 }} className="glass rounded-2xl border border-acres-cyan/20 p-6 transition-all hover:shadow-xl hover:shadow-acres-cyan/10">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-acres-cyan/10">
                <result.icon className="h-5 w-5 text-acres-cyan" />
              </div>
              <div className="mb-2 font-display text-4xl font-800 text-acres-cyan md:text-5xl">{result.metric}</div>
              <div className="mb-2 font-display text-sm font-700 text-white">{result.label}</div>
              <p className="text-xs leading-relaxed text-slate-400">{result.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
