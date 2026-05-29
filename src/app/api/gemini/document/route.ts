import { NextResponse } from 'next/server'
import { generateGeminiText } from '@/lib/gemini'

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Falta configurar GEMINI_API_KEY en el backend.' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const prompt = `Eres un abogado corporativo peruano especializado en juntas de accionistas.
Genera un borrador operativo para revision legal dentro de GOBIA.

Tipo de documento: ${body.documentType || 'Acta de Junta de Accionistas'}
Sesion: ${body.sessionTitle || 'Sesion sin titulo'}
Asistencia: ${body.attendance || 'No indicada'}
Quorum: ${body.quorum || 'No indicado'}
Poderes: ${body.powers || 'No indicados'}
Votaciones: ${body.votes || 'No indicadas'}
Acuerdos: ${body.agreements || 'No indicados'}
Evidencia: ${body.evidence || 'No indicada'}

Incluye: encabezado, antecedentes, lista de asistencia resumida, revision de poderes, quorum, acuerdos, cuadro de votacion ponderada, observaciones y bloque de firmas. No lo presentes como documento final; debe decir "Borrador sujeto a revision legal".`

    const { text, model } = await generateGeminiText({
      apiKey,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      temperature: 0.25,
      maxOutputTokens: 2400,
    })

    return NextResponse.json({ text, model })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
