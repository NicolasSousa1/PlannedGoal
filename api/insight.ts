interface VercelRequest {
  method?: string
  body?: {
    prompt?: unknown
  }
}

interface VercelResponse {
  status: (code: number) => VercelResponse
  json: (body: unknown) => void
}

const MODEL_NAME = 'gemini-flash-latest'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' })
  }

  const prompt = req.body?.prompt
  if (typeof prompt !== 'string' || prompt.length === 0 || prompt.length > 10_000) {
    return res.status(400).json({ error: 'Prompt inválido.' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('GEMINI_API_KEY não está configurada.')
    return res.status(500).json({ error: 'Serviço de diagnóstico indisponível.' })
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    )

    if (!response.ok) {
      console.error('Gemini retornou status:', response.status)
      return res.status(502).json({ error: 'Não foi possível gerar o diagnóstico.' })
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    console.error('Falha ao chamar Gemini:', error)
    return res.status(502).json({ error: 'Não foi possível gerar o diagnóstico.' })
  }
}
