'use client'

import { motion } from 'framer-motion'
import { BarChart3, Bot, CalendarDays, CheckSquare, Clock, FileCheck, FileText, Mic, PieChart, Shield, UserCheck, Users, Vote, Workflow } from 'lucide-react'
import { useInView } from 'react-intersection-observer'

const modules = [
  { icon: Mic, title: 'Transcripción de reuniones', desc: 'Convierte audio y video en texto con identificación de temas, acuerdos e intervenciones.', tag: 'LIVE' },
  { icon: Vote, title: 'Conteo automático de votos', desc: 'Calcula votos por acciones, porcentajes, abstenciones y votos en contra con trazabilidad.', tag: 'IA' },
  { icon: Shield, title: 'Validación de quórum', desc: 'Cruza accionistas asistentes contra capital social y reglas estatutarias configurables.', tag: 'LEGAL' },
  { icon: Users, title: 'Gestión de accionistas', desc: 'Centraliza acciones, poderes, representantes, restricciones y derecho a voto.', tag: 'CORE' },
  { icon: FileText, title: 'Generación legal IA', desc: 'Produce borradores de actas, acuerdos, constancias y reportes revisables por abogados.', tag: 'DOCS' },
  { icon: Workflow, title: 'Flujos fiduciarios', desc: 'Orquesta aprobaciones, responsables, plazos y evidencias para operaciones críticas.', tag: 'FLOW' },
  { icon: BarChart3, title: 'Analytics de gobernanza', desc: 'Dashboards de asistencia, participación, cumplimiento y evolución de acuerdos.', tag: 'DATA' },
  { icon: CheckSquare, title: 'Cumplimiento SMV', desc: 'Checklist de obligaciones, vencimientos y alertas para documentación regulatoria.', tag: 'SMV' },
  { icon: CalendarDays, title: 'Agenda inteligente', desc: 'Prepara puntos de agenda y seguimiento de compromisos después de cada junta.', tag: 'BOARD' },
  { icon: FileCheck, title: 'Seguimiento de resoluciones', desc: 'Traza cada acuerdo desde la aprobación hasta el cierre documental.', tag: 'TRACE' },
  { icon: PieChart, title: 'Reportes ejecutivos', desc: 'Entrega cuadros de asistencia, votación y acuerdos para directorio y gerencia.', tag: 'BI' },
  { icon: Clock, title: 'Timeline de juntas', desc: 'Consulta el historial completo de sesiones, decisiones y documentos emitidos.', tag: 'HIST' },
  { icon: UserCheck, title: 'Verificación de asistencia', desc: 'Integra listas de Google Meet, registro manual y validación de representantes.', tag: 'MEET' },
  { icon: Bot, title: 'Asistente corporativo IA', desc: 'Copiloto para consultas internas sobre juntas, documentos y gobernanza.', tag: 'COPILOT' },
]

export default function PlatformModules() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="modules" ref={ref} className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="mb-20 text-center">
          <div className="glass mb-6 inline-flex items-center gap-2 rounded-full border border-acres-cyan/20 px-4 py-2">
            <span className="font-mono text-xs uppercase tracking-widest text-acres-cyan">Módulos de plataforma</span>
          </div>
          <h2 className="mb-6 font-display text-4xl font-800 leading-tight text-white md:text-6xl">
            Ecosistema completo de
            <br />
            <span className="gradient-text-cyan">juntas y gobernanza IA</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-400">
            Una propuesta modular para empezar por servicio asistido por sesión y evolucionar hacia plataforma interna.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {modules.map((mod, i) => (
            <motion.div key={mod.title} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.04 }} className="glass group relative overflow-hidden rounded-2xl border border-acres-cyan/10 p-6 transition-all hover:border-acres-cyan/40 hover:shadow-xl hover:shadow-acres-cyan/10">
              <div className="relative z-10">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-acres-cyan/10 transition-transform group-hover:scale-110">
                    <mod.icon className="h-5 w-5 text-acres-cyan" />
                  </div>
                  <span className="rounded-full border border-acres-cyan/20 bg-acres-cyan/10 px-2 py-1 font-mono text-[9px] tracking-widest text-acres-cyan">
                    {mod.tag}
                  </span>
                </div>
                <h3 className="mb-2 font-display text-sm font-700 leading-tight text-white transition-colors group-hover:text-acres-cyan">{mod.title}</h3>
                <p className="text-xs leading-relaxed text-slate-400">{mod.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
