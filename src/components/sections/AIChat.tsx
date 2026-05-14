'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bot, Loader2, Minimize2, Send, User, X } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SYSTEM_CONTEXT = `Eres el Asistente Corporativo de IA de ACRES Sociedad Titulizadora. Ayudas con gobernanza corporativa, juntas de accionistas, conteo de votos, generación de documentos, fideicomisos, cumplimiento SMV y automatización de procesos. Responde siempre en español, de forma profesional, concisa y útil.`

export default function AIChat() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Bienvenido al asistente ACRES IA. Puedo ayudarte con juntas, quórum, votaciones, acuerdos y borradores legales.',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [showApiInput, setShowApiInput] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const saved = localStorage.getItem('acres_gemini_key')
    if (saved) setApiKey(saved)
    else setShowApiInput(true)
  }, [])

  const saveApiKey = (key: string) => {
    setApiKey(key)
    localStorage.setItem('acres_gemini_key', key)
    setShowApiInput(false)
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    if (!apiKey) {
      setShowApiInput(true)
      return
    }

    const prompt = input.trim()
    setMessages((prev) => [...prev, { role: 'user', content: prompt, timestamp: new Date() }])
    setInput('')
    setLoading(true)

    try {
      const history = messages.slice(1).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }))

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_CONTEXT }] },
          contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error.message)
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude procesar la consulta.'
      setMessages((prev) => [...prev, { role: 'assistant', content: aiText, timestamp: new Date() }])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setMessages((prev) => [...prev, { role: 'assistant', content: `Error al conectar con Gemini AI: ${message}`, timestamp: new Date() }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.4, type: 'spring' }}
        onClick={() => { setOpen(true); setMinimized(false) }}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-acres-cyan to-acres-purple shadow-2xl shadow-acres-cyan/30 transition-transform hover:scale-110 ${open ? 'hidden' : ''}`}
        aria-label="Abrir chat IA"
      >
        <Bot className="h-6 w-6 text-white" />
        <div className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-acres-black bg-green-400" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }} className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
            <div className="glass-strong overflow-hidden rounded-2xl border border-acres-cyan/20 shadow-2xl shadow-acres-cyan/10">
              <div className="flex items-center justify-between border-b border-acres-cyan/10 bg-gradient-to-r from-acres-cyan/10 to-acres-purple/10 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-acres-cyan to-acres-purple">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-display text-sm font-700 text-white">Asistente ACRES IA</div>
                    <div className="font-mono text-[10px] text-acres-cyan">Gemini AI</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowApiInput(true)} className="p-1 font-mono text-xs text-slate-400 hover:text-acres-cyan">KEY</button>
                  <button onClick={() => setMinimized(!minimized)} className="p-1 text-slate-400 hover:text-acres-cyan" aria-label="Minimizar">
                    <Minimize2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setOpen(false)} className="p-1 text-slate-400 hover:text-red-400" aria-label="Cerrar">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {showApiInput && (
                <div className="border-b border-acres-cyan/10 bg-acres-navy/50 p-4">
                  <p className="mb-2 font-mono text-xs text-slate-400">Ingresa tu Gemini API Key:</p>
                  <div className="flex gap-2">
                    <input type="password" placeholder="AIza..." className="flex-1 rounded-lg border border-acres-cyan/20 bg-acres-black/60 px-3 py-2 font-mono text-xs text-white focus:outline-none" onKeyDown={(e) => { if (e.key === 'Enter') saveApiKey((e.target as HTMLInputElement).value) }} />
                    <button onClick={(e) => { const inputEl = e.currentTarget.previousElementSibling as HTMLInputElement; if (inputEl.value) saveApiKey(inputEl.value) }} className="rounded-lg bg-acres-cyan/20 px-3 py-2 font-mono text-xs text-acres-cyan">
                      OK
                    </button>
                  </div>
                </div>
              )}

              {!minimized && (
                <>
                  <div className="h-80 space-y-4 overflow-y-auto p-4">
                    {messages.map((msg, i) => (
                      <div key={`${msg.role}-${i}`} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${msg.role === 'assistant' ? 'bg-gradient-to-br from-acres-cyan to-acres-purple' : 'border border-acres-cyan/20 bg-acres-navy'}`}>
                          {msg.role === 'assistant' ? <Bot className="h-3.5 w-3.5 text-white" /> : <User className="h-3.5 w-3.5 text-acres-cyan" />}
                        </div>
                        <div className={`flex max-w-[80%] flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`rounded-xl px-4 py-3 text-xs leading-relaxed ${msg.role === 'assistant' ? 'glass border border-acres-cyan/10 text-slate-200' : 'border border-acres-cyan/20 bg-gradient-to-r from-acres-cyan/20 to-acres-purple/20 text-white'}`}>
                            {msg.content}
                          </div>
                          <span className="px-1 font-mono text-[9px] text-slate-600">
                            {msg.timestamp.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-acres-cyan to-acres-purple">
                          <Bot className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div className="glass rounded-xl border border-acres-cyan/10 px-4 py-3">
                          <Loader2 className="h-4 w-4 animate-spin text-acres-cyan" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="border-t border-acres-cyan/10 p-4">
                    <div className="flex gap-2">
                      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()} placeholder="Consulta sobre gobernanza..." className="flex-1 rounded-xl border border-acres-cyan/20 bg-acres-black/60 px-4 py-2.5 font-mono text-xs text-white placeholder-slate-500 focus:outline-none" />
                      <button onClick={sendMessage} disabled={loading || !input.trim()} className="rounded-xl bg-gradient-to-r from-acres-cyan to-acres-purple p-2.5 transition-opacity disabled:opacity-40">
                        <Send className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
