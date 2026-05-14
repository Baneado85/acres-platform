'use client'

import { FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react'
import { useInView } from 'react-intersection-observer'

export default function ContactSection() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', message: '', type: 'demo' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <section id="contact" ref={ref} className="relative px-6 py-32">
      <div className="cyber-grid-bg absolute inset-0 opacity-20" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="mb-16 text-center">
          <div className="glass mb-6 inline-flex items-center gap-2 rounded-full border border-acres-cyan/20 px-4 py-2">
            <Mail className="h-3 w-3 text-acres-cyan" />
            <span className="font-mono text-xs uppercase tracking-widest text-acres-cyan">Contacto empresarial</span>
          </div>
          <h2 className="mb-4 font-display text-4xl font-800 leading-tight text-white md:text-6xl">
            Comienza la
            <br />
            <span className="gradient-text-cyan">automatización de juntas</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} className="glass rounded-2xl border border-acres-cyan/15 p-8">
            {submitted ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center gap-6 text-center">
                <CheckCircle className="h-16 w-16 text-green-400" />
                <div>
                  <h3 className="mb-2 font-display text-2xl font-800 text-white">Mensaje enviado</h3>
                  <p className="text-sm text-slate-400">El equipo puede usar este flujo como demo de captura de leads.</p>
                </div>
                <button onClick={() => setSubmitted(false)} className="font-mono text-sm text-acres-cyan">Enviar otro mensaje</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="mb-6 font-display text-lg font-700 text-white">Solicitar demo / consultoría</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['demo', 'consultoría', 'piloto', 'soporte'].map((type) => (
                    <button key={type} type="button" onClick={() => setForm((prev) => ({ ...prev, type }))} className={`rounded-xl border px-3 py-2.5 text-center font-mono text-xs transition-all ${form.type === type ? 'border-acres-cyan/40 bg-acres-cyan/20 text-acres-cyan' : 'glass border-acres-cyan/10 text-slate-400'}`}>
                      {type}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input required value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Nombre" className="glass rounded-xl border border-acres-cyan/20 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none" />
                  <input required value={form.company} onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))} placeholder="Empresa" className="glass rounded-xl border border-acres-cyan/20 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none" />
                  <input required type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email" className="glass rounded-xl border border-acres-cyan/20 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none" />
                  <input value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Teléfono" className="glass rounded-xl border border-acres-cyan/20 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none" />
                </div>
                <textarea required value={form.message} onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))} placeholder="Cuéntanos sobre las juntas, accionistas, documentos y dolores actuales..." rows={5} className="glass w-full resize-none rounded-xl border border-acres-cyan/20 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none" />
                <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-acres-cyan to-acres-purple py-4 text-sm font-semibold text-white disabled:opacity-50">
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</> : <><Send className="h-4 w-4" /> Enviar solicitud</>}
                </button>
              </form>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} className="space-y-6">
            {[
              { icon: MapPin, label: 'Oficina principal', value: 'Lima, Perú' },
              { icon: Mail, label: 'Email empresarial', value: 'contacto@acres.pe' },
              { icon: Phone, label: 'Teléfono', value: '+51 1 628 5000' },
            ].map((info) => (
              <div key={info.label} className="glass flex items-start gap-4 rounded-2xl border border-acres-cyan/15 p-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-acres-cyan/10">
                  <info.icon className="h-5 w-5 text-acres-cyan" />
                </div>
                <div>
                  <div className="mb-1 font-mono text-xs uppercase tracking-wider text-slate-400">{info.label}</div>
                  <div className="text-sm text-white">{info.value}</div>
                </div>
              </div>
            ))}
            <div className="glass rounded-2xl border border-acres-gold/20 p-6">
              <div className="mb-3 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-acres-gold" />
                <div className="font-display text-sm font-700 text-white">Revisión legal obligatoria</div>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                La IA acelera el trabajo operativo, pero los abogados validan quórum, votos, acuerdos y documentos antes de cualquier emisión final.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
