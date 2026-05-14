'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCheck, ChevronDown, Copy, Download, FileText, Loader2, Sparkles } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { generateGeminiText } from '@/lib/gemini'

const docTypes = [
  'Acta de Junta de Accionistas',
  'Resolución del Directorio',
  'Reporte Fiduciario SMV',
  'Informe de Titulización',
  'Acuerdo de Accionistas',
  'Declaración de Cumplimiento',
]

export default function AIDocumentGenerator() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [selectedDoc, setSelectedDoc] = useState(docTypes[0])
  const [details, setDetails] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [generated, setGenerated] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('acres_gemini_key')
    if (saved) setApiKey(saved)
  }, [])

  const generateDocument = async () => {
    if (!details.trim()) return
    const key = apiKey || localStorage.getItem('acres_gemini_key') || ''
    if (!key) {
      setGenerated('Ingresa una API key de Gemini para activar el generador. También puedes usar esta pantalla como mockup de la propuesta.')
      return
    }

    setLoading(true)
    setGenerated('')
    const prompt = `Eres un experto en derecho corporativo peruano y juntas de accionistas. Genera un documento profesional del tipo "${selectedDoc}" para uso interno de ACRES dentro de GOBIA. Detalles: ${details}. Incluye encabezado, antecedentes, considerandos, acuerdos, cuadro de asistencia, quorum y votacion cuando aplique, observaciones sobre poderes y firmas. Responde en español.`

    try {
      const { text } = await generateGeminiText({
        apiKey: key,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        temperature: 0.3,
        maxOutputTokens: 2048,
      })
      setGenerated(text)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setGenerated(`Error al conectar con Gemini AI: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generated)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadDoc = () => {
    const blob = new Blob([generated], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedDoc.replace(/ /g, '_')}_GOBIA.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section id="documents" ref={ref} className="relative px-6 py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-acres-purple/5 to-transparent" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="mb-16 text-center">
          <div className="glass mb-6 inline-flex items-center gap-2 rounded-full border border-acres-purple/30 px-4 py-2">
            <Sparkles className="h-3 w-3 text-acres-violet" />
            <span className="font-mono text-xs uppercase tracking-widest text-acres-violet">Generador legal IA</span>
          </div>
          <h2 className="mb-4 font-display text-4xl font-800 leading-tight text-white md:text-6xl">
            Actas, acuerdos
            <br />
            <span className="gradient-text-cyan">y reportes de junta</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} className="glass space-y-5 rounded-2xl border border-acres-cyan/15 p-6">
            <div className="flex items-center gap-3 border-b border-acres-cyan/10 pb-4">
              <FileText className="h-5 w-5 text-acres-cyan" />
              <div>
                <h3 className="font-display text-sm font-700 text-white">Asistente legal IA</h3>
                <p className="font-mono text-[10px] text-slate-400">Compatible con Gemini API</p>
              </div>
            </div>

            <div>
              <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-slate-400">Tipo de documento</label>
              <div className="relative">
                <button onClick={() => setShowDropdown(!showDropdown)} className="glass flex w-full items-center justify-between rounded-xl border border-acres-cyan/20 px-4 py-3 text-sm text-white">
                  {selectedDoc}
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showDropdown && (
                  <div className="glass-strong absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-acres-cyan/20">
                    {docTypes.map((type) => (
                      <button key={type} onClick={() => { setSelectedDoc(type); setShowDropdown(false) }} className="w-full border-b border-acres-cyan/5 px-4 py-3 text-left text-sm text-slate-300 transition-all last:border-0 hover:bg-acres-cyan/5 hover:text-acres-cyan">
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-slate-400">Detalles y contexto</label>
              <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={5} placeholder="Ej: Junta del 15 de enero. Quorum 85%. Asistentes por Meet. Poderes validados: 12. Acuerdo 1 aprobado 94%, 2 votos en contra, 1 abstencion..." className="glass w-full resize-none rounded-xl border border-acres-cyan/20 px-4 py-3 font-mono text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-acres-cyan/40" />
            </div>

            <div>
              <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-slate-400">Gemini API Key</label>
              <input type="password" value={apiKey} onChange={(e) => { setApiKey(e.target.value); localStorage.setItem('acres_gemini_key', e.target.value) }} placeholder="AIza..." className="glass w-full rounded-xl border border-acres-cyan/20 px-4 py-3 font-mono text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-acres-cyan/40" />
            </div>

            <button onClick={generateDocument} disabled={loading || !details.trim()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-acres-cyan to-acres-purple py-4 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generando...</> : <><Sparkles className="h-4 w-4" /> Generar documento legal</>}
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} className="glass flex flex-col overflow-hidden rounded-2xl border border-acres-cyan/10">
            <div className="flex items-center justify-between border-b border-acres-cyan/10 px-6 py-4">
              <span className="font-mono text-xs text-slate-400">Vista previa - {selectedDoc}</span>
              {generated && (
                <div className="flex gap-2">
                  <button onClick={copyToClipboard} className="glass flex items-center gap-1 rounded-lg border border-acres-cyan/20 px-3 py-1.5 font-mono text-xs text-acres-cyan">
                    {copied ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? 'Copiado' : 'Copiar'}
                  </button>
                  <button onClick={downloadDoc} className="glass flex items-center gap-1 rounded-lg border border-acres-cyan/20 px-3 py-1.5 font-mono text-xs text-white">
                    <Download className="h-3 w-3" />
                    Descargar
                  </button>
                </div>
              )}
            </div>
            <div className="min-h-[420px] flex-1 overflow-y-auto p-6">
              {!generated && !loading && <div className="flex h-full flex-col items-center justify-center text-center text-sm text-slate-500">El borrador aparecerá aquí.</div>}
              {loading && <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-acres-cyan" /></div>}
              {generated && !loading && <pre className="whitespace-pre-wrap bg-transparent font-mono text-xs leading-relaxed text-slate-300">{generated}</pre>}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
