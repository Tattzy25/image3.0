"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FilterPanelProps {
  applyFilter: (filter: string) => void
  activeFilter: string | null
}

export default function FilterPanel({ applyFilter, activeFilter }: FilterPanelProps) {
  const filters = [
    { id: "original", name: "Original" },
    { id: "grayscale", name: "Grayscale", style: "grayscale(100%)" },
    { id: "sepia", name: "Sepia", style: "sepia(100%)" },
    { id: "invert", name: "Invert", style: "invert(100%)" },
    { id: "blur", name: "Blur", style: "blur(2px)" },
    { id: "vintage", name: "Vintage", style: "sepia(50%) contrast(120%) brightness(90%)" },
    { id: "rainbow", name: "Rainbow", style: "hue-rotate(180deg) saturate(200%)" },
    { id: "dramatic", name: "Dramatic", style: "contrast(150%) brightness(80%)" },
    { id: "noir", name: "Noir", style: "grayscale(100%) contrast(150%) brightness(80%)" },
    { id: "duotone", name: "Duotone", style: "grayscale(100%) sepia(50%)" },
    { id: "vignette", name: "Vignette", style: "brightness(90%)" },
    { id: "warm", name: "Warm", style: "sepia(30%) saturate(140%)" },
  ]

  // Reference image for filter previews
  const previewImageSrc = "/colorful-abstract-portrait.png"

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant="outline"
          className={cn(
            "flex flex-col items-center justify-center p-1 aspect-square w-full h-24 rounded-lg overflow-hidden",
            activeFilter === filter.id && "border-orange-500 bg-orange-500/10",
          )}
          onClick={() => applyFilter(filter.id)}
        >
          <div className="w-full aspect-square rounded overflow-hidden mb-1">
            {filter.id === "original" ? (
              <img src={previewImageSrc || "/placeholder.svg"} alt="Original" className="w-full h-full object-cover" />
            ) : (
              <img
                src={previewImageSrc || "/placeholder.svg"}
                alt={filter.name}
                className="w-full h-full object-cover"
                style={{ filter: filter.style }}
              />
            )}
          </div>
          <span className="text-xs">{filter.name}</span>
        </Button>
      ))}
    </div>
  )
}
