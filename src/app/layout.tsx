import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ACRES Sociedad Titulizadora | AI-Powered Corporate Governance Platform',
  description: 'Plataforma de gobernanza corporativa e inteligencia fiduciaria impulsada por IA para juntas de accionistas, procesos legales y operaciones de mercado de capitales.',
  keywords: 'ACRES, Sociedad Titulizadora, gobernanza corporativa, fideicomiso, IA, LegalTech, FinTech, Perú, SMV, mercado de capitales',
  authors: [{ name: 'ACRES Sociedad Titulizadora' }],
  openGraph: {
    title: 'ACRES Sociedad Titulizadora | AI Governance Platform',
    description: 'Transformando la gobernanza corporativa y operaciones fiduciarias con inteligencia artificial.',
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
