"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface DropZoneProps {
  onImageDrop: (file: File) => void
  className?: string
  children?: React.ReactNode
  showDefaultContent?: boolean
}

export default function DropZone({ onImageDrop, className, children, showDefaultContent = true }: DropZoneProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const { toast } = useToast()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setIsDraggingOver(false)

      if (acceptedFiles.length === 0) {
        return
      }

      // Check file type
      const file = acceptedFiles[0]
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, GIF, etc.)",
        })
        return
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB",
        })
        return
      }

      onImageDrop(file)

      toast({
        title: "Image uploaded",
        description: `${file.name} has been successfully uploaded.`,
      })
    },
    [onImageDrop, toast],
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".svg", ".bmp", ".tiff"],
    },
    onDrop,
    onDragEnter: () => setIsDraggingOver(true),
    onDragLeave: () => setIsDraggingOver(false),
    noClick: !!children, // Disable click when we have children
    noKeyboard: !!children, // Disable keyboard when we have children
  })

  // If we have children, we're using this as a wrapper around existing content
  if (children) {
    return (
      <div
        {...getRootProps()}
        className={cn("relative", isDraggingOver && "ring-2 ring-blue-500 ring-inset", className)}
      >
        <input {...getInputProps()} />
        {children}

        {/* Overlay that appears when dragging */}
        {isDragActive && (
          <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm flex items-center justify-center rounded-lg border-2 border-dashed border-blue-500 z-10">
            <div className="bg-zinc-900/90 p-6 rounded-lg text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-xl font-bold text-white mb-2">Drop to Upload</h3>
              <p className="text-zinc-300">Release to add this image to your project</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Default content when used as a standalone component
  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex flex-col items-center justify-center h-[500px] w-full border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer",
        isDragActive ? "border-blue-500 bg-blue-500/10" : "border-zinc-700 hover:border-zinc-500",
        className,
      )}
    >
      <input {...getInputProps()} />

      {showDefaultContent && (
        <>
          {isDragActive ? (
            <div className="text-center p-8 bg-zinc-800/80 rounded-lg">
              <Upload className="h-16 w-16 mx-auto mb-4 text-blue-500 animate-pulse" />
              <h3 className="text-xl font-bold text-white mb-2">Drop to Upload</h3>
              <p className="text-zinc-300">Release to add this image to your project</p>
            </div>
          ) : (
            <>
              <div className="bg-zinc-800 p-4 rounded-full mb-4">
                <Upload className="h-12 w-12 text-zinc-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Drag & Drop</h3>
              <p className="text-zinc-400 mb-6 text-center max-w-md">
                Drag and drop an image file here, or click to browse your files
              </p>
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                <div className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-400">JPEG</div>
                <div className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-400">PNG</div>
                <div className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-400">GIF</div>
                <div className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-400">WebP</div>
                <div className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-400">SVG</div>
              </div>
              <Button onClick={open} className="bg-blue-600 hover:bg-blue-700">
                <ImageIcon className="h-4 w-4 mr-2" />
                Select Image
              </Button>
              <p className="text-xs text-zinc-500 mt-4">Maximum file size: 10MB</p>
            </>
          )}
        </>
      )}
    </div>
  )
}
