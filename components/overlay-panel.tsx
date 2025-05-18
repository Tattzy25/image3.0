"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Layers, Droplets, Sun, Cloud, Sparkles } from "lucide-react"
import { useImageEditorContext } from "@/context/image-editor-context"

const overlayTypes = [
  { id: "color", name: "Color" },
  { id: "gradient", name: "Gradient" },
  { id: "texture", name: "Texture" },
  { id: "light", name: "Light Leak" },
  { id: "dust", name: "Dust" },
  { id: "rain", name: "Rain" },
  { id: "snow", name: "Snow" },
  { id: "fog", name: "Fog" },
  { id: "bokeh", name: "Bokeh" },
]

const blendModes = [
  { id: "normal", name: "Normal" },
  { id: "multiply", name: "Multiply" },
  { id: "screen", name: "Screen" },
  { id: "overlay", name: "Overlay" },
  { id: "darken", name: "Darken" },
  { id: "lighten", name: "Lighten" },
  { id: "color-dodge", name: "Color Dodge" },
  { id: "color-burn", name: "Color Burn" },
  { id: "hard-light", name: "Hard Light" },
  { id: "soft-light", name: "Soft Light" },
  { id: "difference", name: "Difference" },
  { id: "exclusion", name: "Exclusion" },
  { id: "hue", name: "Hue" },
  { id: "saturation", name: "Saturation" },
  { id: "color", name: "Color" },
  { id: "luminosity", name: "Luminosity" },
]

const textures = [
  { id: "grain", name: "Film Grain" },
  { id: "paper", name: "Paper" },
  { id: "canvas", name: "Canvas" },
  { id: "concrete", name: "Concrete" },
  { id: "wood", name: "Wood" },
  { id: "metal", name: "Metal" },
]

export default function OverlayPanel() {
  const [activeTab, setActiveTab] = useState("add")
  const [overlayType, setOverlayType] = useState("color")
  const [blendMode, setBlendMode] = useState("normal")
  const [texture, setTexture] = useState("grain")
  const [overlaySettings, setOverlaySettings] = useState({
    opacity: 50,
    color: "#ff5500",
    gradientStart: "#ff5500",
    gradientEnd: "#0055ff",
    gradientAngle: 45,
    intensity: 50,
    scale: 100,
  })

  const { addOverlay, overlays } = useImageEditorContext()

  const handleSettingChange = (setting: string, value: any) => {
    setOverlaySettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  const handleAddOverlay = () => {
    if (typeof addOverlay === "function") {
      addOverlay({
        id: `overlay-${Date.now()}`,
        type: overlayType,
        blendMode,
        texture: overlayType === "texture" ? texture : undefined,
        settings: overlaySettings,
      })
    }
  }

  const getOverlayIcon = () => {
    switch (overlayType) {
      case "light":
        return <Sun className="h-12 w-12" />
      case "dust":
      case "rain":
      case "snow":
        return <Cloud className="h-12 w-12" />
      case "bokeh":
        return <Sparkles className="h-12 w-12" />
      case "texture":
        return <Droplets className="h-12 w-12" />
      default:
        return <Layers className="h-12 w-12" />
    }
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="add">Add Overlay</TabsTrigger>
          <TabsTrigger value="manage">Manage ({overlays?.length || 0})</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "add" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Overlay Type</label>
            <Select value={overlayType} onValueChange={setOverlayType}>
              <SelectTrigger>
                <SelectValue placeholder="Select overlay type" />
              </SelectTrigger>
              <SelectContent>
                {overlayTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Blend Mode</label>
            <Select value={blendMode} onValueChange={setBlendMode}>
              <SelectTrigger>
                <SelectValue placeholder="Select blend mode" />
              </SelectTrigger>
              <SelectContent>
                {blendModes.map((mode) => (
                  <SelectItem key={mode.id} value={mode.id}>
                    {mode.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {overlayType === "color" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Color</label>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-10 h-10 p-0 border-2"
                      style={{ backgroundColor: overlaySettings.color }}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3" align="start">
                    <HexColorPicker
                      color={overlaySettings.color}
                      onChange={(color) => handleSettingChange("color", color)}
                    />
                  </PopoverContent>
                </Popover>
                <div className="text-sm">{overlaySettings.color}</div>
              </div>
            </div>
          )}

          {overlayType === "gradient" && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-1">Start Color</label>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-10 h-10 p-0 border-2"
                        style={{ backgroundColor: overlaySettings.gradientStart }}
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3" align="start">
                      <HexColorPicker
                        color={overlaySettings.gradientStart}
                        onChange={(color) => handleSettingChange("gradientStart", color)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium mb-1">End Color</label>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-10 h-10 p-0 border-2"
                        style={{ backgroundColor: overlaySettings.gradientEnd }}
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3" align="start">
                      <HexColorPicker
                        color={overlaySettings.gradientEnd}
                        onChange={(color) => handleSettingChange("gradientEnd", color)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium mb-1">Angle</label>
                <Slider
                  value={[overlaySettings.gradientAngle]}
                  min={0}
                  max={360}
                  step={1}
                  onValueChange={(value) => handleSettingChange("gradientAngle", value[0])}
                />
                <div className="text-right text-xs text-zinc-400">{overlaySettings.gradientAngle}°</div>
              </div>
            </>
          )}

          {overlayType === "texture" && (
            <div>
              <label className="block text-sm font-medium mb-2">Texture Type</label>
              <Select value={texture} onValueChange={setTexture}>
                <SelectTrigger>
                  <SelectValue placeholder="Select texture" />
                </SelectTrigger>
                <SelectContent>
                  {textures.map((tex) => (
                    <SelectItem key={tex.id} value={tex.id}>
                      {tex.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Opacity</label>
            <Slider
              value={[overlaySettings.opacity]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => handleSettingChange("opacity", value[0])}
            />
            <div className="text-right text-xs text-zinc-400">{overlaySettings.opacity}%</div>
          </div>

          {(overlayType === "texture" ||
            overlayType === "dust" ||
            overlayType === "rain" ||
            overlayType === "snow" ||
            overlayType === "fog" ||
            overlayType === "bokeh") && (
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Intensity</label>
              <Slider
                value={[overlaySettings.intensity]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => handleSettingChange("intensity", value[0])}
              />
              <div className="text-right text-xs text-zinc-400">{overlaySettings.intensity}%</div>
            </div>
          )}

          {(overlayType === "texture" ||
            overlayType === "dust" ||
            overlayType === "rain" ||
            overlayType === "snow") && (
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Scale</label>
              <Slider
                value={[overlaySettings.scale]}
                min={50}
                max={200}
                step={1}
                onValueChange={(value) => handleSettingChange("scale", value[0])}
              />
              <div className="text-right text-xs text-zinc-400">{overlaySettings.scale}%</div>
            </div>
          )}

          <div className="pt-4 border-t border-zinc-700">
            <h4 className="font-medium mb-2">Preview</h4>
            <div
              className="bg-zinc-800 rounded-lg p-4 h-32 flex items-center justify-center"
              style={{
                background:
                  overlayType === "gradient"
                    ? `linear-gradient(${overlaySettings.gradientAngle}deg, ${overlaySettings.gradientStart}, ${overlaySettings.gradientEnd})`
                    : overlayType === "color"
                      ? overlaySettings.color
                      : undefined,
                opacity: overlaySettings.opacity / 100,
                mixBlendMode: blendMode as any,
              }}
            >
              {overlayType !== "color" && overlayType !== "gradient" && (
                <div className="text-zinc-400">{getOverlayIcon()}</div>
              )}
            </div>
          </div>

          <Button className="w-full" onClick={handleAddOverlay}>
            Add Overlay
          </Button>
        </div>
      )}

      {activeTab === "manage" && (
        <div className="space-y-4">
          {!overlays || overlays.length === 0 ? (
            <div className="text-center py-8">
              <Layers className="h-12 w-12 mx-auto mb-2 text-zinc-500" />
              <h3 className="text-lg font-medium mb-1">No Overlays</h3>
              <p className="text-zinc-400 mb-4">Add an overlay to get started</p>
              <Button onClick={() => setActiveTab("add")}>Add Overlay</Button>
            </div>
          ) : (
            <div className="space-y-2">
              {/* This would show the list of overlays in a real implementation */}
              <div className="bg-zinc-800 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">Color Overlay</div>
                  <div className="text-xs text-zinc-400">Opacity: 50% • Blend: Overlay</div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Layers className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
