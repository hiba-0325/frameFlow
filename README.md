# Image to AI Video Generator

A full-stack Next.js application that converts images to AI-generated videos using n8n webhooks.

## Features

- 🖼️ Image upload with drag-and-drop interface
- 🤖 AI-powered image-to-video generation via n8n
- 📹 Video preview with HTML5 player
- ⬇️ Video download functionality
- 🎨 Modern, responsive UI with Tailwind CSS
- 🌙 Dark mode support

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- An n8n instance with image-to-video workflow
- n8n webhook URL configured

### Installation

1. **Clone and install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure environment variables:**
   
   Create a `.env.local` file in the root directory:
   \`\`\`env
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/image-to-video
   \`\`\`

3. **Run the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser:**
   Navigate to `http://localhost:3000`

### n8n Webhook Configuration

Your n8n webhook should:
- Accept multipart/form-data with an `image` field
- Process the image through your AI video generation workflow
- Return JSON response with a `video` field containing the video URL

Example n8n response format:
\`\`\`json
{
  "video": "https://your-storage.com/generated-video.mp4"
}
\`\`\`

### Production Deployment

1. **Deploy to Vercel:**
   \`\`\`bash
   npm run build
   vercel --prod
   \`\`\`

2. **Set environment variables in Vercel:**
   - Go to your Vercel project settings
   - Add `N8N_WEBHOOK_URL` in the Environment Variables section

## API Endpoints

### POST /api/upload

Accepts image uploads and forwards them to the configured n8n webhook.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `image` field with image file

**Response:**
\`\`\`json
{
  "success": true,
  "video": "https://example.com/video.mp4"
}
\`\`\`

## Error Handling

The application handles various error scenarios:
- Invalid file types
- Missing n8n webhook configuration
- n8n webhook failures
- Network errors
- Invalid responses

## Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes
- **Integration:** n8n webhooks
- **Deployment:** Vercel (recommended)
