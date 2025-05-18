"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Undo, Redo, ZoomIn, ZoomOut, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import EditorToolbar from "@/components/editor-toolbar"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { ImageEditorProvider } from "@/context/image-editor-context"
import { useImageHistory } from "@/hooks/use-image-history"
import { useImageCanvas } from "@/hooks/use-image-canvas"
import { useLayers } from "@/hooks/use-layers"
import LayerPanel from "@/components/layer-panel"
import DropZone from "@/components/drop-zone"
import AIGeneratorPanel from "@/components/ai-generator-panel"

export default function ImageEditor() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isBasicUI, setIsBasicUI] = useState(true)
  const [activeTool, setActiveTool] = useState<string>("library")
  const [zoom, setZoom] = useState(100)
  const [showLayerPanel, setShowLayerPanel] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const editorContainerRef = useRef<HTMLDivElement>(null)

  const { image, setImage, history, historyIndex, addToHistory, handleUndo, handleRedo } = useImageHistory()
  const { layers, activeLayer, addLayer, removeLayer, moveLayer, setActiveLayer } = useLayers()

  const {
    applyFilter,
    applyAdjustments,
    addTextOverlay,
    startDrawing,
    draw,
    stopDrawing,
    isDrawing,
    cropMode,
    setCropMode,
    cropSelection,
    setCropSelection,
    startCropSelection,
    updateCropSelection,
    endCropSelection,
    applyCrop,
    rotateImage,
    flipImage,
    activeFilter,
    setActiveFilter,
    adjustments,
    setAdjustments,
    textOverlays,
    setTextOverlays,
    brushSettings,
    setBrushSettings,
    stickers,
    addSticker,
    removeSticker,
    updateSticker,
    overlays,
    addOverlay,
    removeOverlay,
    updateOverlay,
    applyFocusEffect,
  } = useImageCanvas(canvasRef, image, addToHistory, activeLayer)

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      loadImageFile(file)
    }
  }

  const loadImageFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      if (!event.target?.result) return

      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const newImageData = event.target?.result as string
        setImage(newImageData)
        addToHistory(newImageData)

        // Create a new layer for the image
        addLayer({
          id: `layer-${Date.now()}`,
          name: file.name || "Uploaded Image",
          type: "image",
          visible: true,
          data: newImageData,
          position: { x: 0, y: 0 },
          opacity: 100,
        })

        // Switch to the transform tool after upload
        setActiveTool("transform")
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  // Export the image
  const handleExport = () => {
    if (canvasRef.current) {
      const link = document.createElement("a")
      link.download = "edited-image.png"
      link.href = canvasRef.current.toDataURL("image/png")
      link.click()

      toast({
        title: "Image exported",
        description: "Your image has been successfully exported.",
      })
    }
  }

  // Export with options
  const handleExportWithOptions = (format: string, quality: number) => {
    if (canvasRef.current) {
      const link = document.createElement("a")
      link.download = `edited-image.${format.toLowerCase()}`
      link.href = canvasRef.current.toDataURL(`image/${format.toLowerCase()}`, quality / 100)
      link.click()

      toast({
        title: "Image exported",
        description: `Your image has been exported as ${format} with ${quality}% quality.`,
      })
    }
  }

  // Handle zoom
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 10, 200))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 10, 50))
  }

  // Initial placeholder image
  useEffect(() => {
    const placeholderImage = "/colorful-abstract-portrait.png"
    setImage(placeholderImage)
    addToHistory(placeholderImage)

    // Add initial layer
    addLayer({
      id: "layer-1",
      name: "Background",
      type: "image",
      visible: true,
      data: placeholderImage,
      position: { x: 0, y: 0 },
      opacity: 100,
    })
  }, [])

  return (
    <ImageEditorProvider
      value={{
        image,
        setImage,
        history,
        historyIndex,
        addToHistory,
        activeFilter,
        setActiveFilter,
        adjustments,
        setAdjustments,
        textOverlays,
        setTextOverlays,
        brushSettings,
        setBrushSettings,
        cropMode,
        setCropMode,
        cropSelection,
        setCropSelection,
        layers,
        activeLayer,
        addLayer,
        removeLayer,
        moveLayer,
        setActiveLayer,
        stickers,
        addSticker,
        removeSticker,
        updateSticker,
        overlays,
        addOverlay,
        removeOverlay,
        updateOverlay,
        applyFocusEffect,
      }}
    >
      <div className={cn("rounded-xl overflow-hidden", isDarkMode ? "bg-zinc-900 text-white" : "bg-white text-black")}>
        {/* Top toolbar */}
        <div className="flex items-center justify-between p-3 border-b border-zinc-800">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleUndo} disabled={historyIndex <= 0}>
              <Undo className="h-4 w-4 mr-1" />
              Undo
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
              <Redo className="h-4 w-4 mr-1" />
              Redo
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span>{zoom.toFixed(0)}%</span>
            <Button variant="ghost" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLayerPanel(!showLayerPanel)}
              className={showLayerPanel ? "bg-zinc-700" : ""}
            >
              Layers
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleExport}>PNG (Default)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportWithOptions("JPEG", 90)}>
                  JPEG (90% Quality)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportWithOptions("JPEG", 70)}>
                  JPEG (70% Quality)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportWithOptions("WEBP", 90)}>
                  WebP (90% Quality)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleExport}>
              EXPORT IMAGE
            </Button>
          </div>
        </div>

        {/* Main editor area */}
        <div className="flex">
          {/* Canvas area */}
          <div
            className={cn(
              "flex justify-center p-4 bg-zinc-950 min-h-[500px] w-full transition-all",
              showLayerPanel ? "w-3/4" : "w-full",
            )}
            ref={editorContainerRef}
          >
            {image ? (
              <DropZone onImageDrop={loadImageFile} className="flex justify-center items-center w-full">
                <div className="relative overflow-hidden" style={{ maxWidth: "100%" }}>
                  <canvas
                    ref={canvasRef}
                    className="max-w-full max-h-[500px] object-contain"
                    style={{ transform: `scale(${zoom / 100})` }}
                    onMouseDown={(e) => {
                      if (activeTool === "brush") {
                        startDrawing(e)
                      } else if (cropMode) {
                        startCropSelection(e)
                      }
                    }}
                    onMouseMove={(e) => {
                      if (activeTool === "brush" && isDrawing) {
                        draw(e)
                      } else if (cropMode && cropSelection.isSelecting) {
                        updateCropSelection(e)
                      }
                    }}
                    onMouseUp={(e) => {
                      if (activeTool === "brush") {
                        stopDrawing()
                      } else if (cropMode) {
                        endCropSelection()
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTool === "brush") {
                        stopDrawing()
                      } else if (cropMode) {
                        endCropSelection()
                      }
                    }}
                  />

                  {/* Crop overlay */}
                  {cropMode && cropSelection.width > 0 && cropSelection.height > 0 && (
                    <div
                      className="absolute border-2 border-white bg-black bg-opacity-50"
                      style={{
                        left: cropSelection.x,
                        top: cropSelection.y,
                        width: cropSelection.width,
                        height: cropSelection.height,
                      }}
                    />
                  )}
                </div>
              </DropZone>
            ) : (
              <DropZone onImageDrop={loadImageFile} />
            )}
          </div>

          {/* Layer panel */}
          {showLayerPanel && (
            <div className="w-1/4 bg-zinc-800 border-l border-zinc-700 p-4">
              <LayerPanel />
            </div>
          )}
        </div>

        {/* Tools toolbar */}
        <EditorToolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          applyFilter={applyFilter}
          activeFilter={activeFilter}
          isDarkMode={isDarkMode}
          adjustments={adjustments}
          applyAdjustments={applyAdjustments}
          addTextOverlay={addTextOverlay}
          brushSettings={brushSettings}
          setBrushSettings={setBrushSettings}
          setCropMode={setCropMode}
          applyCrop={applyCrop}
          rotateImage={rotateImage}
          flipImage={flipImage}
          isGeneratingImage={isGeneratingImage}
          setIsGeneratingImage={setIsGeneratingImage}
          loadImageFile={loadImageFile}
          addSticker={addSticker}
          addOverlay={addOverlay}
          applyFocusEffect={applyFocusEffect}
        />

        {/* Bottom UI settings */}
        <div className="flex justify-between p-3 border-t border-zinc-800">
          <Tabs defaultValue={isBasicUI ? "basic" : "advanced"} className="w-auto">
            <TabsList className="bg-zinc-800">
              <TabsTrigger
                value="advanced"
                onClick={() => setIsBasicUI(false)}
                className={!isBasicUI ? "data-[state=active]:bg-zinc-700" : ""}
              >
                Advanced UI
              </TabsTrigger>
              <TabsTrigger
                value="basic"
                onClick={() => setIsBasicUI(true)}
                className={isBasicUI ? "data-[state=active]:bg-orange-600" : ""}
              >
                Basic UI
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs defaultValue={isDarkMode ? "dark" : "light"} className="w-auto">
            <TabsList className="bg-zinc-800">
              <TabsTrigger
                value="dark"
                onClick={() => setIsDarkMode(true)}
                className={isDarkMode ? "data-[state=active]:bg-orange-600" : ""}
              >
                Dark
              </TabsTrigger>
              <TabsTrigger
                value="light"
                onClick={() => setIsDarkMode(false)}
                className={!isDarkMode ? "data-[state=active]:bg-zinc-700" : ""}
              >
                Light
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Hidden file input */}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

        {/* AI Generator Modal */}
        {isGeneratingImage && <AIGeneratorPanel setIsGeneratingImage={setIsGeneratingImage} />}
      </div>
    </ImageEditorProvider>
  )
}
