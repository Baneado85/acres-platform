export type Company = {
  id: string
  name: string
  ruc: string
  address: string
  email: string
  type: string
}

export type Shareholder = {
  id: string
  companyId: string
  name: string
  dni: string
  email: string
  sharesPct: number
  present: boolean
}

export type VoteValue = 'favor' | 'against' | 'abstain' | 'pending'

export type Agreement = {
  id: string
  title: string
  description: string
  requiredPct: number
  votes: Record<string, VoteValue>
}

export type Assembly = {
  id: string
  companyId: string
  title: string
  date: string
  time: string
  modality: 'Virtual' | 'Presencial' | 'Mixta'
  platform: string
  agenda: string[]
  quorumRequiredPct: number
  status: 'Programada' | 'En curso' | 'Finalizada'
  agreements: Agreement[]
}

export type AuditLog = {
  id: string
  at: string
  actor: string
  action: string
  detail: string
}

export const demoCompanies: Company[] = [
  {
    id: 'acres',
    name: 'ACRES Sociedad Titulizadora S.A.',
    ruc: '20601234567',
    address: 'Av. Javier Prado Este 4200, Santiago de Surco, Lima',
    email: 'legal@acres.pe',
    type: 'Sociedad Anonima',
  },
  {
    id: 'andes',
    name: 'Inversiones Andes Holding S.A.C.',
    ruc: '20599888777',
    address: 'Av. El Derby 250, Lima',
    email: 'secretaria@andesholding.pe',
    type: 'Sociedad Anonima Cerrada',
  },
  {
    id: 'pacifico',
    name: 'Pacifico Capital Partners S.A.',
    ruc: '20455666771',
    address: 'Calle Los Laureles 310, San Isidro, Lima',
    email: 'gobierno@pacificocapital.pe',
    type: 'Sociedad Anonima',
  },
]

export const demoShareholders: Shareholder[] = [
  { id: 'sh1', companyId: 'acres', name: 'Inversiones Andina SAC', dni: '20111222333', email: 'legal@andina.pe', sharesPct: 32, present: true },
  { id: 'sh2', companyId: 'acres', name: 'Fondo Horizonte', dni: '20555111222', email: 'operaciones@horizonte.pe', sharesPct: 25, present: true },
  { id: 'sh3', companyId: 'acres', name: 'Maria Torres', dni: '45001234', email: 'maria.torres@mail.com', sharesPct: 14, present: true },
  { id: 'sh4', companyId: 'acres', name: 'Grupo Pacifico', dni: '20455666771', email: 'junta@pacifico.pe', sharesPct: 18, present: false },
  { id: 'sh5', companyId: 'acres', name: 'Carlos Rivas', dni: '40122334', email: 'carlos.rivas@mail.com', sharesPct: 11, present: true },
]

export const demoAssemblies: Assembly[] = [
  {
    id: 'asm-001',
    companyId: 'acres',
    title: 'Junta General de Accionistas - Mayo 2026',
    date: '2026-05-29',
    time: '10:00',
    modality: 'Virtual',
    platform: 'Google Meet',
    agenda: [
      'Verificacion de asistencia y quorum',
      'Aprobacion de estados financieros',
      'Distribucion de dividendos',
      'Delegacion de facultades para ejecucion de acuerdos',
    ],
    quorumRequiredPct: 60,
    status: 'En curso',
    agreements: [
      {
        id: 'ag1',
        title: 'Aprobacion de estados financieros',
        description: 'Aprobar los estados financieros correspondientes al ejercicio societario.',
        requiredPct: 50,
        votes: { sh1: 'favor', sh2: 'favor', sh3: 'pending', sh4: 'pending', sh5: 'against' },
      },
      {
        id: 'ag2',
        title: 'Distribucion de dividendos',
        description: 'Aprobar la distribucion de dividendos conforme a la propuesta de gerencia.',
        requiredPct: 50,
        votes: { sh1: 'favor', sh2: 'abstain', sh3: 'favor', sh4: 'pending', sh5: 'pending' },
      },
    ],
  },
  {
    id: 'asm-002',
    companyId: 'acres',
    title: 'Junta Extraordinaria - Modificacion estatutaria',
    date: '2026-06-18',
    time: '09:30',
    modality: 'Mixta',
    platform: 'Google Meet + Sala Directorio',
    agenda: ['Modificacion parcial de estatuto', 'Designacion de representantes'],
    quorumRequiredPct: 66,
    status: 'Programada',
    agreements: [],
  },
  {
    id: 'asm-003',
    companyId: 'andes',
    title: 'Junta Ordinaria Anual',
    date: '2026-04-20',
    time: '16:00',
    modality: 'Virtual',
    platform: 'Microsoft Teams',
    agenda: ['Memoria anual', 'Estados financieros', 'Nombramiento de auditores'],
    quorumRequiredPct: 55,
    status: 'Finalizada',
    agreements: [],
  },
]

export const demoAuditLogs: AuditLog[] = [
  { id: 'log1', at: '2026-05-29 09:58', actor: 'Admin Legal', action: 'Asistencia importada', detail: 'Se importaron asistentes desde Google Meet.' },
  { id: 'log2', at: '2026-05-29 10:03', actor: 'Abogado Senior', action: 'Quorum validado', detail: 'Quorum alcanzado conforme al umbral configurado.' },
  { id: 'log3', at: '2026-05-29 10:17', actor: 'Sistema', action: 'Votacion recalculada', detail: 'Resultados ponderados actualizados por porcentaje accionario.' },
  { id: 'log4', at: '2026-05-29 10:24', actor: 'Sistema', action: 'Borrador generado', detail: 'Acta societaria generada con datos registrados.' },
]

export function getCompanyShareholders(companyId: string, shareholders: Shareholder[]) {
  return shareholders.filter((shareholder) => shareholder.companyId === companyId)
}

export function calculateShareTotal(companyId: string, shareholders: Shareholder[]) {
  return getCompanyShareholders(companyId, shareholders).reduce((sum, shareholder) => sum + shareholder.sharesPct, 0)
}

export function calculateQuorum(companyId: string, shareholders: Shareholder[]) {
  return getCompanyShareholders(companyId, shareholders)
    .filter((shareholder) => shareholder.present)
    .reduce((sum, shareholder) => sum + shareholder.sharesPct, 0)
}

export function calculateAgreement(agreement: Agreement, shareholders: Shareholder[]) {
  const presentShareholders = shareholders.filter((shareholder) => shareholder.present)
  const totals = presentShareholders.reduce(
    (acc, shareholder) => {
      const vote = agreement.votes[shareholder.id] || 'pending'
      if (vote === 'favor') acc.favor += shareholder.sharesPct
      if (vote === 'against') acc.against += shareholder.sharesPct
      if (vote === 'abstain') acc.abstain += shareholder.sharesPct
      if (vote === 'pending') acc.pending += shareholder.sharesPct
      return acc
    },
    { favor: 0, against: 0, abstain: 0, pending: 0 }
  )

  return {
    ...totals,
    approved: totals.favor >= agreement.requiredPct,
  }
}

export function buildFormalMinutes(params: {
  company: Company
  assembly: Assembly
  shareholders: Shareholder[]
}) {
  const { company, assembly, shareholders } = params
  const companyShareholders = getCompanyShareholders(company.id, shareholders)
  const quorum = calculateQuorum(company.id, shareholders)
  const attendees = companyShareholders.filter((shareholder) => shareholder.present)
  const agreements = assembly.agreements.map((agreement) => ({
    agreement,
    result: calculateAgreement(agreement, companyShareholders),
  }))

  return `BORRADOR SUJETO A REVISION LEGAL

ACTA DE ${assembly.title.toUpperCase()}

En la ciudad de Lima, siendo las ${assembly.time} horas del dia ${assembly.date}, se reunieron los accionistas de ${company.name}, identificada con RUC Nro. ${company.ruc}, bajo modalidad ${assembly.modality.toLowerCase()}${assembly.platform ? ` mediante ${assembly.platform}` : ''}, con la finalidad de tratar los puntos de agenda debidamente registrados.

I. ASISTENCIA Y QUORUM

Se deja constancia de la asistencia de los siguientes accionistas o representantes:
${attendees.map((shareholder) => `- ${shareholder.name}, titular o representante de ${shareholder.sharesPct}% del capital social.`).join('\n')}

El porcentaje de capital social presente o representado asciende a ${quorum.toFixed(2)}%. El quorum minimo requerido para la sesion fue de ${assembly.quorumRequiredPct.toFixed(2)}%. En consecuencia, ${quorum >= assembly.quorumRequiredPct ? 'se verifico quorum valido para instalar la junta.' : 'no se alcanzo el quorum minimo requerido para instalar validamente la junta.'}

II. AGENDA

${assembly.agenda.map((item, index) => `${index + 1}. ${item}`).join('\n')}

III. ACUERDOS Y VOTACION

${agreements.map(({ agreement, result }, index) => `${index + 1}. ${agreement.title}
Descripcion: ${agreement.description}
Resultado ponderado: a favor ${result.favor.toFixed(2)}%, en contra ${result.against.toFixed(2)}%, abstencion ${result.abstain.toFixed(2)}%, pendiente ${result.pending.toFixed(2)}%.
Estado: ${result.approved ? 'ACUERDO APROBADO' : 'ACUERDO NO APROBADO'} conforme al umbral de ${agreement.requiredPct.toFixed(2)}% configurado para el acuerdo.`).join('\n\n')}

IV. CIERRE

No habiendo otros asuntos que tratar, se deja constancia de que la presente acta constituye un borrador generado automaticamente por GOBIA sobre la base exclusiva de los datos registrados en la plataforma, quedando su contenido sujeto a revision, validacion y aprobacion del equipo legal correspondiente.

Firmas:

______________________________
Presidente de la Junta

______________________________
Secretario de la Junta`
}
