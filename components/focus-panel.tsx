"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Circle, Square, Hexagon, FocusIcon } from "lucide-react"
import { useImageEditorContext } from "@/context/image-editor-context"

const focusShapes = [
  { id: "circle", name: "Circle", icon: Circle },
  { id: "rectangle", name: "Rectangle", icon: Square },
  { id: "hexagon", name: "Hexagon", icon: Hexagon },
]

const focusEffects = [
  { id: "blur", name: "Blur" },
  { id: "darken", name: "Darken" },
  { id: "lighten", name: "Lighten" },
  { id: "desaturate", name: "Desaturate" },
  { id: "vignette", name: "Vignette" },
]

export default function FocusPanel() {
  const [activeTab, setActiveTab] = useState("selective")
  const [focusShape, setFocusShape] = useState("circle")
  const [focusEffect, setFocusEffect] = useState("blur")
  const [focusSettings, setFocusSettings] = useState({
    intensity: 50,
    feather: 30,
    size: 50,
    x: 50,
    y: 50,
  })

  const { applyFocusEffect } = useImageEditorContext()

  const handleSettingChange = (setting: string, value: number) => {
    setFocusSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))

    // Apply changes in real-time
    applyFocusEffect?.({
      ...focusSettings,
      [setting]: value,
      shape: focusShape,
      effect: focusEffect,
    })
  }

  const handleApplyFocus = () => {
    applyFocusEffect?.({
      ...focusSettings,
      shape: focusShape,
      effect: focusEffect,
    })
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="selective">Selective Focus</TabsTrigger>
          <TabsTrigger value="tiltshift">Tilt Shift</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "selective" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Focus Shape</label>
            <div className="grid grid-cols-3 gap-2">
              {focusShapes.map((shape) => (
                <Button
                  key={shape.id}
                  variant={focusShape === shape.id ? "default" : "outline"}
                  className="flex flex-col items-center py-3"
                  onClick={() => setFocusShape(shape.id)}
                >
                  <shape.icon className="h-6 w-6 mb-1" />
                  <span className="text-xs">{shape.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Effect Type</label>
            <Select value={focusEffect} onValueChange={setFocusEffect}>
              <SelectTrigger>
                <SelectValue placeholder="Effect" />
              </SelectTrigger>
              <SelectContent>
                {focusEffects.map((effect) => (
                  <SelectItem key={effect.id} value={effect.id}>
                    {effect.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Effect Intensity</label>
            <Slider
              value={[focusSettings.intensity]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => handleSettingChange("intensity", value[0])}
            />
            <div className="text-right text-xs text-zinc-400">{focusSettings.intensity}%</div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Feather Edge</label>
            <Slider
              value={[focusSettings.feather]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => handleSettingChange("feather", value[0])}
            />
            <div className="text-right text-xs text-zinc-400">{focusSettings.feather}%</div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Size</label>
            <Slider
              value={[focusSettings.size]}
              min={10}
              max={100}
              step={1}
              onValueChange={(value) => handleSettingChange("size", value[0])}
            />
            <div className="text-right text-xs text-zinc-400">{focusSettings.size}%</div>
          </div>

          <div className="pt-4 border-t border-zinc-700">
            <p className="text-sm text-zinc-400 mb-3">Position the focus area by clicking and dragging on the image</p>
            <Button className="w-full" onClick={handleApplyFocus}>
              Apply Focus Effect
            </Button>
          </div>
        </div>
      )}

      {activeTab === "tiltshift" && (
        <div className="space-y-4">
          <div className="bg-zinc-800 rounded-lg p-4 flex items-center justify-center">
            <FocusIcon className="h-12 w-12 text-zinc-500" />
          </div>

          <p className="text-sm text-zinc-400">
            Tilt shift creates a miniature effect by blurring parts of the image while keeping a horizontal or vertical
            strip in focus.
          </p>

          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Blur Intensity</label>
            <Slider
              value={[focusSettings.intensity]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => handleSettingChange("intensity", value[0])}
            />
            <div className="text-right text-xs text-zinc-400">{focusSettings.intensity}%</div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Focus Area Width</label>
            <Slider
              value={[focusSettings.size]}
              min={5}
              max={50}
              step={1}
              onValueChange={(value) => handleSettingChange("size", value[0])}
            />
            <div className="text-right text-xs text-zinc-400">{focusSettings.size}%</div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Position</label>
            <Slider
              value={[focusSettings.y]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => handleSettingChange("y", value[0])}
            />
            <div className="text-right text-xs text-zinc-400">{focusSettings.y}%</div>
          </div>

          <div className="pt-4 border-t border-zinc-700">
            <Button className="w-full" onClick={handleApplyFocus}>
              Apply Tilt Shift
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
