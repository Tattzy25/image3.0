"use client"

import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { BrushSettings } from "@/context/image-editor-context"

interface BrushPanelProps {
  brushSettings: BrushSettings
  setBrushSettings: (settings: BrushSettings) => void
}

export default function BrushPanel({ brushSettings, setBrushSettings }: BrushPanelProps) {
  const presetColors = [
    "#ffffff",
    "#000000",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#00ffff",
    "#ff00ff",
    "#ff8800",
    "#88ff00",
  ]

  const handleBrushSizeChange = (size: number) => {
    setBrushSettings({ ...brushSettings, size })
  }

  const handleBrushColorChange = (color: string) => {
    setBrushSettings({ ...brushSettings, color })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Brush Size</Label>
        <Slider
          value={[brushSettings.size]}
          min={1}
          max={50}
          step={1}
          onValueChange={(value) => handleBrushSizeChange(value[0])}
        />
        <div className="text-right text-xs text-zinc-400">{brushSettings.size}px</div>
      </div>

      <div className="space-y-2">
        <Label>Brush Color</Label>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-10 h-10 p-0 border-2"
                style={{ backgroundColor: brushSettings.color }}
              />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
              <HexColorPicker color={brushSettings.color} onChange={handleBrushColorChange} />
            </PopoverContent>
          </Popover>
          <div className="text-sm">{brushSettings.color}</div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Preset Colors</Label>
        <div className="flex flex-wrap gap-2">
          {presetColors.map((color) => (
            <Button
              key={color}
              variant="outline"
              className="w-8 h-8 p-0 border-2"
              style={{ backgroundColor: color }}
              onClick={() => handleBrushColorChange(color)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Brush Preview</Label>
        <div className="h-16 flex items-center justify-center bg-zinc-800 rounded-md">
          <div
            className="rounded-full"
            style={{
              backgroundColor: brushSettings.color,
              width: `${brushSettings.size}px`,
              height: `${brushSettings.size}px`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
