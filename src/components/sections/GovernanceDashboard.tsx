'use client'

import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, FileText, Shield, TrendingUp, Users } from 'lucide-react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useInView } from 'react-intersection-observer'

const shareholderData = [
  { name: 'Institucional A', value: 35, color: '#00d4ff' },
  { name: 'Institucional B', value: 25, color: '#7c3aed' },
  { name: 'Retail', value: 20, color: '#a855f7' },
  { name: 'Estratégico', value: 12, color: '#0052cc' },
  { name: 'Flotante', value: 8, color: '#06b6d4' },
]

const votingHistory = [
  { month: 'Ene', aprobadas: 12, rechazadas: 2, abstenciones: 1 },
  { month: 'Feb', aprobadas: 8, rechazadas: 1, abstenciones: 3 },
  { month: 'Mar', aprobadas: 15, rechazadas: 0, abstenciones: 2 },
  { month: 'Abr', aprobadas: 10, rechazadas: 3, abstenciones: 1 },
  { month: 'May', aprobadas: 18, rechazadas: 1, abstenciones: 0 },
  { month: 'Jun', aprobadas: 14, rechazadas: 2, abstenciones: 4 },
]

const complianceMetrics = [
  { month: 'Ene', score: 88 },
  { month: 'Feb', score: 91 },
  { month: 'Mar', score: 87 },
  { month: 'Abr', score: 94 },
  { month: 'May', score: 96 },
  { month: 'Jun', score: 98 },
]

const kpis = [
  { label: 'Accionistas activos', value: '1,247', change: '+12%', icon: Users },
  { label: 'Resoluciones vigentes', value: '384', change: '+8%', icon: FileText },
  { label: 'Compliance score', value: '98%', change: '+4%', icon: Shield },
  { label: 'Horas legales ahorradas', value: '620', change: '+23%', icon: TrendingUp },
]

export default function GovernanceDashboard() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="analytics" ref={ref} className="relative px-6 py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-acres-navy/20 to-transparent" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="mb-16 text-center">
          <div className="glass mb-6 inline-flex items-center gap-2 rounded-full border border-acres-purple/30 px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-acres-violet">Dashboard gobernanza</span>
          </div>
          <h2 className="mb-4 font-display text-4xl font-800 leading-tight text-white md:text-6xl">
            Inteligencia de
            <br />
            <span className="gradient-text-cyan">accionistas y acuerdos</span>
          </h2>
        </motion.div>

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpis.map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }} className="glass rounded-2xl border border-acres-cyan/10 p-5">
              <div className="mb-3 flex items-center justify-between">
                <kpi.icon className="h-5 w-5 text-acres-cyan" />
                <span className="font-mono text-xs text-green-400">{kpi.change}</span>
              </div>
              <div className="mb-1 font-display text-2xl font-800 text-white">{kpi.value}</div>
              <div className="text-xs text-slate-400">{kpi.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="glass rounded-2xl border border-acres-cyan/10 p-6">
            <h3 className="mb-6 font-display text-sm font-700 text-white">Estructura accionarial</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={shareholderData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {shareholderData.map((entry) => <Cell key={entry.name} fill={entry.color} opacity={0.9} />)}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Participación']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-2xl border border-acres-cyan/10 p-6">
            <h3 className="mb-6 font-display text-sm font-700 text-white">Historial de resoluciones</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={votingHistory} barSize={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.08)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="aprobadas" fill="#00d4ff" radius={3} />
                <Bar dataKey="rechazadas" fill="#ef4444" radius={3} />
                <Bar dataKey="abstenciones" fill="#7c3aed" radius={3} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-2xl border border-acres-cyan/10 p-6">
            <h3 className="mb-6 font-display text-sm font-700 text-white">Compliance score SMV</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={complianceMetrics}>
                <defs>
                  <linearGradient id="complianceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.08)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#00d4ff" strokeWidth={2} fill="url(#complianceGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl border border-acres-cyan/10 p-6">
          <h3 className="mb-6 font-display text-sm font-700 text-white">Alertas de gobernanza IA</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            {['Junta ordinaria completada - Quórum 87%', 'Reporte SMV pendiente - Vence en 5 días', 'Resolución aprobada - 94% votos', 'Nuevo fideicomiso registrado'].map((alert, i) => (
              <div key={alert} className="flex items-start gap-3 rounded-xl border border-acres-cyan/15 bg-acres-cyan/5 p-4">
                {i === 1 ? <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" /> : <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />}
                <p className="text-xs leading-relaxed text-slate-300">{alert}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
