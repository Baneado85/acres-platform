import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GOBIA | Software de Juntas y Gobernanza para ACRES',
  description: 'GOBIA es una propuesta de software interno para ACRES: automatizacion de juntas virtuales, asistencia, poderes, quorum, votaciones, acuerdos, actas y evidencia auditable.',
  keywords: 'GOBIA, ACRES, juntas de accionistas, gobernanza corporativa, quorum, votaciones, blockchain, IA, LegalTech, Peru',
  authors: [{ name: 'GOBIA' }],
  openGraph: {
    title: 'GOBIA | Software interno de juntas para ACRES',
    description: 'Automatizacion de sesiones virtuales, votos, poderes, acuerdos y documentos con IA y trazabilidad blockchain.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="bg-acres-black text-slate-200 font-body antialiased">
        {children}
      </body>
    </html>
  )
}
