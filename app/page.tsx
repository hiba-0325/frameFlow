"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, Download } from "lucide-react"

export default function ImageToVideoPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
      setVideoUrl(null)
    }
  }

  const handleGenerateVideo = async () => {
    if (!selectedFile) {
      setError("Please select an image file first")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("image", selectedFile)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate video")
      }

      setVideoUrl(result.video)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadVideo = async () => {
    if (!videoUrl) return

    try {
      const response = await fetch(videoUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "generated-video.mp4"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError("Failed to download video")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Image to AI Video
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 dark:border-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> an image
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, JPEG (MAX. 10MB)</p>
                </div>
                <Input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </label>
            </div>

            {selectedFile && <p className="text-sm text-gray-600 dark:text-gray-400">Selected: {selectedFile.name}</p>}
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateVideo}
            disabled={!selectedFile || isLoading}
            className="w-full h-12 text-lg font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Video...
              </>
            ) : (
              "Generate Video"
            )}
          </Button>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Video Display */}
          {videoUrl && (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden bg-black">
                <video src={videoUrl} controls className="w-full h-auto" preload="metadata">
                  Your browser does not support the video tag.
                </video>
              </div>

              <Button onClick={handleDownloadVideo} variant="outline" className="w-full bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download Video
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
