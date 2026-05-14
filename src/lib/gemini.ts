export const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest']

export type GeminiContent = {
  role: 'user' | 'model'
  parts: Array<{ text: string }>
}

type GenerateGeminiTextParams = {
  apiKey: string
  contents: GeminiContent[]
  systemInstruction?: string
  temperature?: number
  maxOutputTokens?: number
}

export async function generateGeminiText({
  apiKey,
  contents,
  systemInstruction,
  temperature = 0.7,
  maxOutputTokens = 1024,
}: GenerateGeminiTextParams) {
  const errors: string[] = []

  for (const model of GEMINI_MODELS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...(systemInstruction ? { system_instruction: { parts: [{ text: systemInstruction }] } } : {}),
            contents,
            generationConfig: {
              temperature,
              maxOutputTokens,
            },
          }),
        }
      )

      const data = await response.json()
      if (data.error) {
        errors.push(`${model}: ${data.error.message}`)
        continue
      }

      return {
        model,
        text: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude generar una respuesta.',
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      errors.push(`${model}: ${message}`)
    }
  }

  throw new Error(`No se pudo conectar con Gemini. Modelos probados: ${errors.join(' | ')}`)
}
