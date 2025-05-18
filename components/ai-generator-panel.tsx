"use client"

import type React from "react"

import { useState } from "react"
import { X, Wand2, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useImageEditorContext } from "@/context/image-editor-context"

interface AIGeneratorPanelProps {
  setIsGeneratingImage: (isGenerating: boolean) => void
}

export default function AIGeneratorPanel({ setIsGeneratingImage }: AIGeneratorPanelProps) {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("photorealistic")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const { toast } = useToast()
  const { setImage, addToHistory, addLayer } = useImageEditorContext()

  const styles = [
    { id: "photorealistic", name: "Photorealistic" },
    { id: "cartoon", name: "Cartoon" },
    { id: "3d_render", name: "3D Render" },
    { id: "pixel_art", name: "Pixel Art" },
    { id: "sketch", name: "Sketch" },
    { id: "watercolor", name: "Watercolor" },
    { id: "oil_painting", name: "Oil Painting" },
    { id: "digital_art", name: "Digital Art" },
  ]

  const handleClose = () => {
    setIsGeneratingImage(false)
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to generate an image",
      })
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, style }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      const data = await response.json()

      if (data.success && data.imageUrl) {
        setGeneratedImage(data.imageUrl)
        toast({
          title: "Image generated",
          description: "Your AI image has been successfully generated",
        })
      } else {
        throw new Error(data.error || "Failed to generate image")
      }
    } catch (error) {
      console.error("Error generating image:", error)
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUseImage = () => {
    if (generatedImage) {
      setImage(generatedImage)
      addToHistory(generatedImage)

      // Add as a new layer
      addLayer({
        id: `layer-${Date.now()}`,
        name: "AI Generated Image",
        type: "image",
        visible: true,
        data: generatedImage,
        position: { x: 0, y: 0 },
        opacity: 100,
      })

      setIsGeneratingImage(false)

      toast({
        title: "Image applied",
        description: "The generated image has been added to your canvas",
      })
    }
  }

  // Handle clicking outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-zinc-900 rounded-lg max-w-2xl w-full p-6 relative">
        {/* More prominent close button */}
        <Button variant="destructive" size="icon" className="absolute right-4 top-4 z-10" onClick={handleClose}>
          <X className="h-5 w-5" />
        </Button>

        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Wand2 className="h-5 w-5 mr-2 text-purple-500" />
          AI Image Generator
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Image Description</label>
            <Textarea
              placeholder="Describe the image you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Style</label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                {styles.map((styleOption) => (
                  <SelectItem key={styleOption.id} value={styleOption.id}>
                    {styleOption.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="w-1/2" onClick={handleClose}>
              Cancel
            </Button>

            <Button
              className="w-1/2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Image
                </>
              )}
            </Button>
          </div>

          {generatedImage && (
            <div className="mt-4">
              <div className="border border-zinc-700 rounded-md overflow-hidden">
                <img src={generatedImage || "/placeholder.svg"} alt="Generated" className="w-full h-auto" />
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1" onClick={handleClose}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button variant="default" className="flex-1" onClick={handleUseImage}>
                  <Download className="h-4 w-4 mr-2" />
                  Use Image
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
