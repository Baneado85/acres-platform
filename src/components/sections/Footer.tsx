import { ArrowRight, Zap } from 'lucide-react'

const footerLinks = {
  Plataforma: ['Dashboard IA', 'Documentos legales', 'Votación asistida', 'Compliance SMV'],
  Cliente: ['ACRES', 'Abogados', 'Accionistas', 'Operaciones'],
  Recursos: ['Guías', 'API', 'Webinars', 'Soporte'],
  Legal: ['Términos', 'Privacidad', 'Aviso legal', 'Cookies'],
}

export default function Footer() {
  return (
    <footer className="relative border-t border-acres-cyan/10 px-6 pb-10 pt-20">
      <div className="cyber-grid-bg absolute inset-0 opacity-10" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="glass relative mb-16 overflow-hidden rounded-2xl border border-acres-cyan/20 p-10 text-center">
          <h3 className="mb-4 font-display text-3xl font-800 text-white md:text-4xl">
            GOBIA como
            <span className="gradient-text-cyan"> software interno para ACRES</span>
          </h3>
          <p className="mx-auto mb-8 max-w-xl text-slate-400">
            Una demo visual ayuda a explicar el alcance: asistencia, poderes, quorum, votacion, acuerdos, actas y evidencia blockchain.
          </p>
          <a href="#contact" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-acres-cyan to-acres-purple px-8 py-4 text-sm font-semibold text-white">
            Presentar GOBIA
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-acres-cyan to-acres-purple">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-display text-sm font-800 tracking-widest text-white">GOBIA</div>
                <div className="font-mono text-[8px] uppercase tracking-[0.15em] text-acres-cyan/60">Para ACRES</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Software de juntas, votaciones, documentos y trazabilidad para uso interno de ACRES.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-4 font-mono text-xs uppercase tracking-widest text-slate-400">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-slate-400 transition-colors hover:text-acres-cyan">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-acres-cyan/10 pt-8 md:flex-row">
          <div className="font-mono text-xs text-slate-500">© 2026 GOBIA - Propuesta de software para ACRES</div>
          <div className="font-mono text-xs text-slate-500">Powered by IA generativa</div>
        </div>
      </div>
    </footer>
  )
}
