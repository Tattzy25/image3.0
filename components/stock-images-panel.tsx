"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, ImageIcon, Download, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { useImageEditorContext } from "@/context/image-editor-context"

interface StockImage {
  id: number
  width: number
  height: number
  url: string
  photographer: string
  photographer_url: string
  photographer_id: number
  avg_color: string
  src: {
    original: string
    large2x: string
    large: string
    medium: string
    small: string
    portrait: string
    landscape: string
    tiny: string
  }
  liked: boolean
  alt: string
}

interface PexelsResponse {
  page: number
  per_page: number
  photos: StockImage[]
  total_results: number
  next_page: string
}

export default function StockImagesPanel() {
  const [searchQuery, setSearchQuery] = useState("")
  const [images, setImages] = useState<StockImage[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const { toast } = useToast()
  const { setImage, addToHistory, addLayer } = useImageEditorContext()

  const fetchImages = async (query = "nature", pageNum = 1) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/stock-images?query=${query}&page=${pageNum}&per_page=20`)

      if (!response.ok) {
        throw new Error("Failed to fetch stock images")
      }

      const data: PexelsResponse = await response.json()
      setImages(data.photos)
      setTotalPages(Math.ceil(data.total_results / data.per_page))
    } catch (error) {
      console.error("Error fetching stock images:", error)
      toast({
        title: "Error",
        description: "Failed to fetch stock images. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchImages(searchQuery || "nature", 1)
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchImages(searchQuery || "nature", nextPage)
  }

  const handleImageSelect = async (image: StockImage) => {
    try {
      // Use the medium size for better performance
      const imageUrl = image.src.medium

      // Create a new image to load it
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = imageUrl

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })

      // Convert to data URL for internal use
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(img, 0, 0)
      const dataUrl = canvas.toDataURL("image/jpeg")

      // Set the image in the editor
      setImage(dataUrl)
      addToHistory(dataUrl)

      // Add as a new layer
      addLayer({
        id: `layer-${Date.now()}`,
        name: image.alt || "Stock Image",
        type: "image",
        visible: true,
        data: dataUrl,
        position: { x: 0, y: 0 },
        opacity: 100,
      })

      toast({
        title: "Image added",
        description: "Stock image has been added to your canvas",
      })
    } catch (error) {
      console.error("Error loading stock image:", error)
      toast({
        title: "Error",
        description: "Failed to load the selected image",
      })
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
        <Input
          placeholder="Search stock images..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      {loading && images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-zinc-500 mb-4" />
          <p className="text-zinc-400">Loading stock images...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <ImageIcon className="h-12 w-12 text-zinc-500 mb-4" />
          <p className="text-zinc-400 mb-4">No images found</p>
          <Button onClick={() => fetchImages()}>Browse Popular Images</Button>
        </div>
      ) : (
        <>
          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-2 gap-2">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative group overflow-hidden rounded-md cursor-pointer"
                  onClick={() => handleImageSelect(image)}
                >
                  <img
                    src={image.src.medium || "/placeholder.svg"}
                    alt={image.alt}
                    className="w-full h-auto object-cover aspect-square group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                    <Download className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {page < totalPages && (
            <Button variant="outline" className="w-full" onClick={handleLoadMore} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More Images"
              )}
            </Button>
          )}

          <div className="text-xs text-zinc-500 text-center">
            Images provided by{" "}
            <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="underline">
              Pexels
            </a>
          </div>
        </>
      )}
    </div>
  )
}
