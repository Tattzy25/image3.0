"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Undo, Redo, ZoomIn, ZoomOut, Download, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  const [activeTool, setActiveTool] = useState<string>("library")
  const [zoom, setZoom] = useState(100)
  const [showLayerPanel, setShowLayerPanel] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [brushPreview, setBrushPreview] = useState({ x: 0, y: 0, visible: false })

  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const brushPreviewRef = useRef<HTMLDivElement>(null)

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
    applyFrame,
    currentFrame,
    startDraggingText,
    dragText,
    stopDraggingText,
    isDraggingText,
    pickColorFromCanvas,
    isPickingColor,
    handleColorPick,
  } = useImageCanvas(canvasRef, image, addToHistory, activeLayer, setActiveLayer)

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (file) {
        if (file.size > 20 * 1024 * 1024) {
          throw new Error("File size exceeds 20MB limit")
        }

        if (!file.type.startsWith("image/")) {
          throw new Error("Only image files are supported")
        }

        loadImageFile(file)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      setError(errorMessage)
      toast({
        title: "Error uploading file",
        description: errorMessage,
      })
    }
  }

  const loadImageFile = (file: File) => {
    try {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (!event.target?.result) {
          throw new Error("Failed to read file")
        }

        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          try {
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

            toast({
              title: "Image uploaded",
              description: "Your image has been successfully uploaded",
            })
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
            setError(errorMessage)
            toast({
              title: "Error processing image",
              description: errorMessage,
            })
          }
        }

        img.onerror = () => {
          throw new Error("Failed to load image")
        }

        img.src = event.target?.result as string
      }

      reader.onerror = () => {
        throw new Error("Failed to read file")
      }

      reader.readAsDataURL(file)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      setError(errorMessage)
      toast({
        title: "Error loading image",
        description: errorMessage,
      })
    }
  }

  // Export the image
  const handleExport = () => {
    try {
      if (!canvasRef.current) {
        throw new Error("Canvas not available")
      }

      const link = document.createElement("a")
      link.download = "edited-image.png"
      link.href = canvasRef.current.toDataURL("image/png")
      link.click()

      toast({
        title: "Image exported",
        description: "Your image has been successfully exported.",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      setError(errorMessage)
      toast({
        title: "Error exporting image",
        description: errorMessage,
      })
    }
  }

  // Export with options
  const handleExportWithOptions = (format: string, quality: number) => {
    try {
      if (!canvasRef.current) {
        throw new Error("Canvas not available")
      }

      const link = document.createElement("a")
      link.download = `edited-image.${format.toLowerCase()}`
      link.href = canvasRef.current.toDataURL(`image/${format.toLowerCase()}`, quality / 100)
      link.click()

      toast({
        title: "Image exported",
        description: `Your image has been exported as ${format} with ${quality}% quality.`,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      setError(errorMessage)
      toast({
        title: "Error exporting image",
        description: errorMessage,
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

  // Clear error
  const clearError = () => {
    setError(null)
  }

  // Initial placeholder image
  useEffect(() => {
    try {
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      setError(errorMessage)
    }
  }, [])

  // Handle brush preview
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === "brush" && !isDrawing) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        setBrushPreview({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          visible: true,
        })
      }
    }
  }

  const handleMouseLeave = () => {
    setBrushPreview((prev) => ({ ...prev, visible: false }))
  }

  // Only use eyedropper cursor when in color picking mode
  const shouldShowEyedropperCursor = isPickingColor

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
        applyFrame,
        currentFrame,
      }}
    >
      <div className="rounded-xl overflow-hidden editor-container">
        {/* Error message */}
        {error && (
          <div className="bg-red-900/80 text-white p-3 flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={clearError} className="text-white hover:bg-red-800">
              Dismiss
            </Button>
          </div>
        )}

        {/* Top toolbar */}
        <div className="flex items-center justify-between p-3 border-b border-gold">
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="group relative"
            >
              <Undo className="h-4 w-4 mr-1" />
              Undo
              <span className="tooltip">Undo (Ctrl+Z)</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="group relative"
            >
              <Redo className="h-4 w-4 mr-1" />
              Redo
              <span className="tooltip">Redo (Ctrl+Y)</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleZoomOut} className="group relative">
              <ZoomOut className="h-4 w-4" />
              <span className="tooltip">Zoom Out</span>
            </Button>
            <span className="text-black font-bold">{zoom.toFixed(0)}%</span>
            <Button variant="ghost" size="icon" onClick={handleZoomIn} className="group relative">
              <ZoomIn className="h-4 w-4" />
              <span className="tooltip">Zoom In</span>
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowLayerPanel(!showLayerPanel)}
              className={cn("group relative", showLayerPanel ? "bg-gold/50" : "")}
            >
              Layers
              <span className="tooltip">Toggle Layers Panel</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size="sm" className="group relative">
                  <Download className="h-4 w-4 mr-1" />
                  Export Options
                  <span className="tooltip">Choose Export Format</span>
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
          </div>
        </div>

        {/* Main editor area */}
        <div className="flex">
          {/* Canvas area */}
          <div
            className={cn(
              "flex justify-center p-4 canvas-container min-h-[500px] w-full transition-all",
              showLayerPanel ? "w-3/4" : "w-full",
            )}
            ref={editorContainerRef}
          >
            {image ? (
              <DropZone onImageDrop={loadImageFile} className="flex justify-center items-center w-full">
                <div className="relative overflow-hidden" style={{ maxWidth: "100%" }}>
                  {/* Brush size preview */}
                  {brushPreview.visible && activeTool === "brush" && !isDrawing && (
                    <div
                      ref={brushPreviewRef}
                      className={cn(
                        "brush-preview",
                        brushSettings.style === "square" && "square",
                        brushSettings.style === "calligraphy" && "calligraphy",
                      )}
                      style={{
                        left: brushPreview.x,
                        top: brushPreview.y,
                        width: brushSettings.size,
                        height: brushSettings.style === "calligraphy" ? brushSettings.size * 2 : brushSettings.size,
                        backgroundColor: brushSettings.color,
                        opacity: brushSettings.opacity / 100,
                      }}
                    />
                  )}

                  <canvas
                    ref={canvasRef}
                    className={cn(
                      "max-w-full max-h-[500px] object-contain",
                      shouldShowEyedropperCursor && "eyedropper-cursor",
                    )}
                    style={{ transform: `scale(${zoom / 100})` }}
                    onMouseMove={(e) => {
                      handleMouseMove(e)
                      if (activeTool === "brush" && isDrawing) {
                        draw(e)
                      } else if (cropMode && cropSelection.isSelecting) {
                        updateCropSelection(e)
                      } else if (isDraggingText) {
                        dragText(e)
                      }
                    }}
                    onMouseDown={(e) => {
                      if (activeTool === "brush") {
                        startDrawing(e)
                      } else if (cropMode) {
                        startCropSelection(e)
                      } else {
                        // Try to start dragging text if not in a specific tool mode
                        startDraggingText(e)
                      }
                    }}
                    onMouseUp={(e) => {
                      if (activeTool === "brush") {
                        stopDrawing()
                      } else if (cropMode) {
                        endCropSelection()
                      } else if (isDraggingText) {
                        stopDraggingText()
                      }
                    }}
                    onMouseLeave={(e) => {
                      handleMouseLeave()
                      if (activeTool === "brush") {
                        stopDrawing()
                      } else if (cropMode) {
                        endCropSelection()
                      } else if (isDraggingText) {
                        stopDraggingText()
                      }
                    }}
                    onTouchStart={(e) => {
                      if (activeTool === "brush") {
                        startDrawing(e as any)
                      } else if (cropMode) {
                        startCropSelection(e as any)
                      } else {
                        startDraggingText(e)
                      }
                    }}
                    onTouchMove={(e) => {
                      if (activeTool === "brush" && isDrawing) {
                        draw(e as any)
                      } else if (cropMode && cropSelection.isSelecting) {
                        updateCropSelection(e as any)
                      } else if (isDraggingText) {
                        dragText(e)
                      }
                    }}
                    onTouchEnd={(e) => {
                      if (activeTool === "brush") {
                        stopDrawing()
                      } else if (cropMode) {
                        endCropSelection()
                      } else if (isDraggingText) {
                        stopDraggingText()
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
            <div className="w-1/4 layer-panel p-4">
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
          applyFrame={applyFrame}
          pickColorFromCanvas={pickColorFromCanvas}
        />

        {/* Hidden file input */}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

        {/* AI Generator Modal */}
        {isGeneratingImage && <AIGeneratorPanel setIsGeneratingImage={setIsGeneratingImage} />}
      </div>
    </ImageEditorProvider>
  )
}
