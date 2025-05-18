"use client"

import { createContext, useContext, type ReactNode } from "react"

export type BrushSettings = {
  color: string
  size: number
}

export type TextOverlay = {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  fontFamily: string
  color: string
  isBold: boolean
  isItalic: boolean
  isUnderline: boolean
  alignment: "left" | "center" | "right"
}

export type Adjustments = {
  brightness: number
  contrast: number
  saturation: number
  temperature: number
  blur: number
  sharpen: number
  vibrance: number
}

export type CropSelection = {
  x: number
  y: number
  width: number
  height: number
  isSelecting: boolean
}

export type Layer = {
  id: string
  name: string
  type: "image" | "text" | "shape" | "brush" | "sticker" | "overlay"
  visible: boolean
  data: any
  position: { x: number; y: number }
  opacity: number
}

export type Sticker = {
  id: string
  content: string
  x: number
  y: number
  scale: number
  rotation: number
}

export type Overlay = {
  id: string
  type: string
  blendMode: string
  texture?: string
  settings: {
    opacity: number
    color?: string
    gradientStart?: string
    gradientEnd?: string
    gradientAngle?: number
    intensity?: number
    scale?: number
  }
}

export type FocusEffect = {
  shape: string
  effect: string
  intensity: number
  feather: number
  size: number
  x: number
  y: number
}

type ImageEditorContextType = {
  image: string | null
  setImage: (image: string | null) => void
  history: string[]
  historyIndex: number
  addToHistory: (imageData: string) => void
  activeFilter: string | null
  setActiveFilter: (filter: string | null) => void
  adjustments: Adjustments
  setAdjustments: (adjustments: Adjustments) => void
  textOverlays: TextOverlay[]
  setTextOverlays: (overlays: TextOverlay[]) => void
  brushSettings: BrushSettings
  setBrushSettings: (settings: BrushSettings) => void
  cropMode: boolean
  setCropMode: (mode: boolean) => void
  cropSelection: CropSelection
  setCropSelection: (selection: CropSelection) => void
  layers: Layer[]
  activeLayer: string | null
  addLayer: (layer: Layer) => void
  removeLayer: (id: string) => void
  moveLayer: (id: string, direction: "up" | "down") => void
  setActiveLayer: (id: string | null) => void
  stickers: Sticker[]
  addSticker?: (sticker: Omit<Sticker, "id">) => void
  removeSticker?: (id: string) => void
  updateSticker?: (id: string, updates: Partial<Sticker>) => void
  overlays: Overlay[]
  addOverlay?: (overlay: Omit<Overlay, "id">) => void
  removeOverlay?: (id: string) => void
  updateOverlay?: (id: string, updates: Partial<Overlay>) => void
  applyFocusEffect?: (effect: FocusEffect) => void
}

const ImageEditorContext = createContext<ImageEditorContextType | null>(null)

export function ImageEditorProvider({
  children,
  value,
}: {
  children: ReactNode
  value: ImageEditorContextType
}) {
  return <ImageEditorContext.Provider value={value}>{children}</ImageEditorContext.Provider>
}

export function useImageEditorContext() {
  const context = useContext(ImageEditorContext)
  if (!context) {
    throw new Error("useImageEditorContext must be used within an ImageEditorProvider")
  }
  return context
}
