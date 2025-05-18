import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query") || "nature"
  const page = searchParams.get("page") || "1"
  const perPage = searchParams.get("per_page") || "20"

  // Replace with your actual Pexels API key
  const apiKey = process.env.PEXELS_API_KEY || "YOUR_PEXELS_API_KEY"

  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${query}&page=${page}&per_page=${perPage}`, {
      headers: {
        Authorization: apiKey,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching stock images:", error)
    return NextResponse.json({ error: "Failed to fetch stock images" }, { status: 500 })
  }
}
