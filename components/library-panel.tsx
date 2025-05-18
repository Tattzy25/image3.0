"use client"

import type React from "react"

import { useRef } from "react"
import { ImageIcon, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import DropZone from "@/components/drop-zone"

interface LibraryPanelProps {
  onImageUpload: (file: File) => void
}

export default function LibraryPanel({ onImageUpload }: LibraryPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImageUpload(file)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 rounded-lg p-4">
        <h3 className="font-medium mb-3">Upload New Image</h3>
        <DropZone onImageDrop={onImageUpload} className="h-[200px] border-zinc-700" showDefaultContent={true} />
      </div>

      <div className="bg-zinc-800 rounded-lg p-4">
        <h3 className="font-medium mb-3">Recent Images</h3>
        <div className="grid grid-cols-3 gap-2">
          <div
            className="aspect-square bg-zinc-700 rounded-md overflow-hidden hover:ring-2 hover:ring-blue-500 cursor-pointer transition-all"
            onClick={() => {
              // Create a fetch request to get the image
              fetch("/colorful-abstract-portrait.png")
                .then((response) => response.blob())
                .then((blob) => {
                  // Create a File object from the blob
                  const file = new File([blob], "colorful-abstract-portrait.png", { type: "image/png" })
                  onImageUpload(file)
                })
                .catch((error) => console.error("Error loading sample image:", error))
            }}
          >
            <img src="/colorful-abstract-portrait.png" alt="Recent" className="w-full h-full object-cover" />
          </div>
          <div className="aspect-square bg-zinc-700 rounded-md flex items-center justify-center text-zinc-500">
            <FolderOpen className="h-8 w-8" />
          </div>
          <div className="aspect-square bg-zinc-700 rounded-md flex items-center justify-center text-zinc-500">
            <FolderOpen className="h-8 w-8" />
          </div>
        </div>
      </div>

      <div className="bg-zinc-800 rounded-lg p-4">
        <h3 className="font-medium mb-3">Stock Images</h3>
        <p className="text-sm text-zinc-400 mb-3">
          Browse our collection of free stock images to use in your projects.
        </p>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            // Open file input
            fileInputRef.current?.click()
          }}
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Browse Images
        </Button>
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
    </div>
  )
}
