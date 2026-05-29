'use client'

import { useMemo, useState } from 'react'
import {
  BadgeCheck,
  Bot,
  CheckCircle2,
  ClipboardList,
  FileText,
  Gavel,
  Hash,
  Loader2,
  LockKeyhole,
  Mic,
  Send,
  ShieldCheck,
  Users,
  Vote,
} from 'lucide-react'

type Attendee = {
  id: number
  name: string
  role: string
  shares: number
  present: boolean
  powerStatus: 'valid' | 'pending' | 'not_required'
  vote: 'favor' | 'against' | 'abstain' | 'pending'
}

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

const initialAttendees: Attendee[] = [
  { id: 1, name: 'Inversiones Andina SAC', role: 'Accionista', shares: 3200, present: true, powerStatus: 'not_required', vote: 'favor' },
  { id: 2, name: 'Fondo Horizonte', role: 'Accionista', shares: 2500, present: true, powerStatus: 'valid', vote: 'favor' },
  { id: 3, name: 'Maria Torres', role: 'Representante', shares: 1400, present: true, powerStatus: 'pending', vote: 'pending' },
  { id: 4, name: 'Grupo Pacifico', role: 'Accionista', shares: 1800, present: false, powerStatus: 'not_required', vote: 'pending' },
  { id: 5, name: 'Carlos Rivas', role: 'Apoderado', shares: 1100, present: true, powerStatus: 'valid', vote: 'against' },
]

const agenda = [
  'Verificacion de asistencia y poderes',
  'Aprobacion de estados financieros',
  'Distribucion de dividendos',
  'Delegacion de facultades para ejecucion de acuerdos',
]

function statusLabel(status: Attendee['powerStatus']) {
  if (status === 'valid') return 'Poder valido'
  if (status === 'pending') return 'Poder pendiente'
  return 'No requiere poder'
}

async function sha256(text: string) {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export default function GobiaWorkspace() {
  const [attendees, setAttendees] = useState(initialAttendees)
  const [activeAgreement, setActiveAgreement] = useState(agenda[1])
  const [documentText, setDocumentText] = useState('')
  const [documentLoading, setDocumentLoading] = useState(false)
  const [documentError, setDocumentError] = useState('')
  const [evidenceHash, setEvidenceHash] = useState('')
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Estoy listo para ayudarte a revisar quorum, poderes, votos, acuerdos y borradores de acta.',
    },
  ])

  const totals = useMemo(() => {
    const totalShares = attendees.reduce((sum, item) => sum + item.shares, 0)
    const representedShares = attendees.filter((item) => item.present).reduce((sum, item) => sum + item.shares, 0)
    const votingShares = attendees
      .filter((item) => item.present && item.powerStatus !== 'pending')
      .reduce((sum, item) => sum + item.shares, 0)
    const favor = attendees.filter((item) => item.vote === 'favor').reduce((sum, item) => sum + item.shares, 0)
    const against = attendees.filter((item) => item.vote === 'against').reduce((sum, item) => sum + item.shares, 0)
    const abstain = attendees.filter((item) => item.vote === 'abstain').reduce((sum, item) => sum + item.shares, 0)

    return {
      totalShares,
      representedShares,
      votingShares,
      quorum: Math.round((representedShares / totalShares) * 100),
      favor,
      against,
      abstain,
      favorPct: votingShares ? Math.round((favor / votingShares) * 100) : 0,
    }
  }, [attendees])

  const sessionPayload = useMemo(() => ({
    sessionTitle: 'Junta General de Accionistas - ACRES',
    attendance: `${attendees.filter((item) => item.present).length}/${attendees.length} asistentes - ${totals.quorum}% de quorum`,
    quorum: `${totals.representedShares} de ${totals.totalShares} acciones representadas (${totals.quorum}%)`,
    powers: attendees.map((item) => `${item.name}: ${statusLabel(item.powerStatus)}`).join('; '),
    votes: `Acuerdo "${activeAgreement}": favor ${totals.favor}, contra ${totals.against}, abstencion ${totals.abstain}, aprobacion ${totals.favorPct}%`,
    agreements: agenda.join('; '),
    evidence: evidenceHash ? `Hash SHA-256: ${evidenceHash}` : 'Pendiente de registro',
  }), [activeAgreement, attendees, evidenceHash, totals])

  const updateVote = (id: number, vote: Attendee['vote']) => {
    setAttendees((current) => current.map((item) => item.id === id ? { ...item, vote } : item))
  }

  const togglePresence = (id: number) => {
    setAttendees((current) => current.map((item) => item.id === id ? { ...item, present: !item.present } : item))
  }

  const generateDocument = async () => {
    setDocumentLoading(true)
    setDocumentError('')
    try {
      const response = await fetch('/api/gemini/document/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: 'Acta de Junta de Accionistas',
          ...sessionPayload,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'No se pudo generar el documento')
      setDocumentText(data.text)
    } catch (err) {
      setDocumentError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setDocumentLoading(false)
    }
  }

  const registerEvidence = async () => {
    const hash = await sha256(JSON.stringify({ sessionPayload, attendees, createdAt: new Date().toISOString() }))
    setEvidenceHash(hash)
  }

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return
    const nextMessages: ChatMessage[] = [...chatMessages, { role: 'user', content: chatInput.trim() }]
    setChatMessages(nextMessages)
    setChatInput('')
    setChatLoading(true)
    try {
      const response = await fetch('/api/gemini/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...nextMessages,
            { role: 'user', content: `Contexto de la sesion actual: ${JSON.stringify(sessionPayload)}` },
          ],
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'No se pudo consultar el asistente')
      setChatMessages((current) => [...current, { role: 'assistant', content: data.text }])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setChatMessages((current) => [...current, { role: 'assistant', content: message }])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#06080d] text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#080b12]/95 backdrop-blur">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-acres-cyan/15 text-acres-cyan">
              <Gavel className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-800 tracking-widest">GOBIA</div>
              <div className="text-[11px] text-slate-400">Workspace interno de juntas - ACRES</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <LockKeyhole className="h-4 w-4 text-green-400" />
            API keys protegidas en backend
          </div>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-65px)] grid-cols-1 lg:grid-cols-[260px_1fr_360px]">
        <aside className="border-r border-slate-800 bg-[#090d15] p-4">
          <div className="mb-4 text-xs font-700 uppercase tracking-widest text-slate-500">Sesion activa</div>
          <div className="rounded-md border border-slate-800 bg-slate-950/60 p-4">
            <div className="mb-2 text-sm font-700 text-white">JGA ACRES - Mayo 2026</div>
            <div className="text-xs leading-relaxed text-slate-400">Google Meet importado, asistencia en revision y votacion abierta para el acuerdo seleccionado.</div>
          </div>

          <div className="mt-6 space-y-2">
            {[
              { icon: Mic, label: 'Meet intake', value: 'Grabacion cargada' },
              { icon: Users, label: 'Asistencia', value: `${attendees.filter((item) => item.present).length} presentes` },
              { icon: ShieldCheck, label: 'Poderes', value: `${attendees.filter((item) => item.powerStatus === 'pending').length} pendiente` },
              { icon: Vote, label: 'Votacion', value: `${totals.favorPct}% a favor` },
              { icon: Hash, label: 'Blockchain', value: evidenceHash ? 'Hash listo' : 'Pendiente' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-md px-2 py-2 text-sm text-slate-300">
                <item.icon className="h-4 w-4 text-acres-cyan" />
                <div className="min-w-0">
                  <div>{item.label}</div>
                  <div className="truncate text-[11px] text-slate-500">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <section className="p-5">
          <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
            {[
              { label: 'Quorum', value: `${totals.quorum}%`, icon: BadgeCheck },
              { label: 'Acciones representadas', value: totals.representedShares.toLocaleString('es-PE'), icon: Users },
              { label: 'Votos habilitados', value: totals.votingShares.toLocaleString('es-PE'), icon: Vote },
              { label: 'Aprobacion actual', value: `${totals.favorPct}%`, icon: CheckCircle2 },
            ].map((metric) => (
              <div key={metric.label} className="rounded-md border border-slate-800 bg-[#0b111c] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <metric.icon className="h-5 w-5 text-acres-cyan" />
                </div>
                <div className="text-2xl font-800 text-white">{metric.value}</div>
                <div className="text-xs text-slate-500">{metric.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
            <div className="rounded-md border border-slate-800 bg-[#0b111c]">
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                <div>
                  <h2 className="text-sm font-700">Asistencia, poderes y voto</h2>
                  <p className="text-xs text-slate-500">Control operativo de la junta en tiempo real.</p>
                </div>
                <button onClick={registerEvidence} className="flex items-center gap-2 rounded-md border border-acres-cyan/30 px-3 py-2 text-xs text-acres-cyan hover:bg-acres-cyan/10">
                  <Hash className="h-4 w-4" />
                  Registrar evidencia
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Participante</th>
                      <th className="px-4 py-3">Acciones</th>
                      <th className="px-4 py-3">Asistencia</th>
                      <th className="px-4 py-3">Poder</th>
                      <th className="px-4 py-3">Voto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendees.map((item) => (
                      <tr key={item.id} className="border-b border-slate-900">
                        <td className="px-4 py-3">
                          <div className="font-700 text-white">{item.name}</div>
                          <div className="text-xs text-slate-500">{item.role}</div>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">{item.shares.toLocaleString('es-PE')}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => togglePresence(item.id)} className={`rounded-md px-2 py-1 text-xs ${item.present ? 'bg-green-400/10 text-green-300' : 'bg-red-400/10 text-red-300'}`}>
                            {item.present ? 'Presente' : 'Ausente'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-md px-2 py-1 text-xs ${item.powerStatus === 'pending' ? 'bg-yellow-400/10 text-yellow-300' : 'bg-slate-700/60 text-slate-300'}`}>
                            {statusLabel(item.powerStatus)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select value={item.vote} onChange={(event) => updateVote(item.id, event.target.value as Attendee['vote'])} className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-white">
                            <option value="pending">Pendiente</option>
                            <option value="favor">A favor</option>
                            <option value="against">En contra</option>
                            <option value="abstain">Abstencion</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-md border border-slate-800 bg-[#0b111c] p-4">
              <div className="mb-3 flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-acres-cyan" />
                <h2 className="text-sm font-700">Agenda y acuerdos</h2>
              </div>
              <div className="space-y-2">
                {agenda.map((item) => (
                  <button key={item} onClick={() => setActiveAgreement(item)} className={`w-full rounded-md border px-3 py-2 text-left text-xs ${activeAgreement === item ? 'border-acres-cyan/40 bg-acres-cyan/10 text-acres-cyan' : 'border-slate-800 text-slate-400 hover:text-white'}`}>
                    {item}
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-md bg-slate-950/60 p-3">
                <div className="mb-2 text-xs font-700 text-white">Resultado ponderado</div>
                <div className="space-y-1 text-xs text-slate-400">
                  <div>A favor: {totals.favor.toLocaleString('es-PE')} acciones</div>
                  <div>En contra: {totals.against.toLocaleString('es-PE')} acciones</div>
                  <div>Abstencion: {totals.abstain.toLocaleString('es-PE')} acciones</div>
                </div>
              </div>
              {evidenceHash && (
                <div className="mt-4 rounded-md border border-green-400/20 bg-green-400/5 p-3">
                  <div className="mb-1 text-xs font-700 text-green-300">Hash de evidencia</div>
                  <div className="break-all font-mono text-[10px] text-slate-400">{evidenceHash}</div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 rounded-md border border-slate-800 bg-[#0b111c]">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <div>
                <h2 className="text-sm font-700">Acta y reporte generado por IA</h2>
                <p className="text-xs text-slate-500">La API key se usa solo en el backend. El navegador nunca la recibe.</p>
              </div>
              <button onClick={generateDocument} disabled={documentLoading} className="flex items-center gap-2 rounded-md bg-acres-cyan px-3 py-2 text-xs font-700 text-slate-950 disabled:opacity-50">
                {documentLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                Generar acta
              </button>
            </div>
            <div className="min-h-56 p-4">
              {documentError && <div className="rounded-md border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{documentError}</div>}
              {!documentText && !documentError && <div className="text-sm text-slate-500">Aqui aparecera el borrador sujeto a revision legal.</div>}
              {documentText && <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-300">{documentText}</pre>}
            </div>
          </div>
        </section>

        <aside className="border-l border-slate-800 bg-[#090d15] p-4">
          <div className="mb-3 flex items-center gap-2">
            <Bot className="h-4 w-4 text-acres-cyan" />
            <h2 className="text-sm font-700">Copiloto legal-operativo</h2>
          </div>
          <div className="mb-3 h-[calc(100vh-190px)] space-y-3 overflow-y-auto rounded-md border border-slate-800 bg-slate-950/40 p-3">
            {chatMessages.map((message, index) => (
              <div key={index} className={`rounded-md p-3 text-xs leading-relaxed ${message.role === 'assistant' ? 'bg-slate-900 text-slate-300' : 'bg-acres-cyan/10 text-acres-cyan'}`}>
                {message.content}
              </div>
            ))}
            {chatLoading && <div className="flex items-center gap-2 text-xs text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Consultando backend...</div>}
          </div>
          <div className="flex gap-2">
            <input value={chatInput} onChange={(event) => setChatInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && sendChat()} placeholder="Pregunta sobre quorum, poderes o votos..." className="min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none" />
            <button onClick={sendChat} className="rounded-md bg-acres-cyan p-2 text-slate-950">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </aside>
      </div>
    </main>
  )
}
