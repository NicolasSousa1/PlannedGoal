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
const MAX_ATTEMPTS = 3

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

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
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
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

      if (response.ok) {
        const data = await response.json()
        return res.status(200).json(data)
      }

      const errorDetails = await response.text()
      if (response.status === 503 && attempt < MAX_ATTEMPTS) {
        const delay = 1_000 * 2 ** (attempt - 1) + Math.random() * 500
        console.warn(`Gemini retornou 503; nova tentativa em ${Math.round(delay)}ms.`)
        await wait(delay)
        continue
      }

      console.error('Gemini retornou erro:', response.status, errorDetails)
      return res
        .status(response.status === 503 ? 503 : 502)
        .json({ error: 'Não foi possível gerar o diagnóstico.' })
    }

    return res.status(503).json({ error: 'Gemini está temporariamente indisponível.' })
  } catch (error) {
    console.error('Falha ao chamar Gemini:', error)
    return res.status(502).json({ error: 'Não foi possível gerar o diagnóstico.' })
  }
}
