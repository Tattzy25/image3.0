"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react"
import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { TextOverlay } from "@/context/image-editor-context"

interface TextPanelProps {
  addTextOverlay: (textProps: Omit<TextOverlay, "id">) => void
}

export default function TextPanel({ addTextOverlay }: TextPanelProps) {
  const [text, setText] = useState("")
  const [fontFamily, setFontFamily] = useState("Arial")
  const [fontSize, setFontSize] = useState(24)
  const [textColor, setTextColor] = useState("#ffffff")
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("center")

  const handleAddText = () => {
    if (!text.trim()) return

    addTextOverlay({
      text,
      x: 200, // Default position - center of canvas
      y: 200, // Default position
      fontSize,
      fontFamily,
      color: textColor,
      isBold,
      isItalic,
      isUnderline,
      alignment,
    })

    // Reset the form
    setText("")
  }

  return (
    <div className="space-y-4">
      <Input placeholder="Enter text here..." value={text} onChange={(e) => setText(e.target.value)} />

      <div className="flex justify-between">
        <div className="flex gap-1">
          <Button variant={isBold ? "default" : "outline"} size="icon" onClick={() => setIsBold(!isBold)}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant={isItalic ? "default" : "outline"} size="icon" onClick={() => setIsItalic(!isItalic)}>
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant={isUnderline ? "default" : "outline"}
            size="icon"
            onClick={() => setIsUnderline(!isUnderline)}
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-1">
          <Button
            variant={alignment === "left" ? "default" : "outline"}
            size="icon"
            onClick={() => setAlignment("left")}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={alignment === "center" ? "default" : "outline"}
            size="icon"
            onClick={() => setAlignment("center")}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={alignment === "right" ? "default" : "outline"}
            size="icon"
            onClick={() => setAlignment("right")}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Select value={fontFamily} onValueChange={setFontFamily}>
            <SelectTrigger>
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Helvetica">Helvetica</SelectItem>
              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
              <SelectItem value="Courier New">Courier New</SelectItem>
              <SelectItem value="Verdana">Verdana</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={fontSize.toString()} onValueChange={(value) => setFontSize(Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="16">16px</SelectItem>
              <SelectItem value="20">20px</SelectItem>
              <SelectItem value="24">24px</SelectItem>
              <SelectItem value="32">32px</SelectItem>
              <SelectItem value="48">48px</SelectItem>
              <SelectItem value="64">64px</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="font-medium text-sm">Text Color:</div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-8 h-8 p-0 border-2" style={{ backgroundColor: textColor }} />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <HexColorPicker color={textColor} onChange={setTextColor} />
          </PopoverContent>
        </Popover>
        <div className="text-xs text-zinc-400">{textColor}</div>
      </div>

      <Button className="w-full" onClick={handleAddText}>
        Add Text
      </Button>
    </div>
  )
}
