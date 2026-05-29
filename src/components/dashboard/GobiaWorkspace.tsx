'use client'

import { useMemo, useState } from 'react'
import {
  Archive,
  BadgeCheck,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Download,
  FileSearch,
  FileText,
  Gavel,
  History,
  LayoutDashboard,
  Loader2,
  LockKeyhole,
  LogOut,
  Moon,
  Plus,
  Scale,
  Search,
  ShieldCheck,
  Users,
  Vote,
} from 'lucide-react'
import {
  Assembly,
  Company,
  Shareholder,
  VoteValue,
  buildFormalMinutes,
  calculateAgreement,
  calculateQuorum,
  calculateShareTotal,
  demoAssemblies,
  demoAuditLogs,
  demoCompanies,
  demoShareholders,
  getCompanyShareholders,
} from '@/lib/legal-data'
import { supabase } from '@/lib/supabase'

type View = 'dashboard' | 'companies' | 'shareholders' | 'assemblies' | 'attendance' | 'voting' | 'minutes' | 'history' | 'audit'

const navItems: Array<{ id: View; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'companies', label: 'Empresas', icon: Building2 },
  { id: 'shareholders', label: 'Accionistas', icon: Users },
  { id: 'assemblies', label: 'Asambleas', icon: CalendarDays },
  { id: 'attendance', label: 'Asistencia', icon: BadgeCheck },
  { id: 'voting', label: 'Votacion', icon: Vote },
  { id: 'minutes', label: 'Actas IA', icon: FileText },
  { id: 'history', label: 'Historial', icon: Archive },
  { id: 'audit', label: 'Auditoria', icon: History },
]

function pct(value: number) {
  return `${value.toFixed(2)}%`
}

function badgeClass(status: string) {
  if (status === 'Finalizada') return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
  if (status === 'En curso') return 'border-cyan-500/20 bg-cyan-500/10 text-cyan-300'
  return 'border-amber-500/20 bg-amber-500/10 text-amber-300'
}

function exportTextFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function toWordHtml(content: string) {
  return `<html><head><meta charset="utf-8"><title>Acta</title></head><body><pre style="font-family: 'Times New Roman', serif; white-space: pre-wrap; font-size: 12pt; line-height: 1.5;">${content.replace(/[&<>]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[char] || char))}</pre></body></html>`
}

function exportPdf(content: string) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return
  printWindow.document.write(`
    <html>
      <head>
        <title>Acta GOBIA</title>
        <style>
          body { font-family: "Times New Roman", serif; padding: 48px; color: #111827; }
          pre { white-space: pre-wrap; font-size: 12pt; line-height: 1.55; }
        </style>
      </head>
      <body>
        <pre>${content.replace(/[&<>]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[char] || char))}</pre>
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
}

export default function GobiaWorkspace() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [view, setView] = useState<View>('dashboard')
  const [companies, setCompanies] = useState<Company[]>(demoCompanies)
  const [shareholders, setShareholders] = useState<Shareholder[]>(demoShareholders)
  const [assemblies, setAssemblies] = useState<Assembly[]>(demoAssemblies)
  const [selectedCompanyId, setSelectedCompanyId] = useState('acres')
  const [selectedAssemblyId, setSelectedAssemblyId] = useState('asm-001')
  const [search, setSearch] = useState('')
  const [darkMode, setDarkMode] = useState(true)
  const [minutes, setMinutes] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const dbStatus = supabase ? 'Supabase conectado' : 'Demo local - Supabase pendiente'

  const selectedCompany = companies.find((company) => company.id === selectedCompanyId) || companies[0]
  const selectedAssembly = assemblies.find((assembly) => assembly.id === selectedAssemblyId) || assemblies[0]
  const companyShareholders = getCompanyShareholders(selectedCompany.id, shareholders)
  const shareTotal = calculateShareTotal(selectedCompany.id, shareholders)
  const quorum = calculateQuorum(selectedCompany.id, shareholders)
  const quorumValid = quorum >= selectedAssembly.quorumRequiredPct
  const averageAttendance = Math.round(
    assemblies.reduce((sum) => sum + quorum, 0) / Math.max(assemblies.length, 1)
  )

  const filteredShareholders = companyShareholders.filter((shareholder) =>
    `${shareholder.name} ${shareholder.dni} ${shareholder.email}`.toLowerCase().includes(search.toLowerCase())
  )

  const currentMinutes = minutes || buildFormalMinutes({
    company: selectedCompany,
    assembly: selectedAssembly,
    shareholders,
  })

  const dashboardMetrics = [
    { label: 'Juntas programadas', value: assemblies.filter((item) => item.status === 'Programada').length, icon: CalendarDays },
    { label: 'Juntas finalizadas', value: assemblies.filter((item) => item.status === 'Finalizada').length, icon: CheckCircle2 },
    { label: 'Empresas registradas', value: companies.length, icon: Building2 },
    { label: 'Asistencia promedio', value: `${averageAttendance}%`, icon: BarChart3 },
  ]

  const addCompany = () => {
    const next: Company = {
      id: `company-${companies.length + 1}`,
      name: 'Nueva Empresa S.A.C.',
      ruc: '20XXXXXXXXX',
      address: 'Direccion pendiente',
      email: 'legal@empresa.pe',
      type: 'Sociedad Anonima Cerrada',
    }
    setCompanies((current) => [...current, next])
    setSelectedCompanyId(next.id)
  }

  const addShareholder = () => {
    const remaining = Math.max(0, 100 - shareTotal)
    const next: Shareholder = {
      id: `sh-${Date.now()}`,
      companyId: selectedCompany.id,
      name: 'Nuevo Accionista',
      dni: '00000000',
      email: 'accionista@correo.com',
      sharesPct: remaining,
      present: false,
    }
    setShareholders((current) => [...current, next])
  }

  const addAssembly = () => {
    const next: Assembly = {
      id: `asm-${Date.now()}`,
      companyId: selectedCompany.id,
      title: 'Nueva Asamblea de Accionistas',
      date: '2026-06-30',
      time: '10:00',
      modality: 'Virtual',
      platform: 'Google Meet',
      agenda: ['Verificacion de quorum', 'Aprobacion de acuerdos'],
      quorumRequiredPct: 60,
      status: 'Programada',
      agreements: [
        {
          id: `ag-${Date.now()}`,
          title: 'Aprobacion de acuerdo principal',
          description: 'Acuerdo registrado para votacion ponderada.',
          requiredPct: 50,
          votes: {},
        },
      ],
    }
    setAssemblies((current) => [...current, next])
    setSelectedAssemblyId(next.id)
  }

  const updateShareholder = (id: string, patch: Partial<Shareholder>) => {
    setShareholders((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item))
  }

  const updateVote = (agreementId: string, shareholderId: string, vote: VoteValue) => {
    setAssemblies((current) => current.map((assembly) => assembly.id === selectedAssembly.id
      ? {
          ...assembly,
          agreements: assembly.agreements.map((agreement) => agreement.id === agreementId
            ? { ...agreement, votes: { ...agreement.votes, [shareholderId]: vote } }
            : agreement),
        }
      : assembly))
  }

  const generateWithAI = async () => {
    setAiLoading(true)
    setAiError('')
    try {
      const response = await fetch('/api/gemini/document/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: 'Acta societaria',
          sessionTitle: selectedAssembly.title,
          attendance: companyShareholders.filter((item) => item.present).map((item) => `${item.name} (${pct(item.sharesPct)})`).join('; '),
          quorum: `${pct(quorum)} de ${pct(selectedAssembly.quorumRequiredPct)} requerido`,
          powers: 'Poderes y representaciones sujetos a revision legal documental.',
          votes: selectedAssembly.agreements.map((agreement) => {
            const result = calculateAgreement(agreement, companyShareholders)
            return `${agreement.title}: favor ${pct(result.favor)}, contra ${pct(result.against)}, abstencion ${pct(result.abstain)}`
          }).join('; '),
          agreements: selectedAssembly.agreements.map((agreement) => agreement.title).join('; '),
          evidence: 'Datos registrados en GOBIA; no inventar informacion no proporcionada.',
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'No se pudo generar el acta con IA')
      setMinutes(data.text)
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setAiLoading(false)
    }
  }

  if (!loggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f7f9] px-6 text-slate-950">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200 lg:grid-cols-[1fr_420px]">
          <section className="bg-slate-950 p-10 text-white">
            <div className="mb-16 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-400 text-slate-950">
                <Scale className="h-6 w-6" />
              </div>
              <div>
                <div className="text-lg font-800 tracking-widest">GOBIA</div>
                <div className="text-xs text-slate-400">Legal-tech governance suite</div>
              </div>
            </div>
            <h1 className="mb-5 max-w-xl text-5xl font-800 leading-tight">
              Automatizacion legal para juntas de accionistas.
            </h1>
            <p className="max-w-lg text-sm leading-7 text-slate-300">
              Quorum, asistencia, votaciones ponderadas, acuerdos y actas societarias en una sola plataforma segura para abogados y administradores.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-3">
              {['Quorum', 'Votacion', 'Actas IA'].map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">{item}</div>
              ))}
            </div>
          </section>
          <section className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-800">Inicio de sesion</h2>
              <p className="mt-2 text-sm text-slate-500">Acceso para abogados, secretarios societarios y administradores.</p>
            </div>
            <div className="space-y-4">
              <label className="block">
                <span className="text-xs font-700 uppercase tracking-widest text-slate-500">Correo</span>
                <input defaultValue="legal@acres.pe" className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-500" />
              </label>
              <label className="block">
                <span className="text-xs font-700 uppercase tracking-widest text-slate-500">Contrasena</span>
                <input defaultValue="gobia-demo" type="password" className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-500" />
              </label>
              <button onClick={() => setLoggedIn(true)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-800 text-white">
                <LockKeyhole className="h-4 w-4" />
                Entrar a la plataforma
              </button>
              <p className="text-center text-xs text-slate-400">Demo local con datos precargados. Supabase listo para conexion.</p>
            </div>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className={`${darkMode ? 'bg-[#070a10] text-slate-100' : 'bg-slate-100 text-slate-950'} min-h-screen`}>
      <div className="grid min-h-screen grid-cols-[260px_1fr]">
        <aside className={`${darkMode ? 'border-slate-800 bg-[#0b1018]' : 'border-slate-200 bg-white'} border-r p-4`}>
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400 text-slate-950">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-800 tracking-widest">GOBIA</div>
              <div className="text-[11px] text-slate-500">Societario IA</div>
            </div>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => setView(item.id)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${view === item.id ? 'bg-cyan-400 text-slate-950' : 'text-slate-500 hover:bg-slate-500/10 hover:text-current'}`}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <section>
          <header className={`${darkMode ? 'border-slate-800 bg-[#0b1018]' : 'border-slate-200 bg-white'} sticky top-0 z-20 flex items-center justify-between border-b px-6 py-4`}>
            <div>
              <h1 className="text-xl font-800">Plataforma de juntas y actas societarias</h1>
              <p className="text-xs text-slate-500">Quorum, votos ponderados, acuerdos y actas legales sin exponer API keys en frontend.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-500">{dbStatus}</span>
              <select value={selectedCompanyId} onChange={(event) => setSelectedCompanyId(event.target.value)} className={`${darkMode ? 'border-slate-700 bg-slate-950' : 'border-slate-200 bg-white'} rounded-lg border px-3 py-2 text-sm`}>
                {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
              </select>
              <button onClick={() => setDarkMode((current) => !current)} className="rounded-lg border border-slate-700 p-2">
                <Moon className="h-4 w-4" />
              </button>
              <button onClick={() => setLoggedIn(false)} className="rounded-lg border border-slate-700 p-2">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="p-6">
            {view === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  {dashboardMetrics.map((metric) => (
                    <Card key={metric.label} darkMode={darkMode}>
                      <metric.icon className="mb-4 h-5 w-5 text-cyan-400" />
                      <div className="text-3xl font-800">{metric.value}</div>
                      <div className="text-sm text-slate-500">{metric.label}</div>
                    </Card>
                  ))}
                </div>
                <Card darkMode={darkMode}>
                  <SectionTitle icon={CalendarDays} title="Juntas recientes" action={<button onClick={() => setView('assemblies')} className="text-sm text-cyan-400">Gestionar</button>} />
                  <DataTable headers={['Junta', 'Empresa', 'Fecha', 'Modalidad', 'Estado']}>
                    {assemblies.map((assembly) => (
                      <tr key={assembly.id} className="border-t border-slate-800/50">
                        <td className="px-4 py-3 font-700">{assembly.title}</td>
                        <td className="px-4 py-3 text-slate-500">{companies.find((company) => company.id === assembly.companyId)?.name}</td>
                        <td className="px-4 py-3">{assembly.date} {assembly.time}</td>
                        <td className="px-4 py-3">{assembly.modality}</td>
                        <td className="px-4 py-3"><span className={`rounded-full border px-2 py-1 text-xs ${badgeClass(assembly.status)}`}>{assembly.status}</span></td>
                      </tr>
                    ))}
                  </DataTable>
                </Card>
              </div>
            )}

            {view === 'companies' && (
              <ModuleShell darkMode={darkMode} title="Registro de empresa" icon={Building2} action={<button onClick={addCompany} className="btn-primary"><Plus className="h-4 w-4" /> Nueva empresa</button>}>
                <div className="grid grid-cols-2 gap-4">
                  {companies.map((company) => (
                    <Card key={company.id} darkMode={darkMode}>
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-800">{company.name}</h3>
                        <span className="rounded-full bg-cyan-400/10 px-2 py-1 text-xs text-cyan-400">{company.type}</span>
                      </div>
                      <FormGrid>
                        <Field label="Razon social" value={company.name} />
                        <Field label="RUC" value={company.ruc} />
                        <Field label="Direccion" value={company.address} />
                        <Field label="Correo" value={company.email} />
                        <Field label="Tipo societario" value={company.type} />
                      </FormGrid>
                    </Card>
                  ))}
                </div>
              </ModuleShell>
            )}

            {view === 'shareholders' && (
              <ModuleShell darkMode={darkMode} title="Registro de accionistas" icon={Users} action={<button onClick={addShareholder} className="btn-primary"><Plus className="h-4 w-4" /> Nuevo accionista</button>}>
                <div className="mb-4 flex items-center justify-between">
                  <SearchBox search={search} setSearch={setSearch} />
                  <div className={`rounded-lg border px-3 py-2 text-sm ${shareTotal === 100 ? 'border-emerald-500/30 text-emerald-300' : 'border-red-500/30 text-red-300'}`}>
                    Total acciones: {pct(shareTotal)} {shareTotal === 100 ? 'Valido' : 'Debe ser 100%'}
                  </div>
                </div>
                <DataTable headers={['Nombre', 'DNI/RUC', 'Correo', '% acciones', 'Empresa']}>
                  {filteredShareholders.map((shareholder) => (
                    <tr key={shareholder.id} className="border-t border-slate-800/50">
                      <td className="px-4 py-3"><input value={shareholder.name} onChange={(event) => updateShareholder(shareholder.id, { name: event.target.value })} className="input-cell" /></td>
                      <td className="px-4 py-3"><input value={shareholder.dni} onChange={(event) => updateShareholder(shareholder.id, { dni: event.target.value })} className="input-cell" /></td>
                      <td className="px-4 py-3"><input value={shareholder.email} onChange={(event) => updateShareholder(shareholder.id, { email: event.target.value })} className="input-cell" /></td>
                      <td className="px-4 py-3"><input type="number" value={shareholder.sharesPct} onChange={(event) => updateShareholder(shareholder.id, { sharesPct: Number(event.target.value) })} className="input-cell w-24" /></td>
                      <td className="px-4 py-3 text-slate-500">{selectedCompany.name}</td>
                    </tr>
                  ))}
                </DataTable>
              </ModuleShell>
            )}

            {view === 'assemblies' && (
              <ModuleShell darkMode={darkMode} title="Creacion de asamblea" icon={CalendarDays} action={<button onClick={addAssembly} className="btn-primary"><Plus className="h-4 w-4" /> Nueva asamblea</button>}>
                <div className="grid gap-4">
                  {assemblies.filter((assembly) => assembly.companyId === selectedCompany.id).map((assembly) => (
                    <Card key={assembly.id} darkMode={darkMode}>
                      <div className="grid grid-cols-[1fr_140px_120px_150px] items-center gap-4">
                        <div>
                          <div className="font-800">{assembly.title}</div>
                          <div className="text-sm text-slate-500">Agenda: {assembly.agenda.join(' | ')}</div>
                        </div>
                        <div className="text-sm">{assembly.date}<br />{assembly.time}</div>
                        <div className="text-sm">{assembly.modality}<br /><span className="text-slate-500">{assembly.platform}</span></div>
                        <button onClick={() => { setSelectedAssemblyId(assembly.id); setView('attendance') }} className="rounded-lg bg-cyan-400 px-3 py-2 text-sm font-800 text-slate-950">Abrir junta</button>
                      </div>
                    </Card>
                  ))}
                </div>
              </ModuleShell>
            )}

            {view === 'attendance' && (
              <ModuleShell darkMode={darkMode} title="Control de asistencia y quorum" icon={BadgeCheck}>
                <div className="mb-6 grid grid-cols-[1fr_240px] gap-4">
                  <Card darkMode={darkMode}>
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <div className="text-sm text-slate-500">Quorum alcanzado</div>
                        <div className="text-4xl font-800">{pct(quorum)}</div>
                      </div>
                      <span className={`rounded-full px-3 py-2 text-sm font-800 ${quorumValid ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
                        {quorumValid ? 'Quorum valido' : 'Quorum insuficiente'}
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                      <div className={`h-full ${quorumValid ? 'bg-emerald-400' : 'bg-amber-400'}`} style={{ width: `${Math.min(quorum, 100)}%` }} />
                    </div>
                    <div className="mt-2 text-xs text-slate-500">Minimo requerido: {pct(selectedAssembly.quorumRequiredPct)}</div>
                  </Card>
                  <Card darkMode={darkMode}>
                    <div className="text-sm text-slate-500">Asistentes</div>
                    <div className="mt-2 text-4xl font-800">{companyShareholders.filter((item) => item.present).length}/{companyShareholders.length}</div>
                  </Card>
                </div>
                <DataTable headers={['Accionista', '% acciones', 'Asistencia']}>
                  {companyShareholders.map((shareholder) => (
                    <tr key={shareholder.id} className="border-t border-slate-800/50">
                      <td className="px-4 py-3 font-700">{shareholder.name}</td>
                      <td className="px-4 py-3">{pct(shareholder.sharesPct)}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => updateShareholder(shareholder.id, { present: !shareholder.present })} className={`rounded-lg px-3 py-2 text-xs font-800 ${shareholder.present ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-500/10 text-slate-400'}`}>
                          {shareholder.present ? 'Presente' : 'Marcar asistencia'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </DataTable>
              </ModuleShell>
            )}

            {view === 'voting' && (
              <ModuleShell darkMode={darkMode} title="Sistema de votacion ponderada" icon={Vote}>
                <div className="space-y-5">
                  {selectedAssembly.agreements.map((agreement) => {
                    const result = calculateAgreement(agreement, companyShareholders)
                    return (
                      <Card key={agreement.id} darkMode={darkMode}>
                        <div className="mb-4 flex items-start justify-between">
                          <div>
                            <h3 className="font-800">{agreement.title}</h3>
                            <p className="text-sm text-slate-500">{agreement.description}</p>
                          </div>
                          <span className={`rounded-full px-3 py-2 text-xs font-800 ${result.approved ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
                            {result.approved ? 'Acuerdo aprobado' : 'No aprobado'}
                          </span>
                        </div>
                        <div className="mb-4 grid grid-cols-4 gap-3">
                          <VoteMetric label="A favor" value={result.favor} />
                          <VoteMetric label="En contra" value={result.against} />
                          <VoteMetric label="Abstencion" value={result.abstain} />
                          <VoteMetric label="Pendiente" value={result.pending} />
                        </div>
                        <DataTable headers={['Accionista', '% acciones', 'Voto']}>
                          {companyShareholders.filter((item) => item.present).map((shareholder) => (
                            <tr key={shareholder.id} className="border-t border-slate-800/50">
                              <td className="px-4 py-3 font-700">{shareholder.name}</td>
                              <td className="px-4 py-3">{pct(shareholder.sharesPct)}</td>
                              <td className="px-4 py-3">
                                <select value={agreement.votes[shareholder.id] || 'pending'} onChange={(event) => updateVote(agreement.id, shareholder.id, event.target.value as VoteValue)} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white">
                                  <option value="pending">Pendiente</option>
                                  <option value="favor">A favor</option>
                                  <option value="against">En contra</option>
                                  <option value="abstain">Abstencion</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </DataTable>
                      </Card>
                    )
                  })}
                </div>
              </ModuleShell>
            )}

            {view === 'minutes' && (
              <ModuleShell darkMode={darkMode} title="Generacion automatica de acta" icon={FileText} action={<div className="flex gap-2"><button onClick={generateWithAI} className="btn-primary">{aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} Redactar con IA</button><button onClick={() => exportPdf(currentMinutes)} className="btn-secondary"><Download className="h-4 w-4" /> Exportar PDF</button><button onClick={() => exportTextFile('acta-gobia.doc', toWordHtml(currentMinutes), 'application/msword')} className="btn-secondary"><Download className="h-4 w-4" /> Exportar Word</button></div>}>
                {aiError && <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{aiError}</div>}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
                  <pre className="whitespace-pre-wrap font-serif text-sm leading-7 text-slate-200">{currentMinutes}</pre>
                </div>
              </ModuleShell>
            )}

            {view === 'history' && (
              <ModuleShell darkMode={darkMode} title="Historial de actas" icon={Archive}>
                <div className="mb-4"><SearchBox search={search} setSearch={setSearch} /></div>
                <DataTable headers={['Acta', 'Empresa', 'Fecha', 'Estado']}>
                  {assemblies.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()) || item.status === 'Finalizada').map((assembly) => (
                    <tr key={assembly.id} className="border-t border-slate-800/50">
                      <td className="px-4 py-3 font-700">{assembly.title}</td>
                      <td className="px-4 py-3 text-slate-500">{companies.find((company) => company.id === assembly.companyId)?.name}</td>
                      <td className="px-4 py-3">{assembly.date}</td>
                      <td className="px-4 py-3"><span className={`rounded-full border px-2 py-1 text-xs ${badgeClass(assembly.status)}`}>{assembly.status}</span></td>
                    </tr>
                  ))}
                </DataTable>
              </ModuleShell>
            )}

            {view === 'audit' && (
              <ModuleShell darkMode={darkMode} title="Logs de auditoria" icon={FileSearch}>
                <DataTable headers={['Fecha', 'Actor', 'Accion', 'Detalle']}>
                  {demoAuditLogs.map((log) => (
                    <tr key={log.id} className="border-t border-slate-800/50">
                      <td className="px-4 py-3 font-mono text-xs">{log.at}</td>
                      <td className="px-4 py-3">{log.actor}</td>
                      <td className="px-4 py-3 font-700">{log.action}</td>
                      <td className="px-4 py-3 text-slate-500">{log.detail}</td>
                    </tr>
                  ))}
                </DataTable>
              </ModuleShell>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

function Card({ children, darkMode }: { children: React.ReactNode; darkMode: boolean }) {
  return <div className={`${darkMode ? 'border-slate-800 bg-[#0e141f]' : 'border-slate-200 bg-white'} rounded-xl border p-5 shadow-sm`}>{children}</div>
}

function SectionTitle({ icon: Icon, title, action }: { icon: typeof LayoutDashboard; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-cyan-400" />
        <h2 className="font-800">{title}</h2>
      </div>
      {action}
    </div>
  )
}

function ModuleShell({ children, darkMode, title, icon, action }: { children: React.ReactNode; darkMode: boolean; title: string; icon: typeof LayoutDashboard; action?: React.ReactNode }) {
  return (
    <Card darkMode={darkMode}>
      <SectionTitle icon={icon} title={title} action={action} />
      {children}
    </Card>
  )
}

function DataTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800/70">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-950/70 text-xs uppercase tracking-widest text-slate-500">
          <tr>{headers.map((header) => <th key={header} className="px-4 py-3">{header}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-xs font-700 uppercase tracking-widest text-slate-500">{label}</span>
      <input defaultValue={value} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none" />
    </label>
  )
}

function SearchBox({ search, setSearch }: { search: string; setSearch: (value: string) => void }) {
  return (
    <div className="relative max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar..." className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-sm text-white outline-none" />
    </div>
  )
}

function VoteMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-slate-950/70 p-3">
      <div className="text-xl font-800">{pct(value)}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  )
}
