"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type } from "lucide-react"
import { useImageEditorContext } from "@/context/image-editor-context"

const textEffects = [
  { id: "none", name: "None" },
  { id: "shadow", name: "Shadow" },
  { id: "outline", name: "Outline" },
  { id: "glow", name: "Glow" },
  { id: "emboss", name: "Emboss" },
  { id: "gradient", name: "Gradient" },
]

const textAnimations = [
  { id: "none", name: "None" },
  { id: "fade", name: "Fade In" },
  { id: "bounce", name: "Bounce" },
  { id: "slide", name: "Slide" },
  { id: "rotate", name: "Rotate" },
  { id: "pulse", name: "Pulse" },
]

const fontFamilies = [
  { id: "Arial", name: "Arial" },
  { id: "Helvetica", name: "Helvetica" },
  { id: "Times New Roman", name: "Times New Roman" },
  { id: "Georgia", name: "Georgia" },
  { id: "Courier New", name: "Courier New" },
  { id: "Verdana", name: "Verdana" },
  { id: "Impact", name: "Impact" },
  { id: "Comic Sans MS", name: "Comic Sans" },
]

export default function TextDesignPanel() {
  const { textOverlays, setTextOverlays, activeLayer } = useImageEditorContext()
  const [activeTab, setActiveTab] = useState("style")

  // Find the active text overlay if there is one
  const activeTextOverlay = activeLayer ? textOverlays.find((overlay) => overlay.id === activeLayer) : null

  const [textSettings, setTextSettings] = useState({
    text: activeTextOverlay?.text || "Sample Text",
    fontFamily: activeTextOverlay?.fontFamily || "Arial",
    fontSize: activeTextOverlay?.fontSize || 24,
    color: activeTextOverlay?.color || "#ffffff",
    isBold: activeTextOverlay?.isBold || false,
    isItalic: activeTextOverlay?.isItalic || false,
    isUnderline: activeTextOverlay?.isUnderline || false,
    alignment: activeTextOverlay?.alignment || "center",
    effect: "none",
    effectIntensity: 50,
    effectColor: "#000000",
    animation: "none",
    animationDuration: 1,
    letterSpacing: 0,
    lineHeight: 1.2,
    opacity: 100,
    rotation: 0,
  })

  const updateTextOverlay = () => {
    if (!activeLayer) return

    const updatedOverlays = textOverlays.map((overlay) => {
      if (overlay.id === activeLayer) {
        return {
          ...overlay,
          text: textSettings.text,
          fontFamily: textSettings.fontFamily,
          fontSize: textSettings.fontSize,
          color: textSettings.color,
          isBold: textSettings.isBold,
          isItalic: textSettings.isItalic,
          isUnderline: textSettings.isUnderline,
          alignment: textSettings.alignment as "left" | "center" | "right",
          // Additional properties would be added here in a real implementation
        }
      }
      return overlay
    })

    setTextOverlays(updatedOverlays)
  }

  const handleChange = (property: string, value: any) => {
    setTextSettings((prev) => ({
      ...prev,
      [property]: value,
    }))

    // Apply changes in real-time
    setTimeout(updateTextOverlay, 0)
  }

  if (!activeTextOverlay) {
    return (
      <div className="text-center p-8">
        <Type className="h-12 w-12 mx-auto mb-4 text-zinc-500" />
        <h3 className="text-lg font-medium mb-2">No Text Selected</h3>
        <p className="text-zinc-400 mb-4">Select a text layer or add new text to edit</p>
        <Button
          variant="outline"
          onClick={() => {
            // This would create a new text layer in a real implementation
          }}
        >
          Add New Text
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
          <TabsTrigger value="animation">Animation</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "style" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Text</label>
            <Input value={textSettings.text} onChange={(e) => handleChange("text", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Font Family</label>
              <Select value={textSettings.fontFamily} onValueChange={(value) => handleChange("fontFamily", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Font" />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((font) => (
                    <SelectItem key={font.id} value={font.id}>
                      {font.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Font Size</label>
              <Select
                value={textSettings.fontSize.toString()}
                onValueChange={(value) => handleChange("fontSize", Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  {[12, 14, 16, 18, 20, 24, 32, 48, 64, 72, 96].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}px
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Text Color</label>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-10 h-10 p-0 border-2"
                    style={{ backgroundColor: textSettings.color }}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3" align="start">
                  <HexColorPicker color={textSettings.color} onChange={(color) => handleChange("color", color)} />
                </PopoverContent>
              </Popover>
              <Input
                value={textSettings.color}
                onChange={(e) => handleChange("color", e.target.value)}
                className="w-28"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex gap-1">
              <Button
                variant={textSettings.isBold ? "default" : "outline"}
                size="icon"
                onClick={() => handleChange("isBold", !textSettings.isBold)}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant={textSettings.isItalic ? "default" : "outline"}
                size="icon"
                onClick={() => handleChange("isItalic", !textSettings.isItalic)}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant={textSettings.isUnderline ? "default" : "outline"}
                size="icon"
                onClick={() => handleChange("isUnderline", !textSettings.isUnderline)}
              >
                <Underline className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-1">
              <Button
                variant={textSettings.alignment === "left" ? "default" : "outline"}
                size="icon"
                onClick={() => handleChange("alignment", "left")}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={textSettings.alignment === "center" ? "default" : "outline"}
                size="icon"
                onClick={() => handleChange("alignment", "center")}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant={textSettings.alignment === "right" ? "default" : "outline"}
                size="icon"
                onClick={() => handleChange("alignment", "right")}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Letter Spacing</label>
            <Slider
              value={[textSettings.letterSpacing]}
              min={-5}
              max={10}
              step={0.1}
              onValueChange={(value) => handleChange("letterSpacing", value[0])}
            />
            <div className="text-right text-xs text-zinc-400">{textSettings.letterSpacing}</div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Line Height</label>
            <Slider
              value={[textSettings.lineHeight]}
              min={0.5}
              max={3}
              step={0.1}
              onValueChange={(value) => handleChange("lineHeight", value[0])}
            />
            <div className="text-right text-xs text-zinc-400">{textSettings.lineHeight}</div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Opacity</label>
            <Slider
              value={[textSettings.opacity]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => handleChange("opacity", value[0])}
            />
            <div className="text-right text-xs text-zinc-400">{textSettings.opacity}%</div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Rotation</label>
            <Slider
              value={[textSettings.rotation]}
              min={-180}
              max={180}
              step={1}
              onValueChange={(value) => handleChange("rotation", value[0])}
            />
            <div className="text-right text-xs text-zinc-400">{textSettings.rotation}°</div>
          </div>
        </div>
      )}

      {activeTab === "effects" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Effect Type</label>
            <Select value={textSettings.effect} onValueChange={(value) => handleChange("effect", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Effect" />
              </SelectTrigger>
              <SelectContent>
                {textEffects.map((effect) => (
                  <SelectItem key={effect.id} value={effect.id}>
                    {effect.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {textSettings.effect !== "none" && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-1">Effect Intensity</label>
                <Slider
                  value={[textSettings.effectIntensity]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleChange("effectIntensity", value[0])}
                />
                <div className="text-right text-xs text-zinc-400">{textSettings.effectIntensity}%</div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium mb-1">Effect Color</label>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-10 h-10 p-0 border-2"
                        style={{ backgroundColor: textSettings.effectColor }}
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3" align="start">
                      <HexColorPicker
                        color={textSettings.effectColor}
                        onChange={(color) => handleChange("effectColor", color)}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    value={textSettings.effectColor}
                    onChange={(e) => handleChange("effectColor", e.target.value)}
                    className="w-28"
                  />
                </div>
              </div>
            </>
          )}

          <div className="pt-4 border-t border-zinc-700">
            <h4 className="font-medium mb-2">Effect Preview</h4>
            <div className="bg-zinc-800 rounded-lg p-4 min-h-[100px] flex items-center justify-center">
              <div
                style={{
                  fontFamily: textSettings.fontFamily,
                  fontSize: `${textSettings.fontSize}px`,
                  fontWeight: textSettings.isBold ? "bold" : "normal",
                  fontStyle: textSettings.isItalic ? "italic" : "normal",
                  textDecoration: textSettings.isUnderline ? "underline" : "none",
                  color: textSettings.color,
                  textAlign: textSettings.alignment as any,
                  letterSpacing: `${textSettings.letterSpacing}px`,
                  lineHeight: textSettings.lineHeight,
                  opacity: textSettings.opacity / 100,
                  transform: `rotate(${textSettings.rotation}deg)`,
                  textShadow:
                    textSettings.effect === "shadow"
                      ? `2px 2px ${textSettings.effectIntensity / 10}px ${textSettings.effectColor}`
                      : textSettings.effect === "glow"
                        ? `0 0 ${textSettings.effectIntensity / 5}px ${textSettings.effectColor}`
                        : "none",
                  WebkitTextStroke:
                    textSettings.effect === "outline"
                      ? `${textSettings.effectIntensity / 50}px ${textSettings.effectColor}`
                      : "initial",
                }}
              >
                {textSettings.text || "Sample Text"}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "animation" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Animation Type</label>
            <Select value={textSettings.animation} onValueChange={(value) => handleChange("animation", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Animation" />
              </SelectTrigger>
              <SelectContent>
                {textAnimations.map((animation) => (
                  <SelectItem key={animation.id} value={animation.id}>
                    {animation.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {textSettings.animation !== "none" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Animation Duration (seconds)</label>
              <Slider
                value={[textSettings.animationDuration]}
                min={0.1}
                max={5}
                step={0.1}
                onValueChange={(value) => handleChange("animationDuration", value[0])}
              />
              <div className="text-right text-xs text-zinc-400">{textSettings.animationDuration}s</div>
            </div>
          )}

          <div className="pt-4 border-t border-zinc-700">
            <h4 className="font-medium mb-2">Animation Preview</h4>
            <div className="bg-zinc-800 rounded-lg p-4 min-h-[100px] flex items-center justify-center">
              <div
                style={{
                  fontFamily: textSettings.fontFamily,
                  fontSize: `${textSettings.fontSize}px`,
                  fontWeight: textSettings.isBold ? "bold" : "normal",
                  fontStyle: textSettings.isItalic ? "italic" : "normal",
                  textDecoration: textSettings.isUnderline ? "underline" : "none",
                  color: textSettings.color,
                  textAlign: textSettings.alignment as any,
                  animation:
                    textSettings.animation !== "none"
                      ? `${textSettings.animation} ${textSettings.animationDuration}s infinite`
                      : "none",
                }}
                className={
                  textSettings.animation === "fade"
                    ? "animate-fade-in"
                    : textSettings.animation === "bounce"
                      ? "animate-bounce"
                      : textSettings.animation === "pulse"
                        ? "animate-pulse"
                        : textSettings.animation === "slide"
                          ? "animate-slide"
                          : textSettings.animation === "rotate"
                            ? "animate-spin"
                            : ""
                }
              >
                {textSettings.text || "Sample Text"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
