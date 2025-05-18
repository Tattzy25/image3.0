"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { useImageEditorContext } from "@/context/image-editor-context"
import ImageIcon from "@/components/ui/image-icon" // Declare ImageIcon here

const frameStyles = [
  { id: "simple", name: "Simple Border" },
  { id: "polaroid", name: "Polaroid" },
  { id: "vintage", name: "Vintage" },
  { id: "modern", name: "Modern" },
  { id: "shadow", name: "Drop Shadow" },
  { id: "rounded", name: "Rounded" },
  { id: "film", name: "Film Strip" },
  { id: "scalloped", name: "Scalloped" },
]

export default function FramePanel() {
  const [frameStyle, setFrameStyle] = useState("simple")
  const [borderWidth, setBorderWidth] = useState(10)
  const [borderColor, setBorderColor] = useState("#ffffff")
  const [borderRadius, setBorderRadius] = useState(0)
  const [padding, setPadding] = useState(20)
  const [shadowIntensity, setShadowIntensity] = useState(20)

  const { applyFrame } = useImageEditorContext()
  const { toast } = useToast()

  const handleApplyFrame = () => {
    try {
      if (typeof applyFrame === "function") {
        applyFrame({
          style: frameStyle,
          borderWidth,
          borderColor,
          borderRadius,
          padding,
          shadowIntensity,
        })

        toast({
          title: "Frame applied",
          description: `${frameStyles.find((f) => f.id === frameStyle)?.name} frame has been applied to your image`,
        })
      } else {
        throw new Error("Frame functionality not available")
      }
    } catch (error) {
      console.error("Error applying frame:", error)
      toast({
        title: "Error applying frame",
        description: "There was a problem applying the frame. Please try again.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="feature-label">Frame Style</label>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {frameStyles.map((style) => (
            <Button
              key={style.id}
              variant={frameStyle === style.id ? "default" : "outline"}
              className="h-auto py-3 justify-start"
              onClick={() => setFrameStyle(style.id)}
            >
              <div
                className="w-6 h-6 mr-2 border-2 rounded-sm"
                style={{
                  borderColor: style.id === "shadow" ? "transparent" : borderColor,
                  boxShadow: style.id === "shadow" ? "0 4px 8px rgba(0,0,0,0.5)" : "none",
                  borderRadius: style.id === "rounded" ? "50%" : "0",
                }}
              />
              {style.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="feature-label">Border Width</label>
            <span className="text-xs text-zinc-400">{borderWidth}px</span>
          </div>
          <Slider value={[borderWidth]} min={0} max={50} step={1} onValueChange={(value) => setBorderWidth(value[0])} />
        </div>

        <div className="space-y-2">
          <label className="feature-label">Border Color</label>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-10 h-10 p-0 border-2" style={{ backgroundColor: borderColor }} />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start">
                <HexColorPicker color={borderColor} onChange={setBorderColor} />
              </PopoverContent>
            </Popover>
            <div className="text-sm">{borderColor}</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="feature-label">Border Radius</label>
            <span className="text-xs text-zinc-400">{borderRadius}px</span>
          </div>
          <Slider
            value={[borderRadius]}
            min={0}
            max={50}
            step={1}
            onValueChange={(value) => setBorderRadius(value[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="feature-label">Padding</label>
            <span className="text-xs text-zinc-400">{padding}px</span>
          </div>
          <Slider value={[padding]} min={0} max={100} step={1} onValueChange={(value) => setPadding(value[0])} />
        </div>

        {frameStyle === "shadow" && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="feature-label">Shadow Intensity</label>
              <span className="text-xs text-zinc-400">{shadowIntensity}%</span>
            </div>
            <Slider
              value={[shadowIntensity]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setShadowIntensity(value[0])}
            />
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-zinc-700">
        <h4 className="font-medium mb-2">Preview</h4>
        <div className="bg-zinc-800 rounded-lg p-4 h-32 flex items-center justify-center">
          <div
            className="w-24 h-24 bg-zinc-600 flex items-center justify-center"
            style={{
              border: frameStyle !== "shadow" ? `${borderWidth}px solid ${borderColor}` : "none",
              borderRadius: `${borderRadius}px`,
              padding: `${padding}px`,
              boxShadow:
                frameStyle === "shadow"
                  ? `0 ${shadowIntensity / 5}px ${shadowIntensity / 2}px rgba(0,0,0,0.5)`
                  : "none",
            }}
          >
            <ImageIcon className="text-zinc-400" />
          </div>
        </div>
      </div>

      <Button className="w-full" onClick={handleApplyFrame}>
        Apply Frame
      </Button>
    </div>
  )
}
