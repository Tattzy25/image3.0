"use client"

import { useState, useEffect } from "react"
import { Search, Smile, Star, ImageIcon, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { useImageEditorContext } from "@/context/image-editor-context"

// Sample sticker categories and items
const stickerCategories = [
  {
    id: "emoji",
    name: "Emoji",
    icon: Smile,
    stickers: [
      "😀",
      "😁",
      "😂",
      "🤣",
      "😃",
      "😄",
      "😅",
      "😆",
      "😉",
      "😊",
      "😋",
      "😎",
      "😍",
      "😘",
      "🥰",
      "😗",
      "😙",
      "😚",
      "🙂",
      "🤗",
    ],
  },
  {
    id: "shapes",
    name: "Shapes",
    icon: Star,
    stickers: [
      "⭐",
      "🌟",
      "✨",
      "💫",
      "⚡",
      "☄️",
      "🔥",
      "🌈",
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "💔",
      "❣️",
      "💕",
    ],
  },
  {
    id: "animals",
    name: "Animals",
    icon: ImageIcon,
    stickers: [
      "🐶",
      "🐱",
      "🐭",
      "🐹",
      "🐰",
      "🦊",
      "🐻",
      "🐼",
      "🐨",
      "🐯",
      "🦁",
      "🐮",
      "🐷",
      "🐸",
      "🐵",
      "🙈",
      "🙉",
      "🙊",
      "🐒",
      "🐔",
    ],
  },
  {
    id: "food",
    name: "Food",
    icon: ImageIcon,
    stickers: [
      "🍏",
      "🍎",
      "🍐",
      "🍊",
      "🍋",
      "🍌",
      "🍉",
      "🍇",
      "🍓",
      "🍈",
      "🍒",
      "🍑",
      "🥭",
      "🍍",
      "🥥",
      "🥝",
      "🍅",
      "🍆",
      "🥑",
      "🥦",
    ],
  },
]

export default function StickerPanel() {
  const [activeCategory, setActiveCategory] = useState("emoji")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredStickers, setFilteredStickers] = useState<string[]>([])
  const { addSticker } = useImageEditorContext()
  const { toast } = useToast()

  const currentCategory = stickerCategories.find((cat) => cat.id === activeCategory)

  useEffect(() => {
    if (currentCategory) {
      if (searchQuery) {
        setFilteredStickers(
          currentCategory.stickers.filter((sticker) => sticker.toLowerCase().includes(searchQuery.toLowerCase())),
        )
      } else {
        setFilteredStickers(currentCategory.stickers)
      }
    }
  }, [currentCategory, searchQuery])

  const handleStickerClick = (sticker: string) => {
    try {
      if (typeof addSticker === "function") {
        addSticker({
          content: sticker,
          x: 200, // Center of canvas
          y: 200,
          scale: 2, // Make emojis larger by default
          rotation: 0,
        })

        toast({
          title: "Sticker added",
          description: "Click and drag to position the sticker on your image",
        })
      } else {
        throw new Error("Sticker functionality not available")
      }
    } catch (error) {
      console.error("Error adding sticker:", error)
      toast({
        title: "Error adding sticker",
        description: "There was a problem adding the sticker. Please try again.",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-zinc-800 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 text-amber-400 bg-amber-950/30 p-3 rounded-md mb-4">
          <Info className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">Click on any emoji to add it to your image. You can then position and resize it.</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
        <Input
          placeholder="Search stickers..."
          className="pl-8 text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-4">
          {stickerCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="px-2">
              <category.icon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="bg-zinc-800 rounded-lg p-2">
        <h3 className="font-medium mb-2 px-2">{currentCategory?.name || "Stickers"}</h3>

        <ScrollArea className="h-[300px]">
          <div className="sticker-grid">
            {filteredStickers.map((sticker, index) => (
              <Button
                key={index}
                variant="outline"
                className="sticker-item aspect-square"
                onClick={() => handleStickerClick(sticker)}
              >
                {sticker}
              </Button>
            ))}

            {filteredStickers.length === 0 && (
              <div className="col-span-full py-8 text-center text-zinc-400">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 text-zinc-500" />
                {searchQuery ? (
                  <p>No stickers found matching "{searchQuery}"</p>
                ) : (
                  <p>No stickers available in this category</p>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
