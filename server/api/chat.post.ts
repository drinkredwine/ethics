import Anthropic from "@anthropic-ai/sdk";

export default defineEventHandler(async (event) => {
  const { message, context } = await readBody(event);

  const config = useRuntimeConfig();
  const anthropic = new Anthropic({
    apiKey: config.anthropicApiKey,
  });

  try {
    const stream = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      temperature: 0.3,
      messages: [
        {
          role: "user",
          content: `${context}\n\nUser message: ${message}`,
        },
      ],
      stream: true,
    });

    setHeader(event, "Content-Type", "text/event-stream");
    setHeader(event, "Cache-Control", "no-cache");
    setHeader(event, "Connection", "keep-alive");

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          // Send initial positive feedback
          const isSlovak =
            message.includes("slovenský") ||
            context.includes("slovak") ||
            context.includes("sk");
          const initialFeedback = JSON.stringify({
            type: "insight",
            title: isSlovak ? "Analýza začína" : "Analysis Starting",
            content: isSlovak
              ? "Vaše premyslené odpovede sa starostlivo analyzujú..."
              : "Your thoughtful responses are being carefully analyzed...",
          });
          controller.enqueue(encoder.encode(`data: ${initialFeedback}\n\n`));

          let accumulatedContent = "";
          let lastInsightTime = Date.now();

          for await (const chunk of stream) {
            if (chunk.type === "content_block_delta") {
              const newContent =
                chunk.delta.type === "text_delta" ? chunk.delta.text : "";
              accumulatedContent += newContent;

              // Send regular content updates
              const data = JSON.stringify({
                type: "content",
                content: newContent,
              });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));

              // Send periodic positive insights during streaming
              const now = Date.now();
              if (now - lastInsightTime > 2000) {
                let insightTitle = isSlovak ? "Spracúvam..." : "Processing...";
                let insightContent = isSlovak
                  ? "Analyzujem vaše vzory morálneho uvažovania..."
                  : "Analyzing your moral reasoning patterns...";

                if (
                  accumulatedContent.includes("Stage") ||
                  accumulatedContent.includes("štádium")
                ) {
                  insightTitle = isSlovak
                    ? "Štádium morálneho vývoja identifikované"
                    : "Moral Development Stage Identified";
                  insightContent = isSlovak
                    ? "Vaše odpovede odhaľujú vašu súčasnú úroveň morálneho uvažovania."
                    : "Your responses reveal your current level of moral reasoning.";
                } else if (
                  accumulatedContent.includes("recommend") ||
                  accumulatedContent.includes("odporúčan")
                ) {
                  insightTitle = isSlovak
                    ? "Personalizované odporúčania pre rast"
                    : "Personalized Growth Recommendations";
                  insightContent = isSlovak
                    ? "Vytváram špecifické rady pre vašu cestu morálneho vývoja."
                    : "Generating specific advice for your moral development journey.";
                } else if (
                  accumulatedContent.includes("analysis") ||
                  accumulatedContent.includes("analýz")
                ) {
                  insightTitle = isSlovak
                    ? "Hĺbková analýza dokončená"
                    : "Deep Analysis Complete";
                  insightContent = isSlovak
                    ? "Vaše odpovede ukazujú sofistikované etické myslenie."
                    : "Your responses show sophisticated ethical thinking.";
                }

                const insight = JSON.stringify({
                  type: "insight",
                  title: insightTitle,
                  content: insightContent,
                });
                controller.enqueue(encoder.encode(`data: ${insight}\n\n`));
                lastInsightTime = now;
              }
            }
          }

          // Send final positive insight
          const finalInsight = JSON.stringify({
            type: "insight",
            title: isSlovak ? "Analýza dokončená" : "Analysis Complete",
            content: isSlovak
              ? "Váš personalizovaný profil morálneho vývoja je pripravený!"
              : "Your personalized moral development profile is ready!",
          });
          controller.enqueue(encoder.encode(`data: ${finalInsight}\n\n`));

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
          );
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return readable;
  } catch (error) {
    console.error("API Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to connect to Anthropic API",
    });
  }
});
