"use client"

import { useState } from "react"

export function useImageHistory() {
  const [image, setImage] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Add to history stack
  const addToHistory = (imageData: string) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(imageData)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Undo action
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setImage(history[historyIndex - 1])
    }
  }

  // Redo action
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setImage(history[historyIndex + 1])
    }
  }

  return {
    image,
    setImage,
    history,
    historyIndex,
    addToHistory,
    handleUndo,
    handleRedo,
  }
}
