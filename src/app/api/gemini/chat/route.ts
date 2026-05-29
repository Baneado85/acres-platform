import { NextResponse } from 'next/server'
import { generateGeminiText, type GeminiContent } from '@/lib/gemini'

const SYSTEM_CONTEXT = `Eres el asistente interno de GOBIA para ACRES. Ayudas a abogados y operadores con juntas virtuales de accionistas: asistencia, poderes, quorum, votacion ponderada, acuerdos, actas, trazabilidad y evidencia blockchain. Responde en espanol, con criterio legal-operativo y dejando claro que la validacion final corresponde al equipo legal.`

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
    const messages = Array.isArray(body.messages) ? body.messages : []
    const contents: GeminiContent[] = messages.map((message: { role: string; content: string }) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(message.content || '') }],
    }))

    const { text, model } = await generateGeminiText({
      apiKey,
      systemInstruction: SYSTEM_CONTEXT,
      contents,
      temperature: 0.5,
      maxOutputTokens: 1200,
    })

    return NextResponse.json({ text, model })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
