"use client"

import { ImageIcon, Wand2, Sliders, Focus, SquareStack, Layers, Type, Palette, Sticker, Paintbrush } from "lucide-react"
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
import type { Adjustments, BrushSettings, TextOverlay, Overlay, FocusEffect } from "@/context/image-editor-context"

interface EditorToolbarProps {
  activeTool: string
  setActiveTool: (tool: string) => void
  applyFilter: (filter: string) => void
  activeFilter: string | null
  isDarkMode: boolean
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
}

export default function EditorToolbar({
  activeTool,
  setActiveTool,
  applyFilter,
  activeFilter,
  isDarkMode,
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
}: EditorToolbarProps) {
  const tools = [
    { id: "library", icon: ImageIcon, label: "Library" },
    { id: "transform", icon: Wand2, label: "Transform" },
    { id: "filters", icon: Sliders, label: "Filters" },
    { id: "adjust", icon: Sliders, label: "Adjust" },
    { id: "focus", icon: Focus, label: "Focus" },
    { id: "frames", icon: SquareStack, label: "Frames" },
    { id: "overlays", icon: Layers, label: "Overlays" },
    { id: "text", icon: Type, label: "Text" },
    { id: "textDesign", icon: Palette, label: "Text Design" },
    { id: "stickers", icon: Sticker, label: "Stickers" },
    { id: "brush", icon: Paintbrush, label: "Brush" },
  ]

  return (
    <div className={cn("border-t border-zinc-800", isDarkMode ? "bg-zinc-800" : "bg-zinc-100")}>
      {/* Tools */}
      <div className="flex overflow-x-auto scrollbar-hide">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant="ghost"
            className={cn(
              "flex flex-col items-center justify-center rounded-none h-20 px-4",
              activeTool === tool.id ? "bg-zinc-700" : "hover:bg-zinc-700",
            )}
            onClick={() => setActiveTool(tool.id)}
          >
            <tool.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{tool.label}</span>
          </Button>
        ))}
      </div>

      {/* Active tool panel */}
      <div className={cn("p-4", isDarkMode ? "bg-zinc-900" : "bg-white")}>
        {activeTool === "filters" && <FilterPanel applyFilter={applyFilter} activeFilter={activeFilter} />}

        {activeTool === "adjust" && <AdjustPanel adjustments={adjustments} applyAdjustments={applyAdjustments} />}

        {activeTool === "text" && <TextPanel addTextOverlay={addTextOverlay} />}

        {activeTool === "textDesign" && <TextDesignPanel />}

        {activeTool === "brush" && <BrushPanel brushSettings={brushSettings} setBrushSettings={setBrushSettings} />}

        {activeTool === "transform" && (
          <TransformPanel
            setCropMode={setCropMode}
            applyCrop={applyCrop}
            rotateImage={rotateImage}
            flipImage={flipImage}
            isGeneratingImage={isGeneratingImage}
            setIsGeneratingImage={setIsGeneratingImage}
          />
        )}

        {activeTool === "library" && <StockImagesPanel />}

        {activeTool === "stickers" && <StickerPanel />}

        {activeTool === "focus" && <FocusPanel />}

        {activeTool === "overlays" && <OverlayPanel />}

        {activeTool === "frames" && (
          <div className="text-center p-4">
            <p className="text-sm text-zinc-400">Frame tools coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}
