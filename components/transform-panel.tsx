"use client"

import { useState } from "react"
import { RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Crop, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TransformPanelProps {
  setCropMode: (mode: boolean) => void
  applyCrop: () => void
  rotateImage: (degrees: number) => void
  flipImage: (direction: "horizontal" | "vertical") => void
  isGeneratingImage: boolean
  setIsGeneratingImage: (isGenerating: boolean) => void
}

export default function TransformPanel({
  setCropMode,
  applyCrop,
  rotateImage,
  flipImage,
  isGeneratingImage,
  setIsGeneratingImage,
}: TransformPanelProps) {
  const [activeTab, setActiveTab] = useState<string>("transform")

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="transform">Transform</TabsTrigger>
          <TabsTrigger value="generate">AI Generate</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "transform" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => rotateImage(-90)} className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Rotate Left
            </Button>
            <Button variant="outline" onClick={() => rotateImage(90)} className="flex items-center gap-2">
              <RotateCw className="h-4 w-4" />
              Rotate Right
            </Button>
            <Button variant="outline" onClick={() => flipImage("horizontal")} className="flex items-center gap-2">
              <FlipHorizontal className="h-4 w-4" />
              Flip Horizontal
            </Button>
            <Button variant="outline" onClick={() => flipImage("vertical")} className="flex items-center gap-2">
              <FlipVertical className="h-4 w-4" />
              Flip Vertical
            </Button>
          </div>

          <div className="pt-2 border-t border-zinc-700">
            <Button
              variant="outline"
              onClick={() => setCropMode(true)}
              className="w-full flex items-center justify-center gap-2"
            >
              <Crop className="h-4 w-4" />
              Crop Image
            </Button>
            <p className="text-xs text-zinc-400 mt-2">
              Click and drag on the image to select crop area, then click Apply Crop
            </p>
            <Button variant="default" onClick={applyCrop} className="w-full mt-2">
              Apply Crop
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Button
            variant="default"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            onClick={() => setIsGeneratingImage(true)}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate with DALL-E (Demo)
          </Button>
          <p className="text-xs text-zinc-400">
            This is a demo of AI image generation. In a real app, this would connect to OpenAI's DALL-E API.
          </p>
          <div className="bg-amber-900/30 border border-amber-700/50 rounded-md p-3 text-amber-200 text-xs">
            <p>
              Note: This is a demonstration only. No actual API calls will be made, and a sample image will be shown.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
