"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload, Wand2, Scissors, ArrowUpCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useImageEditorContext } from "@/context/image-editor-context"

interface ReplicatePanelProps {
  onImageGenerated: (imageUrl: string) => void
}

export default function ReplicatePanel({ onImageGenerated }: ReplicatePanelProps) {
  const [activeTab, setActiveTab] = useState("generate")
  const [prompt, setPrompt] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { toast } = useToast()
  const { image } = useImageEditorContext()

  // Models
  const MODELS = {
    generate: "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
    upscale: "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
    removeBg: "cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleUseCurrentImage = () => {
    if (image) {
      setUploadedImage(image)
    } else {
      toast({
        title: "No image available",
        description: "Please upload an image first",
      })
    }
  }

  const processImage = async (type: "generate" | "upscale" | "removeBg") => {
    try {
      setIsProcessing(true)
      setProgress(0)

      let input: any = {}
      let model = ""

      switch (type) {
        case "generate":
          model = MODELS.generate
          input = { prompt }
          break
        case "upscale":
          if (!uploadedImage) {
            throw new Error("Please upload an image first")
          }
          model = MODELS.upscale
          input = { image: uploadedImage }
          break
        case "removeBg":
          if (!uploadedImage) {
            throw new Error("Please upload an image first")
          }
          model = MODELS.removeBg
          input = { image: uploadedImage }
          break
      }

      // Start prediction
      const startResponse = await fetch("/api/replicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, input }),
      })

      if (!startResponse.ok) {
        const error = await startResponse.json()
        throw new Error(error.error || "Failed to start processing")
      }

      const { id } = await startResponse.json()

      // Poll for results
      let result = null
      let attempts = 0
      const maxAttempts = 60 // 30 seconds with 500ms interval

      while (!result && attempts < maxAttempts) {
        attempts++
        setProgress(Math.min(95, Math.floor((attempts / maxAttempts) * 100)))

        await new Promise((resolve) => setTimeout(resolve, 500))

        const statusResponse = await fetch(`/api/replicate?id=${id}`)
        if (!statusResponse.ok) {
          continue
        }

        const prediction = await statusResponse.json()

        if (prediction.status === "succeeded") {
          result = prediction.output
          break
        } else if (prediction.status === "failed") {
          throw new Error(prediction.error || "Processing failed")
        }
      }

      if (!result) {
        throw new Error("Processing timed out")
      }

      setProgress(100)

      // Handle the result based on the type
      let resultUrl = ""
      if (type === "generate" || type === "upscale") {
        resultUrl = Array.isArray(result) ? result[0] : result
      } else if (type === "removeBg") {
        resultUrl = result
      }

      // Convert remote URL to data URL
      const imageResponse = await fetch(resultUrl)
      const blob = await imageResponse.blob()
      const reader = new FileReader()

      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        onImageGenerated(dataUrl)

        toast({
          title: "Success!",
          description: `Image ${type === "generate" ? "generated" : type === "upscale" ? "upscaled" : "background removed"} successfully`,
        })
      }

      reader.readAsDataURL(blob)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="generate" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="generate">
            <Wand2 className="h-4 w-4 mr-2" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="upscale">
            <ArrowUpCircle className="h-4 w-4 mr-2" />
            Upscale
          </TabsTrigger>
          <TabsTrigger value="removeBg">
            <Scissors className="h-4 w-4 mr-2" />
            Remove BG
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <div className="bg-zinc-800 rounded-lg p-4">
            <h3 className="font-medium mb-3">Generate Image with AI</h3>
            <Textarea
              placeholder="Describe the image you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] mb-4"
              disabled={isProcessing}
            />
            <Button
              onClick={() => processImage("generate")}
              disabled={isProcessing || !prompt.trim()}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating... {progress}%
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Image
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="upscale" className="space-y-4">
          <div className="bg-zinc-800 rounded-lg p-4">
            <h3 className="font-medium mb-3">Upscale Image</h3>
            <p className="text-sm text-zinc-400 mb-4">Enhance your image quality and resolution with AI upscaling.</p>

            {uploadedImage ? (
              <div className="mb-4">
                <div className="relative aspect-square bg-zinc-700 rounded-md overflow-hidden mb-2">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="To upscale"
                    className="w-full h-full object-contain"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={() => setUploadedImage(null)} className="w-full">
                  Change Image
                </Button>
              </div>
            ) : (
              <div className="space-y-2 mb-4">
                <Button onClick={handleUploadClick} variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                <Button onClick={handleUseCurrentImage} variant="outline" className="w-full">
                  Use Current Image
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              </div>
            )}

            <Button
              onClick={() => processImage("upscale")}
              disabled={isProcessing || !uploadedImage}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Upscaling... {progress}%
                </>
              ) : (
                <>
                  <ArrowUpCircle className="h-4 w-4 mr-2" />
                  Upscale Image
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="removeBg" className="space-y-4">
          <div className="bg-zinc-800 rounded-lg p-4">
            <h3 className="font-medium mb-3">Remove Background</h3>
            <p className="text-sm text-zinc-400 mb-4">Automatically remove the background from your image.</p>

            {uploadedImage ? (
              <div className="mb-4">
                <div className="relative aspect-square bg-zinc-700 rounded-md overflow-hidden mb-2">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="To remove background"
                    className="w-full h-full object-contain"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={() => setUploadedImage(null)} className="w-full">
                  Change Image
                </Button>
              </div>
            ) : (
              <div className="space-y-2 mb-4">
                <Button onClick={handleUploadClick} variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                <Button onClick={handleUseCurrentImage} variant="outline" className="w-full">
                  Use Current Image
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              </div>
            )}

            <Button
              onClick={() => processImage("removeBg")}
              disabled={isProcessing || !uploadedImage}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removing Background... {progress}%
                </>
              ) : (
                <>
                  <Scissors className="h-4 w-4 mr-2" />
                  Remove Background
                </>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
