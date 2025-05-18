"use client"

import { useState } from "react"
import type { Layer } from "@/context/image-editor-context"

export function useLayers() {
  const [layers, setLayers] = useState<Layer[]>([])
  const [activeLayer, setActiveLayer] = useState<string | null>(null)

  const addLayer = (layer: Layer) => {
    setLayers((prevLayers) => [...prevLayers, layer])
    setActiveLayer(layer.id)
  }

  const removeLayer = (id: string) => {
    setLayers((prevLayers) => prevLayers.filter((layer) => layer.id !== id))
    if (activeLayer === id) {
      const remainingLayers = layers.filter((layer) => layer.id !== id)
      setActiveLayer(remainingLayers.length > 0 ? remainingLayers[0].id : null)
    }
  }

  const moveLayer = (id: string, direction: "up" | "down") => {
    const index = layers.findIndex((layer) => layer.id === id)
    if (index === -1) return

    const newLayers = [...layers]
    if (direction === "up" && index > 0) {
      // Move layer up (visually down in the stack)
      ;[newLayers[index], newLayers[index - 1]] = [newLayers[index - 1], newLayers[index]]
    } else if (direction === "down" && index < layers.length - 1) {
      // Move layer down (visually up in the stack)
      ;[newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]]
    }

    setLayers(newLayers)
  }

  const updateLayer = (id: string, updates: Partial<Layer>) => {
    setLayers((prevLayers) => prevLayers.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer)))
  }

  return {
    layers,
    activeLayer,
    addLayer,
    removeLayer,
    moveLayer,
    updateLayer,
    setActiveLayer,
  }
}
