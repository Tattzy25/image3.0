"use client"

import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import type { Adjustments } from "@/context/image-editor-context"

interface AdjustPanelProps {
  adjustments: Adjustments
  applyAdjustments: (adjustments: Adjustments) => void
}

export default function AdjustPanel({ adjustments, applyAdjustments }: AdjustPanelProps) {
  const handleAdjustmentChange = (id: keyof Adjustments, value: number) => {
    const newAdjustments = { ...adjustments, [id]: value }
    applyAdjustments(newAdjustments)
  }

  const resetAdjustments = () => {
    applyAdjustments({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      temperature: 0,
      blur: 0,
      sharpen: 0,
      vibrance: 0,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Adjustments</h3>
        <Button variant="ghost" size="sm" onClick={resetAdjustments}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="brightness">Brightness</Label>
            <span className="text-xs text-zinc-400">{adjustments.brightness}%</span>
          </div>
          <Slider
            id="brightness"
            value={[adjustments.brightness]}
            min={0}
            max={200}
            step={1}
            onValueChange={(value) => handleAdjustmentChange("brightness", value[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="contrast">Contrast</Label>
            <span className="text-xs text-zinc-400">{adjustments.contrast}%</span>
          </div>
          <Slider
            id="contrast"
            value={[adjustments.contrast]}
            min={0}
            max={200}
            step={1}
            onValueChange={(value) => handleAdjustmentChange("contrast", value[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="saturation">Saturation</Label>
            <span className="text-xs text-zinc-400">{adjustments.saturation}%</span>
          </div>
          <Slider
            id="saturation"
            value={[adjustments.saturation]}
            min={0}
            max={200}
            step={1}
            onValueChange={(value) => handleAdjustmentChange("saturation", value[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="temperature">Temperature</Label>
            <span className="text-xs text-zinc-400">
              {adjustments.temperature > 0 ? "+" : ""}
              {adjustments.temperature}
            </span>
          </div>
          <Slider
            id="temperature"
            value={[adjustments.temperature]}
            min={-50}
            max={50}
            step={1}
            onValueChange={(value) => handleAdjustmentChange("temperature", value[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="blur">Blur</Label>
            <span className="text-xs text-zinc-400">{adjustments.blur}</span>
          </div>
          <Slider
            id="blur"
            value={[adjustments.blur]}
            min={0}
            max={20}
            step={1}
            onValueChange={(value) => handleAdjustmentChange("blur", value[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="sharpen">Sharpen</Label>
            <span className="text-xs text-zinc-400">{adjustments.sharpen}</span>
          </div>
          <Slider
            id="sharpen"
            value={[adjustments.sharpen]}
            min={0}
            max={20}
            step={1}
            onValueChange={(value) => handleAdjustmentChange("sharpen", value[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="vibrance">Vibrance</Label>
            <span className="text-xs text-zinc-400">{adjustments.vibrance}</span>
          </div>
          <Slider
            id="vibrance"
            value={[adjustments.vibrance]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => handleAdjustmentChange("vibrance", value[0])}
          />
        </div>
      </div>
    </div>
  )
}
