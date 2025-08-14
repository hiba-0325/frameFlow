import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File
    const prompt = formData.get("prompt") as string | null

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Get n8n webhook URL from environment variables
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    if (!n8nWebhookUrl) {
      return NextResponse.json({ error: "N8N webhook URL not configured" }, { status: 500 })
    }

    // Create FormData to send to n8n webhook
    const n8nFormData = new FormData()
    n8nFormData.append("image", file)

    if (prompt && prompt.trim()) {
      n8nFormData.append("prompt", prompt.trim())
    }

    // Forward the data to n8n webhook
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: "POST",
      body: n8nFormData,
    })

    if (!n8nResponse.ok) {
      throw new Error(`N8N webhook failed with status: ${n8nResponse.status}`)
    }

    const n8nResult = await n8nResponse.json()

    // Validate that we received a video URL
    if (!n8nResult.video) {
      throw new Error("N8N webhook did not return a video URL")
    }

    return NextResponse.json({
      success: true,
      video: n8nResult.video,
    })
  } catch (error) {
    console.error("Upload API error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}
