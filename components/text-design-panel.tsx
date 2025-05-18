"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type, Info, Plus } from "lucide-react"
import { useImageEditorContext } from "@/context/image-editor-context"
import { useToast } from "@/hooks/use-toast"

const textEffects = [
  { id: "none", name: "None" },
  { id: "shadow", name: "Shadow" },
  { id: "outline", name: "Outline" },
  { id: "glow", name: "Glow" },
  { id: "emboss", name: "Emboss" },
  { id: "gradient", name: "Gradient" },
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
  const { textOverlays, setTextOverlays, activeLayer, addTextOverlay } = useImageEditorContext()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("style")
  const [newText, setNewText] = useState("")

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
    letterSpacing: 0,
    lineHeight: 1.2,
    opacity: 100,
    rotation: 0,
  })

  // Update settings when active text overlay changes
  useEffect(() => {
    if (activeTextOverlay) {
      setTextSettings({
        text: activeTextOverlay.text,
        fontFamily: activeTextOverlay.fontFamily,
        fontSize: activeTextOverlay.fontSize,
        color: activeTextOverlay.color,
        isBold: activeTextOverlay.isBold,
        isItalic: activeTextOverlay.isItalic,
        isUnderline: activeTextOverlay.isUnderline,
        alignment: activeTextOverlay.alignment,
        effect: "none",
        effectIntensity: 50,
        effectColor: "#000000",
        letterSpacing: 0,
        lineHeight: 1.2,
        opacity: 100,
        rotation: 0,
      })
    }
  }, [activeTextOverlay])

  const updateTextOverlay = () => {
    if (!activeLayer) return

    try {
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
          }
        }
        return overlay
      })

      setTextOverlays(updatedOverlays)
      console.log("Text updated:", textSettings)

      toast({
        title: "Text updated",
        description: "Your text has been updated successfully",
      })
    } catch (error) {
      console.error("Error updating text:", error)
      toast({
        title: "Error updating text",
        description: "There was a problem updating the text. Please try again.",
      })
    }
  }

  const handleChange = (property: string, value: any) => {
    setTextSettings((prev) => ({
      ...prev,
      [property]: value,
    }))

    // Apply changes in real-time
    setTimeout(updateTextOverlay, 0)
  }

  const handleAddNewText = () => {
    if (!newText.trim()) {
      toast({
        title: "Text required",
        description: "Please enter some text to add",
      })
      return
    }

    try {
      if (typeof addTextOverlay === "function") {
        addTextOverlay({
          text: newText,
          x: 200, // Center of canvas
          y: 200,
          fontSize: 24,
          fontFamily: "Arial",
          color: "#ffffff",
          isBold: false,
          isItalic: false,
          isUnderline: false,
          alignment: "center",
        })

        setNewText("")

        toast({
          title: "Text added",
          description: "New text has been added to your image",
        })
      }
    } catch (error) {
      console.error("Error adding text:", error)
      toast({
        title: "Error adding text",
        description: "There was a problem adding the text. Please try again.",
      })
    }
  }

  return (
    <div className="space-y-6">
      {!activeTextOverlay ? (
        <div className="space-y-4">
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-amber-400 bg-amber-950/30 p-3 rounded-md mb-4">
              <Info className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">
                No text is currently selected. Add new text below or select existing text on your image.
              </p>
            </div>

            <div className="space-y-3">
              <label className="feature-label">Add New Text</label>
              <Input
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Enter text here..."
                className="text-white"
              />
              <Button onClick={handleAddNewText} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Text to Image
              </Button>
            </div>

            {/* Add instructions about text interaction */}
            <div className="mt-4 border-t border-zinc-700 pt-4">
              <h4 className="text-sm font-medium mb-2">How to interact with text:</h4>
              <ul className="text-xs text-zinc-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="bg-zinc-700 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                    1
                  </span>
                  <span>Click and drag text to move it anywhere on the canvas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-zinc-700 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                    2
                  </span>
                  <span>Click on text to select it for editing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-zinc-700 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                    3
                  </span>
                  <span>Use this panel to change font, size, color and effects</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center p-4">
            <Type className="h-12 w-12 mx-auto mb-4 text-zinc-500" />
            <h3 className="text-lg font-medium mb-2">Text Design Tools</h3>
            <p className="text-zinc-400 mb-4">Add text first or select existing text to edit</p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-zinc-800 rounded-lg p-4">
            <h3 className="font-medium mb-2">Currently Editing:</h3>
            <div className="bg-zinc-700 p-3 rounded-md">
              <p className="text-lg font-medium truncate">{activeTextOverlay.text}</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="effects">Effects</TabsTrigger>
            </TabsList>
          </Tabs>

          {activeTab === "style" && (
            <div className="space-y-4">
              <div>
                <label className="feature-label">Text</label>
                <Input
                  value={textSettings.text}
                  onChange={(e) => handleChange("text", e.target.value)}
                  className="text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="feature-label">Font Family</label>
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
                  <label className="feature-label">Font Size</label>
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
                <label className="feature-label">Text Color</label>
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
                    style={{ color: textSettings.color }}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-1">
                  <Button
                    variant={textSettings.isBold ? "default" : "outline"}
                    size="icon"
                    onClick={() => handleChange("isBold", !textSettings.isBold)}
                    className="group relative"
                  >
                    <Bold className="h-4 w-4" />
                    <span className="tooltip">Bold</span>
                  </Button>
                  <Button
                    variant={textSettings.isItalic ? "default" : "outline"}
                    size="icon"
                    onClick={() => handleChange("isItalic", !textSettings.isItalic)}
                    className="group relative"
                  >
                    <Italic className="h-4 w-4" />
                    <span className="tooltip">Italic</span>
                  </Button>
                  <Button
                    variant={textSettings.isUnderline ? "default" : "outline"}
                    size="icon"
                    onClick={() => handleChange("isUnderline", !textSettings.isUnderline)}
                    className="group relative"
                  >
                    <Underline className="h-4 w-4" />
                    <span className="tooltip">Underline</span>
                  </Button>
                </div>

                <div className="flex gap-1">
                  <Button
                    variant={textSettings.alignment === "left" ? "default" : "outline"}
                    size="icon"
                    onClick={() => handleChange("alignment", "left")}
                    className="group relative"
                  >
                    <AlignLeft className="h-4 w-4" />
                    <span className="tooltip">Align Left</span>
                  </Button>
                  <Button
                    variant={textSettings.alignment === "center" ? "default" : "outline"}
                    size="icon"
                    onClick={() => handleChange("alignment", "center")}
                    className="group relative"
                  >
                    <AlignCenter className="h-4 w-4" />
                    <span className="tooltip">Align Center</span>
                  </Button>
                  <Button
                    variant={textSettings.alignment === "right" ? "default" : "outline"}
                    size="icon"
                    onClick={() => handleChange("alignment", "right")}
                    className="group relative"
                  >
                    <AlignRight className="h-4 w-4" />
                    <span className="tooltip">Align Right</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="feature-label">Rotation</label>
                  <span className="text-xs text-zinc-400">{textSettings.rotation}°</span>
                </div>
                <Slider
                  value={[textSettings.rotation]}
                  min={-180}
                  max={180}
                  step={1}
                  onValueChange={(value) => handleChange("rotation", value[0])}
                />
              </div>
            </div>
          )}

          {activeTab === "effects" && (
            <div className="space-y-4">
              <div>
                <label className="feature-label">Effect Type</label>
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
                    <div className="flex justify-between">
                      <label className="feature-label">Effect Intensity</label>
                      <span className="text-xs text-zinc-400">{textSettings.effectIntensity}%</span>
                    </div>
                    <Slider
                      value={[textSettings.effectIntensity]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => handleChange("effectIntensity", value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="feature-label">Effect Color</label>
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
                        className="w-28 text-white"
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

          <div className="pt-4 border-t border-zinc-700 mt-4">
            <h4 className="font-medium mb-2">Live Preview</h4>
            <div className="bg-white rounded-lg p-4 min-h-[100px] flex items-center justify-center">
              <div
                style={{
                  fontFamily: textSettings.fontFamily,
                  fontSize: `${textSettings.fontSize}px`,
                  fontWeight: textSettings.isBold ? "bold" : "normal",
                  fontStyle: textSettings.isItalic ? "italic" : "normal",
                  textDecoration: textSettings.isUnderline ? "underline" : "none",
                  color: textSettings.color,
                  textAlign: textSettings.alignment as any,
                }}
              >
                {textSettings.text || "Sample Text"}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
