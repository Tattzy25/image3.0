import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { prompt, style } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Create a detailed prompt based on user input and selected style
    const detailedPrompt = `Create an image of: ${prompt}. Style: ${style || "photorealistic"}.`

    // Generate image description using AI
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `You are an image description expert. Create a detailed DALL-E prompt based on this request: "${detailedPrompt}". Make it detailed and descriptive for image generation. Only respond with the prompt text, no explanations.`,
    })

    // In a real implementation, you would use the OpenAI API to generate an image
    // For now, we'll return a placeholder with the generated description
    return NextResponse.json({
      success: true,
      imageUrl: `/placeholder.svg?height=512&width=512&query=${encodeURIComponent(text)}`,
      prompt: text,
    })
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}
