import fs from 'node:fs'
import OpenAI from 'openai'

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost',
    'X-Title': 'Test',
  },
})

const img = fs.readFileSync('temp_img.jpg').toString('base64')

const run = async () => {
  try {
    const completion = await client.chat.completions.create({
      model: 'google/gemini-2.5-flash-image-preview',
      modalities: ['image'],
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Describe the weather here' },
            { type: 'input_image', image_base64: img },
          ],
        },
      ],
    })
    console.log(JSON.stringify(completion, null, 2))
  } catch (error) {
    console.error('error', error)
  }
}

run()
