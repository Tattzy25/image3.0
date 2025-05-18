"use client"

import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { EyeIcon as EyeDropper, Circle, Square, PenTool, Info } from "lucide-react"
import type { BrushSettings } from "@/context/image-editor-context"
import { useState } from "react"

interface BrushPanelProps {
  brushSettings: BrushSettings
  setBrushSettings: (settings: BrushSettings) => void
  pickColorFromCanvas?: () => void
}

export default function BrushPanel({ brushSettings, setBrushSettings, pickColorFromCanvas }: BrushPanelProps) {
  const [recentColors, setRecentColors] = useState<string[]>([])

  // Dynamic preset colors with a variety of options
  const presetColors = [
    "#ffffff", // White
    "#000000", // Black
    "#ff0000", // Red
    "#00ff00", // Green
    "#0000ff", // Blue
    "#ffff00", // Yellow
    "#ff00ff", // Magenta
    "#00ffff", // Cyan
    "#ff8800", // Orange
    "#8800ff", // Purple
  ]

  const brushStyles = [
    { id: "round", name: "Round", icon: Circle },
    { id: "square", name: "Square", icon: Square },
    { id: "calligraphy", name: "Calligraphy", icon: PenTool },
  ]

  const handleBrushSizeChange = (size: number) => {
    setBrushSettings({ ...brushSettings, size })
  }

  const handleBrushOpacityChange = (opacity: number) => {
    setBrushSettings({ ...brushSettings, opacity })
  }

  const handleBrushColorChange = (color: string) => {
    setBrushSettings({ ...brushSettings, color })

    // Add to recent colors if not already there
    if (!recentColors.includes(color)) {
      setRecentColors((prev) => [color, ...prev.slice(0, 4)])
    }
  }

  const handleBrushStyleChange = (style: "round" | "square" | "calligraphy") => {
    setBrushSettings({ ...brushSettings, style })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Brush Size</Label>
        <Slider
          value={[brushSettings.size]}
          min={1}
          max={100}
          step={1}
          onValueChange={(value) => handleBrushSizeChange(value[0])}
        />
        <div className="text-right text-xs text-zinc-400">{brushSettings.size}px</div>
      </div>

      <div className="space-y-2">
        <Label>Brush Opacity</Label>
        <Slider
          value={[brushSettings.opacity]}
          min={1}
          max={100}
          step={1}
          onValueChange={(value) => handleBrushOpacityChange(value[0])}
        />
        <div className="text-right text-xs text-zinc-400">{brushSettings.opacity}%</div>
      </div>

      <div className="space-y-2">
        <Label>Brush Style</Label>
        <div className="flex gap-2">
          {brushStyles.map((style) => (
            <Button
              key={style.id}
              variant={brushSettings.style === style.id ? "default" : "outline"}
              className="flex-1 flex flex-col items-center py-2 gap-1"
              style={{
                background:
                  brushSettings.style === style.id
                    ? "linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)"
                    : "white",
              }}
              onClick={() => handleBrushStyleChange(style.id as "round" | "square" | "calligraphy")}
            >
              <style.icon className="h-5 w-5" />
              <span className="text-xs">{style.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Brush Color</Label>
          {pickColorFromCanvas && (
            <Button variant="outline" size="sm" className="flex items-center gap-1 h-8" onClick={pickColorFromCanvas}>
              <EyeDropper className="h-4 w-4" />
              <span className="text-xs">Pick Color</span>
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-10 h-10 p-0 border-2"
                style={{
                  backgroundColor: brushSettings.color,
                  background: brushSettings.color,
                }}
              />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
              <HexColorPicker color={brushSettings.color} onChange={handleBrushColorChange} />
            </PopoverContent>
          </Popover>
          <div className="text-sm">{brushSettings.color}</div>
        </div>
      </div>

      {recentColors.length > 0 && (
        <div className="space-y-2">
          <Label>Recent Colors</Label>
          <div className="flex flex-wrap gap-2">
            {recentColors.map((color) => (
              <Button
                key={color}
                variant="outline"
                className="w-8 h-8 p-0 border-2"
                style={{
                  backgroundColor: color,
                  background: color,
                  borderColor: brushSettings.color === color ? "#000" : "transparent",
                }}
                onClick={() => handleBrushColorChange(color)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Preset Colors</Label>
        <div className="flex flex-wrap gap-2">
          {presetColors.map((color) => (
            <Button
              key={color}
              variant="outline"
              className="w-8 h-8 p-0 border-2 preset-color-button"
              style={{
                backgroundColor: color,
                background: color,
                borderColor: brushSettings.color === color ? "#000" : "transparent",
              }}
              onClick={() => handleBrushColorChange(color)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Brush Preview</Label>
        <div className="h-16 flex items-center justify-center bg-zinc-800 rounded-md">
          <div
            className={brushSettings.style === "calligraphy" ? "transform rotate-45" : ""}
            style={{
              backgroundColor: brushSettings.color,
              background: brushSettings.color,
              width: `${brushSettings.size}px`,
              height: brushSettings.style === "calligraphy" ? `${brushSettings.size * 2}px` : `${brushSettings.size}px`,
              borderRadius: brushSettings.style === "round" ? "50%" : brushSettings.style === "calligraphy" ? "0" : "0",
              opacity: brushSettings.opacity / 100,
            }}
          />
        </div>
      </div>

      <div className="bg-amber-100 border border-amber-300 rounded-md p-3 text-amber-800 text-sm">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Brush Tips:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use the eyedropper to pick colors from your image</li>
              <li>Adjust opacity for transparent brush strokes</li>
              <li>Try different brush styles for creative effects</li>
              <li>A brush size preview will follow your cursor</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
