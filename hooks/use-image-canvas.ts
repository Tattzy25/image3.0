"use client"

import type React from "react"

import { useState, useEffect, type RefObject } from "react"
import type {
  Adjustments,
  TextOverlay,
  BrushSettings,
  CropSelection,
  Sticker,
  Overlay,
  FocusEffect,
} from "@/context/image-editor-context"

export function useImageCanvas(
  canvasRef: RefObject<HTMLCanvasElement>,
  image: string | null,
  addToHistory: (imageData: string) => void,
  activeLayer: string | null,
) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [adjustments, setAdjustments] = useState<Adjustments>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    temperature: 0,
    blur: 0,
    sharpen: 0,
    vibrance: 0,
  })
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSettings, setBrushSettings] = useState<BrushSettings>({
    color: "#ffffff",
    size: 5,
  })
  const [cropMode, setCropMode] = useState(false)
  const [cropSelection, setCropSelection] = useState<CropSelection>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    isSelecting: false,
  })
  const [stickers, setStickers] = useState<Sticker[]>([])
  const [overlays, setOverlays] = useState<Overlay[]>([])

  // Draw image on canvas when it changes
  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0)

          // Apply overlays
          drawOverlays(ctx, canvas)

          // Redraw text overlays
          drawTextOverlays(ctx)

          // Draw stickers
          drawStickers(ctx)
        }
        img.src = image
      }
    }
  }, [image])

  // Add sticker
  const addSticker = (stickerProps: Omit<Sticker, "id">) => {
    const newSticker = {
      ...stickerProps,
      id: `sticker-${Date.now()}`,
    }

    setStickers((prev) => [...prev, newSticker])

    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        drawStickers(ctx)
        addToHistory(canvas.toDataURL())
      }
    }
  }

  // Remove sticker
  const removeSticker = (id: string) => {
    setStickers((prev) => prev.filter((sticker) => sticker.id !== id))

    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx && image) {
        // Redraw everything
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0)
          drawOverlays(ctx, canvas)
          drawTextOverlays(ctx)
          drawStickers(ctx)
          addToHistory(canvas.toDataURL())
        }
        img.src = image
      }
    }
  }

  // Update sticker
  const updateSticker = (id: string, updates: Partial<Sticker>) => {
    setStickers((prev) => prev.map((sticker) => (sticker.id === id ? { ...sticker, ...updates } : sticker)))

    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx && image) {
        // Redraw everything
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0)
          drawOverlays(ctx, canvas)
          drawTextOverlays(ctx)
          drawStickers(ctx)
          addToHistory(canvas.toDataURL())
        }
        img.src = image
      }
    }
  }

  // Draw stickers
  const drawStickers = (ctx: CanvasRenderingContext2D) => {
    stickers.forEach((sticker) => {
      ctx.save()
      ctx.translate(sticker.x, sticker.y)
      ctx.rotate((sticker.rotation * Math.PI) / 180)
      ctx.scale(sticker.scale, sticker.scale)
      ctx.font = "30px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(sticker.content, 0, 0)
      ctx.restore()
    })
  }

  // Add overlay
  const addOverlay = (overlayProps: Omit<Overlay, "id">) => {
    const newOverlay = {
      ...overlayProps,
      id: `overlay-${Date.now()}`,
    }

    setOverlays((prev) => [...prev, newOverlay])

    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        drawOverlays(ctx, canvas)
        addToHistory(canvas.toDataURL())
      }
    }
  }

  // Remove overlay
  const removeOverlay = (id: string) => {
    setOverlays((prev) => prev.filter((overlay) => overlay.id !== id))

    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx && image) {
        // Redraw everything
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0)
          drawOverlays(ctx, canvas)
          drawTextOverlays(ctx)
          drawStickers(ctx)
          addToHistory(canvas.toDataURL())
        }
        img.src = image
      }
    }
  }

  // Update overlay
  const updateOverlay = (id: string, updates: Partial<Overlay>) => {
    setOverlays((prev) => prev.map((overlay) => (overlay.id === id ? { ...overlay, ...updates } : overlay)))

    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx && image) {
        // Redraw everything
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0)
          drawOverlays(ctx, canvas)
          drawTextOverlays(ctx)
          drawStickers(ctx)
          addToHistory(canvas.toDataURL())
        }
        img.src = image
      }
    }
  }

  // Draw overlays
  const drawOverlays = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    overlays.forEach((overlay) => {
      ctx.save()

      // Set blend mode
      ctx.globalCompositeOperation = overlay.blendMode as GlobalCompositeOperation

      // Set opacity
      ctx.globalAlpha = overlay.settings.opacity / 100

      if (overlay.type === "color") {
        ctx.fillStyle = overlay.settings.color || "#000000"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      } else if (overlay.type === "gradient") {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        gradient.addColorStop(0, overlay.settings.gradientStart || "#000000")
        gradient.addColorStop(1, overlay.settings.gradientEnd || "#ffffff")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      } else if (overlay.type === "texture") {
        // In a real implementation, this would load and apply textures
        // For now, we'll just create a simple pattern
        ctx.fillStyle = "#888888"
        for (let x = 0; x < canvas.width; x += 10) {
          for (let y = 0; y < canvas.height; y += 10) {
            if ((x + y) % 20 === 0) {
              ctx.fillRect(x, y, 2, 2)
            }
          }
        }
      }

      ctx.restore()
    })
  }

  // Apply focus effect
  const applyFocusEffect = (effect: FocusEffect) => {
    if (!canvasRef.current || !image) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Create a temporary canvas for the effect
    const tempCanvas = document.createElement("canvas")
    tempCanvas.width = canvas.width
    tempCanvas.height = canvas.height
    const tempCtx = tempCanvas.getContext("2d")
    if (!tempCtx) return

    // Draw the current image to the temp canvas
    tempCtx.drawImage(canvas, 0, 0)

    // Apply the focus effect
    const centerX = canvas.width * (effect.x / 100)
    const centerY = canvas.height * (effect.y / 100)
    const radius = Math.min(canvas.width, canvas.height) * (effect.size / 100)
    const featherSize = radius * (effect.feather / 100)

    // Create a gradient mask
    const mask = ctx.createRadialGradient(centerX, centerY, radius - featherSize, centerX, centerY, radius)

    if (effect.effect === "blur") {
      // Apply blur to the entire canvas
      ctx.filter = `blur(${effect.intensity / 5}px)`
      ctx.drawImage(tempCanvas, 0, 0)
      ctx.filter = "none"

      // Draw the focused area
      mask.addColorStop(0, "rgba(0, 0, 0, 1)")
      mask.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.globalCompositeOperation = "destination-out"
      ctx.fillStyle = mask

      if (effect.shape === "circle") {
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.fill()
      } else if (effect.shape === "rectangle") {
        ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2)
      }

      // Reset composite operation
      ctx.globalCompositeOperation = "source-over"

      // Draw the original image in the focused area
      ctx.save()
      ctx.beginPath()
      if (effect.shape === "circle") {
        ctx.arc(centerX, centerY, radius - featherSize, 0, Math.PI * 2)
      } else if (effect.shape === "rectangle") {
        ctx.rect(
          centerX - (radius - featherSize),
          centerY - (radius - featherSize),
          (radius - featherSize) * 2,
          (radius - featherSize) * 2,
        )
      }
      ctx.clip()
      ctx.drawImage(tempCanvas, 0, 0)
      ctx.restore()
    }

    // Save to history
    addToHistory(canvas.toDataURL())
  }

  // Apply filter to image
  const applyFilter = (filterName: string) => {
    if (!canvasRef.current || !image) return

    setActiveFilter(filterName)
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)

      // Apply selected filter
      switch (filterName) {
        case "grayscale":
          applyGrayscale(ctx, canvas)
          break
        case "sepia":
          applySepia(ctx, canvas)
          break
        case "invert":
          applyInvert(ctx, canvas)
          break
        case "blur":
          applyBlurFilter(ctx, canvas, 5)
          break
        case "vintage":
          applyVintage(ctx, canvas)
          break
        case "rainbow":
          applyRainbow(ctx, canvas)
          break
        case "dramatic":
          applyDramatic(ctx, canvas)
          break
        case "noir":
          applyNoir(ctx, canvas)
          break
        case "duotone":
          applyDuotone(ctx, canvas, "#ff0000", "#0000ff")
          break
        case "vignette":
          applyVignette(ctx, canvas)
          break
        default:
          break
      }

      // Apply overlays
      drawOverlays(ctx, canvas)

      // Redraw text overlays
      drawTextOverlays(ctx)

      // Draw stickers
      drawStickers(ctx)

      // Save to history
      addToHistory(canvas.toDataURL())
    }
    img.src = image
  }

  // Apply adjustments to image
  const applyAdjustments = (newAdjustments: Adjustments) => {
    if (!canvasRef.current || !image) return

    setAdjustments(newAdjustments)
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Apply CSS filters for brightness, contrast, and saturation
      ctx.filter = `brightness(${newAdjustments.brightness}%) contrast(${newAdjustments.contrast}%) saturate(${newAdjustments.saturation}%)`
      ctx.drawImage(img, 0, 0)
      ctx.filter = "none"

      // Apply temperature (color balance) manually
      if (newAdjustments.temperature !== 0 || newAdjustments.vibrance !== 0) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        for (let i = 0; i < data.length; i += 4) {
          // Temperature adjustment
          if (newAdjustments.temperature !== 0) {
            // Add red, reduce blue for warm temperature
            if (newAdjustments.temperature > 0) {
              data[i] = Math.min(255, data[i] + newAdjustments.temperature * 0.5)
              data[i + 2] = Math.max(0, data[i + 2] - newAdjustments.temperature * 0.5)
            }
            // Add blue, reduce red for cool temperature
            else {
              data[i] = Math.max(0, data[i] + newAdjustments.temperature * 0.5)
              data[i + 2] = Math.min(255, data[i + 2] - newAdjustments.temperature * 0.5)
            }
          }

          // Vibrance adjustment
          if (newAdjustments.vibrance !== 0) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
            const max = Math.max(data[i], data[i + 1], data[i + 2])
            const amt = (max - avg) * (newAdjustments.vibrance / 100)

            if (data[i] !== max) data[i] += amt
            if (data[i + 1] !== max) data[i + 1] += amt
            if (data[i + 2] !== max) data[i + 2] += amt
          }
        }

        ctx.putImageData(imageData, 0, 0)
      }

      // Apply blur if needed
      if (newAdjustments.blur > 0) {
        applyBlurFilter(ctx, canvas, newAdjustments.blur / 10)
      }

      // Apply sharpen if needed
      if (newAdjustments.sharpen > 0) {
        applySharpen(ctx, canvas, newAdjustments.sharpen / 10)
      }

      // Apply overlays
      drawOverlays(ctx, canvas)

      // Redraw text overlays
      drawTextOverlays(ctx)

      // Draw stickers
      drawStickers(ctx)

      // Save to history
      addToHistory(canvas.toDataURL())
    }
    img.src = image
  }

  // Add text overlay
  const addTextOverlay = (textProps: Omit<TextOverlay, "id">) => {
    if (!canvasRef.current) return

    const newText = {
      ...textProps,
      id: `text-${Date.now()}`,
    }

    const newTextOverlays = [...textOverlays, newText]
    setTextOverlays(newTextOverlays)

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (ctx) {
      drawTextOverlays(ctx)
      addToHistory(canvas.toDataURL())
    }
  }

  // Draw text overlays
  const drawTextOverlays = (ctx: CanvasRenderingContext2D) => {
    textOverlays.forEach((overlay) => {
      ctx.font = `${overlay.isBold ? "bold " : ""}${overlay.isItalic ? "italic " : ""}${overlay.fontSize}px ${overlay.fontFamily}`
      ctx.fillStyle = overlay.color
      ctx.textAlign = overlay.alignment

      const textY = overlay.y

      // Draw text
      ctx.fillText(overlay.text, overlay.x, textY)

      // Draw underline if needed
      if (overlay.isUnderline) {
        const textWidth = ctx.measureText(overlay.text).width
        const underlineY = textY + 3

        ctx.beginPath()
        if (overlay.alignment === "center") {
          ctx.moveTo(overlay.x - textWidth / 2, underlineY)
          ctx.lineTo(overlay.x + textWidth / 2, underlineY)
        } else if (overlay.alignment === "right") {
          ctx.moveTo(overlay.x - textWidth, underlineY)
          ctx.lineTo(overlay.x, underlineY)
        } else {
          ctx.moveTo(overlay.x, underlineY)
          ctx.lineTo(overlay.x + textWidth, underlineY)
        }

        ctx.strokeStyle = overlay.color
        ctx.stroke()
      }
    })
  }

  // Brush drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setIsDrawing(true)

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    ctx.beginPath()
    ctx.moveTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY)

    ctx.strokeStyle = brushSettings.color
    ctx.lineWidth = brushSettings.size
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    ctx.lineTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false)
      addToHistory(canvasRef.current.toDataURL())
    }
  }

  // Crop selection functions
  const startCropSelection = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !cropMode) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setCropSelection({
      x,
      y,
      width: 0,
      height: 0,
      isSelecting: true,
    })
  }

  const updateCropSelection = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !cropMode || !cropSelection.isSelecting) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setCropSelection({
      ...cropSelection,
      width: x - cropSelection.x,
      height: y - cropSelection.y,
    })
  }

  const endCropSelection = () => {
    if (!cropMode) return

    setCropSelection({
      ...cropSelection,
      isSelecting: false,
    })
  }

  // Crop functionality
  const applyCrop = () => {
    if (!canvasRef.current || !cropSelection.width || !cropSelection.height) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ensure positive width and height
    const x = cropSelection.width > 0 ? cropSelection.x : cropSelection.x + cropSelection.width
    const y = cropSelection.height > 0 ? cropSelection.y : cropSelection.y + cropSelection.height
    const width = Math.abs(cropSelection.width)
    const height = Math.abs(cropSelection.height)

    // Calculate scale factor between displayed canvas and actual image
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    // Apply scale to crop coordinates
    const scaledX = x * scaleX
    const scaledY = y * scaleY
    const scaledWidth = width * scaleX
    const scaledHeight = height * scaleY

    const imageData = ctx.getImageData(scaledX, scaledY, scaledWidth, scaledHeight)

    // Create a temporary canvas for the cropped image
    const tempCanvas = document.createElement("canvas")
    tempCanvas.width = scaledWidth
    tempCanvas.height = scaledHeight

    const tempCtx = tempCanvas.getContext("2d")
    if (!tempCtx) return

    tempCtx.putImageData(imageData, 0, 0)

    // Resize the main canvas and draw the cropped image
    canvas.width = scaledWidth
    canvas.height = scaledHeight
    ctx.drawImage(tempCanvas, 0, 0)

    // Reset crop mode and area
    setCropMode(false)
    setCropSelection({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      isSelecting: false,
    })

    // Save to history
    addToHistory(canvas.toDataURL())
  }

  // Rotate image
  const rotateImage = (degrees: number) => {
    if (!canvasRef.current || !image) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      // Create a temporary canvas to hold the rotated image
      const tempCanvas = document.createElement("canvas")
      const tempCtx = tempCanvas.getContext("2d")
      if (!tempCtx) return

      // Set the canvas size based on rotation
      if (degrees === 90 || degrees === 270) {
        tempCanvas.width = img.height
        tempCanvas.height = img.width
      } else {
        tempCanvas.width = img.width
        tempCanvas.height = img.height
      }

      // Translate and rotate
      tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2)
      tempCtx.rotate((degrees * Math.PI) / 180)
      tempCtx.drawImage(img, -img.width / 2, -img.height / 2)

      // Update the main canvas
      canvas.width = tempCanvas.width
      canvas.height = tempCanvas.height
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(tempCanvas, 0, 0)

      // Apply overlays
      drawOverlays(ctx, canvas)

      // Redraw text overlays
      drawTextOverlays(ctx)

      // Draw stickers
      drawStickers(ctx)

      // Save to history
      addToHistory(canvas.toDataURL())
    }
    img.src = image
  }

  // Flip image
  const flipImage = (direction: "horizontal" | "vertical") => {
    if (!canvasRef.current || !image) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Save the current context state
      ctx.save()

      // Set up the transformation
      if (direction === "horizontal") {
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
      } else {
        ctx.translate(0, canvas.height)
        ctx.scale(1, -1)
      }

      // Draw the flipped image
      ctx.drawImage(img, 0, 0)

      // Restore the context state
      ctx.restore()

      // Apply overlays
      drawOverlays(ctx, canvas)

      // Redraw text overlays
      drawTextOverlays(ctx)

      // Draw stickers
      drawStickers(ctx)

      // Save to history
      addToHistory(canvas.toDataURL())
    }
    img.src = image
  }

  // Filter implementations
  const applyGrayscale = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
      data[i] = avg
      data[i + 1] = avg
      data[i + 2] = avg
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const applySepia = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189)
      data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168)
      data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131)
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const applyInvert = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i]
      data[i + 1] = 255 - data[i + 1]
      data[i + 2] = 255 - data[i + 2]
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const applyBlurFilter = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, intensity: number) => {
    ctx.filter = `blur(${intensity}px)`

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      ctx.filter = "none"
    }

    img.src = image!
  }

  const applyVintage = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      data[i] = r * 1.2
      data[i + 1] = g * 0.9
      data[i + 2] = b * 0.8
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const applyRainbow = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.filter = "hue-rotate(180deg) saturate(200%)"

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      ctx.filter = "none"
    }

    img.src = image!
  }

  const applyDramatic = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.filter = "contrast(150%) brightness(80%)"

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      ctx.filter = "none"
    }

    img.src = image!
  }

  const applyNoir = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // First apply grayscale
    applyGrayscale(ctx, canvas)

    // Then increase contrast
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      // Increase contrast
      data[i] = data[i] < 128 ? data[i] * 0.8 : Math.min(255, data[i] * 1.2)
      data[i + 1] = data[i + 1] < 128 ? data[i + 1] * 0.8 : Math.min(255, data[i + 1] * 1.2)
      data[i + 2] = data[i + 2] < 128 ? data[i + 2] * 0.8 : Math.min(255, data[i + 2] * 1.2)
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const applyDuotone = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, color1: string, color2: string) => {
    // First apply grayscale
    applyGrayscale(ctx, canvas)

    // Parse colors
    const parseColor = (color: string) => {
      const r = Number.parseInt(color.slice(1, 3), 16)
      const g = Number.parseInt(color.slice(3, 5), 16)
      const b = Number.parseInt(color.slice(5, 7), 16)
      return { r, g, b }
    }

    const c1 = parseColor(color1)
    const c2 = parseColor(color2)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const value = data[i] / 255 // Use the grayscale value as a percentage

      // Interpolate between the two colors
      data[i] = c1.r * (1 - value) + c2.r * value
      data[i + 1] = c1.g * (1 - value) + c2.g * value
      data[i + 2] = c1.b * (1 - value) + c2.b * value
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const applyVignette = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) * 0.9

    // Create a radial gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.5, centerX, centerY, radius)
    gradient.addColorStop(0, "rgba(0,0,0,0)")
    gradient.addColorStop(1, "rgba(0,0,0,0.8)")

    // Draw the vignette effect
    ctx.save()
    ctx.globalCompositeOperation = "overlay"
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.restore()
  }

  const applySharpen = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, amount: number) => {
    // Create a temporary canvas
    const tempCanvas = document.createElement("canvas")
    tempCanvas.width = canvas.width
    tempCanvas.height = canvas.height
    const tempCtx = tempCanvas.getContext("2d")
    if (!tempCtx) return

    // Copy the original image
    tempCtx.drawImage(canvas, 0, 0)

    // Apply a simple sharpening convolution
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const tempImageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    const tempData = tempImageData.data

    // Simple sharpening kernel
    const kernel = [0, -amount, 0, -amount, 1 + 4 * amount, -amount, 0, -amount, 0]

    for (let y = 1; y < canvas.height - 1; y++) {
      for (let x = 1; x < canvas.width - 1; x++) {
        for (let c = 0; c < 3; c++) {
          const i = (y * canvas.width + x) * 4 + c

          // Apply convolution
          let val = 0
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const idx = ((y + ky) * canvas.width + (x + kx)) * 4 + c
              val += tempData[idx] * kernel[(ky + 1) * 3 + (kx + 1)]
            }
          }

          data[i] = Math.min(255, Math.max(0, val))
        }
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }

  return {
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
  }
}
