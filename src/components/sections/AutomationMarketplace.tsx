'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart2, Bot, CheckCircle, Clock, FileText, Search, Shield, Star, TrendingUp, Users, Workflow, Zap } from 'lucide-react'
import { useInView } from 'react-intersection-observer'

const categories = ['Todos', 'Gobernanza', 'Legal IA', 'Compliance', 'Analytics', 'Fiduciaria', 'Mercados']
const tools = [
  { icon: Bot, name: 'GOBIA Copilot', category: 'Gobernanza', desc: 'Asistente interno para preguntas sobre sesiones, acuerdos, votos y evidencias.', rating: 4.9, users: 'ACRES', tag: 'Core' },
  { icon: Users, name: 'Meet Intake', category: 'Gobernanza', desc: 'Importa asistentes, grabaciones y transcripciones desde Google Meet.', rating: 4.9, users: 'Meet', tag: 'Entrada' },
  { icon: Shield, name: 'PowerCheck', category: 'Compliance', desc: 'Valida poderes, vigencias, facultades y representacion antes de votar.', rating: 4.8, users: 'Legal', tag: 'Poderes' },
  { icon: CheckCircle, name: 'Quorum Engine', category: 'Gobernanza', desc: 'Calcula quorum por capital representado y reglas de la junta.', rating: 4.8, users: 'Junta', tag: 'Quorum' },
  { icon: FileText, name: 'LegalDraft', category: 'Legal IA', desc: 'Genera borradores de actas, acuerdos y constancias para revision legal.', rating: 4.8, users: 'Docs', tag: 'Actas' },
  { icon: Workflow, name: 'AgreementFlow', category: 'Fiduciaria', desc: 'Gestiona tareas posteriores: responsables, plazos, firmas y cierre documental.', rating: 4.7, users: 'Flow', tag: 'Post' },
  { icon: BarChart2, name: 'Vote Ledger', category: 'Analytics', desc: 'Cuenta votos ponderados y produce reportes por accionista, representante y acuerdo.', rating: 4.9, users: 'Votos', tag: 'Conteo' },
  { icon: TrendingUp, name: 'ChainProof', category: 'Compliance', desc: 'Registra hashes de evidencia en blockchain para integridad y auditoria.', rating: 4.6, users: 'Hash', tag: 'Blockchain' },
  { icon: Clock, name: 'Session Timeline', category: 'Analytics', desc: 'Crea una linea de tiempo de intervenciones, votaciones, acuerdos y documentos.', rating: 4.5, users: 'Hist', tag: 'Timeline' },
]

export default function AutomationMarketplace() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [search, setSearch] = useState('')
  const filtered = tools.filter((tool) => (activeCategory === 'Todos' || tool.category === activeCategory) && `${tool.name} ${tool.desc}`.toLowerCase().includes(search.toLowerCase()))

  return (
    <section id="automation" ref={ref} className="relative px-6 py-32">
      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="mb-16 text-center">
          <div className="glass mb-6 inline-flex items-center gap-2 rounded-full border border-acres-cyan/20 px-4 py-2">
            <Zap className="h-3 w-3 text-acres-cyan" />
            <span className="font-mono text-xs uppercase tracking-widest text-acres-cyan">Modulos automatizados de GOBIA</span>
          </div>
          <h2 className="mb-4 font-display text-4xl font-800 leading-tight text-white md:text-6xl">
            Varias automatizaciones
            <br />
            <span className="gradient-text-cyan">en una sola plataforma</span>
          </h2>
        </motion.div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar herramientas IA..." className="glass w-full rounded-xl border border-acres-cyan/20 py-3 pl-11 pr-4 font-mono text-sm text-white placeholder-slate-500 focus:outline-none" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`rounded-xl border px-4 py-2 font-mono text-xs transition-all ${activeCategory === cat ? 'border-acres-cyan/40 bg-acres-cyan/20 text-acres-cyan' : 'glass border-acres-cyan/10 text-slate-400 hover:text-white'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool, i) => (
            <motion.div key={tool.name} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.05 }} className="glass group rounded-2xl border border-acres-cyan/15 p-6 transition-all hover:border-acres-cyan/40 hover:shadow-xl hover:shadow-acres-cyan/10">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-acres-cyan/10 text-acres-cyan">
                  <tool.icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-acres-cyan/10 px-2 py-1 font-mono text-[9px] text-acres-cyan">{tool.tag}</span>
              </div>
              <h3 className="mb-2 font-display text-sm font-700 text-white group-hover:text-acres-cyan">{tool.name}</h3>
              <p className="mb-4 text-xs leading-relaxed text-slate-400">{tool.desc}</p>
              <div className="flex items-center justify-between border-t border-acres-cyan/10 pt-4">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-acres-gold text-acres-gold" />
                  <span className="font-mono text-xs text-white">{tool.rating}</span>
                  <span className="font-mono text-[10px] text-slate-500">({tool.users})</span>
                </div>
                <button className="font-mono text-xs text-acres-cyan opacity-0 transition-opacity group-hover:opacity-100">Instalar</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
