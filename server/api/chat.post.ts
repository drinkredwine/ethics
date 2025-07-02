import Anthropic from '@anthropic-ai/sdk'

export default defineEventHandler(async (event) => {
  const { message, context } = await readBody(event)
  
  const config = useRuntimeConfig()
  const anthropic = new Anthropic({
    apiKey: config.anthropicApiKey,
  })

  try {
    const stream = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `${context}\n\nUser message: ${message}`
        }
      ],
      stream: true
    })

    setHeader(event, 'Content-Type', 'text/event-stream')
    setHeader(event, 'Cache-Control', 'no-cache')
    setHeader(event, 'Connection', 'keep-alive')

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta') {
              const data = JSON.stringify({ 
                type: 'content', 
                content: chunk.delta.text 
              })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`))
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      }
    })

    return readable
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to connect to Anthropic API'
    })
  }
})