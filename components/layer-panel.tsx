"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown, Eye, EyeOff, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { useImageEditorContext } from "@/context/image-editor-context"
import { cn } from "@/lib/utils"

export default function LayerPanel() {
  const { layers, activeLayer, addLayer, removeLayer, moveLayer, setActiveLayer } = useImageEditorContext()
  const [newLayerName, setNewLayerName] = useState("")

  const handleAddLayer = () => {
    const name = newLayerName.trim() || `Layer ${layers.length + 1}`

    addLayer({
      id: `layer-${Date.now()}`,
      name,
      type: "shape",
      visible: true,
      data: null,
      position: { x: 0, y: 0 },
      opacity: 100,
    })

    setNewLayerName("")
  }

  const toggleLayerVisibility = (layerId: string, currentVisibility: boolean) => {
    const layerIndex = layers.findIndex((layer) => layer.id === layerId)
    if (layerIndex !== -1) {
      const updatedLayers = [...layers]
      updatedLayers[layerIndex] = {
        ...updatedLayers[layerIndex],
        visible: !currentVisibility,
      }
      // Since we don't have direct access to updateLayer, we'll need to handle this differently
      // This is a placeholder for the actual implementation
    }
  }

  const handleOpacityChange = (layerId: string, opacity: number) => {
    const layerIndex = layers.findIndex((layer) => layer.id === layerId)
    if (layerIndex !== -1) {
      const updatedLayers = [...layers]
      updatedLayers[layerIndex] = {
        ...updatedLayers[layerIndex],
        opacity,
      }
      // This is a placeholder for the actual implementation
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">Layers</h3>
        <Button variant="ghost" size="sm" onClick={handleAddLayer}>
          <Plus className="h-4 w-4 mr-1" />
          Add Layer
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="New layer name"
          value={newLayerName}
          onChange={(e) => setNewLayerName(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleAddLayer}>Add</Button>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        {layers.length === 0 ? (
          <div className="text-center py-4 text-zinc-500">No layers yet</div>
        ) : (
          layers.map((layer) => (
            <div
              key={layer.id}
              className={cn(
                "p-3 rounded-md border flex items-center justify-between",
                activeLayer === layer.id
                  ? "bg-zinc-700 border-zinc-600"
                  : "bg-zinc-800 border-zinc-700 hover:bg-zinc-750",
              )}
              onClick={() => setActiveLayer(layer.id)}
            >
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleLayerVisibility(layer.id, layer.visible)
                  }}
                >
                  {layer.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                <span className="text-sm font-medium">{layer.name}</span>
                <span className="text-xs text-zinc-400">{layer.type}</span>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    moveLayer(layer.id, "up")
                  }}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    moveLayer(layer.id, "down")
                  }}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-500 hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeLayer(layer.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {activeLayer && (
        <div className="pt-4 border-t border-zinc-700">
          <h4 className="text-sm font-medium mb-2">Layer Opacity</h4>
          <Slider
            value={[layers.find((l) => l.id === activeLayer)?.opacity || 100]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => handleOpacityChange(activeLayer, value[0])}
          />
        </div>
      )}
    </div>
  )
}
