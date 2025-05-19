"use client"

import {
  ImageIcon,
  Wand2,
  Sliders,
  Focus,
  SquareStack,
  Layers,
  Type,
  Palette,
  StickerIcon,
  Paintbrush,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import FilterPanel from "@/components/filter-panel"
import AdjustPanel from "@/components/adjust-panel"
import TextPanel from "@/components/text-panel"
import TextDesignPanel from "@/components/text-design-panel"
import BrushPanel from "@/components/brush-panel"
import TransformPanel from "@/components/transform-panel"
import StockImagesPanel from "@/components/stock-images-panel"
import StickerPanel from "@/components/sticker-panel"
import FocusPanel from "@/components/focus-panel"
import OverlayPanel from "@/components/overlay-panel"
import FramePanel from "@/components/frame-panel"
import type {
  Adjustments,
  BrushSettings,
  TextOverlay,
  Overlay,
  FocusEffect,
  Sticker,
  Frame,
} from "@/context/image-editor-context"
import ReplicatePanel from "@/components/replicate-panel"

// Helper function to convert data URL to File
const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(",")
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png"
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

interface EditorToolbarProps {
  activeTool: string
  setActiveTool: (tool: string) => void
  applyFilter: (filter: string) => void
  activeFilter: string | null
  isDarkMode?: boolean
  adjustments: Adjustments
  applyAdjustments: (adjustments: Adjustments) => void
  addTextOverlay: (textProps: Omit<TextOverlay, "id">) => void
  brushSettings: BrushSettings
  setBrushSettings: (settings: BrushSettings) => void
  setCropMode: (mode: boolean) => void
  applyCrop: () => void
  rotateImage: (degrees: number) => void
  flipImage: (direction: "horizontal" | "vertical") => void
  isGeneratingImage: boolean
  setIsGeneratingImage: (isGenerating: boolean) => void
  loadImageFile: (file: File) => void
  addSticker?: (sticker: Omit<Sticker, "id">) => void
  addOverlay?: (overlay: Omit<Overlay, "id">) => void
  applyFocusEffect?: (effect: FocusEffect) => void
  applyFrame?: (frame: Frame) => void
  pickColorFromCanvas?: () => void
}

export default function EditorToolbar({
  activeTool,
  setActiveTool,
  applyFilter,
  activeFilter,
  isDarkMode = false,
  adjustments,
  applyAdjustments,
  addTextOverlay,
  brushSettings,
  setBrushSettings,
  setCropMode,
  applyCrop,
  rotateImage,
  flipImage,
  isGeneratingImage,
  setIsGeneratingImage,
  loadImageFile,
  addSticker,
  addOverlay,
  applyFocusEffect,
  applyFrame,
  pickColorFromCanvas,
}: EditorToolbarProps) {
  const tools = [
    { id: "library", icon: ImageIcon, label: "Library" },
    {
      id: "replicate",
      name: "Replicate AI",
      icon: Wand2,
      description: "Generate, upscale or remove backgrounds with AI",
    },
    { id: "transform", icon: Wand2, label: "Transform" },
    { id: "filters", icon: Sliders, label: "Filters" },
    { id: "adjust", icon: Sliders, label: "Adjust" },
    { id: "focus", icon: Focus, label: "Focus" },
    { id: "frames", icon: SquareStack, label: "Frames" },
    { id: "overlays", icon: Layers, label: "Overlays" },
    { id: "text", icon: Type, label: "Text" },
    { id: "textDesign", icon: Palette, label: "Text Design" },
    { id: "stickers", icon: StickerIcon, label: "Stickers" },
    { id: "brush", icon: Paintbrush, label: "Brush" },
  ]

  const renderToolPanel = () => {
    switch (activeTool) {
      case "filters":
        return <FilterPanel applyFilter={applyFilter} activeFilter={activeFilter} />
      case "adjust":
        return <AdjustPanel adjustments={adjustments} applyAdjustments={applyAdjustments} />
      case "text":
        return <TextPanel addTextOverlay={addTextOverlay} />
      case "textDesign":
        return <TextDesignPanel />
      case "brush":
        return (
          <BrushPanel
            brushSettings={brushSettings}
            setBrushSettings={setBrushSettings}
            pickColorFromCanvas={pickColorFromCanvas}
          />
        )
      case "transform":
        return (
          <TransformPanel
            setCropMode={setCropMode}
            applyCrop={applyCrop}
            rotateImage={rotateImage}
            flipImage={flipImage}
            isGeneratingImage={isGeneratingImage}
            setIsGeneratingImage={setIsGeneratingImage}
          />
        )
      case "library":
        return <StockImagesPanel />
      case "replicate":
        return (
          <ReplicatePanel
            onImageGenerated={(imageUrl) => loadImageFile(dataURLtoFile(imageUrl, "replicate-image.png"))}
          />
        )
      case "stickers":
        return <StickerPanel />
      case "focus":
        return <FocusPanel />
      case "overlays":
        return <OverlayPanel />
      case "frames":
        return <FramePanel />
      default:
        return null
    }
  }

  return (
    <div className="border-t border-zinc-800">
      {/* Tools */}
      <div className="flex overflow-x-auto scrollbar-hide toolbar-buttons p-2 gap-2">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant="ghost"
            className={cn(
              "tool-button flex-shrink-0 rounded-lg",
              "bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728]",
              activeTool === tool.id ? "border-2 border-black shadow-md" : "hover:opacity-90",
            )}
            onClick={() => setActiveTool(tool.id)}
            aria-pressed={activeTool === tool.id}
          >
            <tool.icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{tool.label}</span>
          </Button>
        ))}
      </div>

      {/* Active tool panel */}
      <div
        className={cn(
          "p-4 tool-panel overflow-x-hidden",
          isDarkMode ? "bg-zinc-900 text-white" : "bg-white text-black",
        )}
      >
        {renderToolPanel()}
      </div>
    </div>
  )
}
