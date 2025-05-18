"use client"

import { useState, useEffect } from "react"
import { Search, Smile, Star, ImageIcon, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
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
      "🤩",
      "🤔",
      "🤨",
      "😐",
      "😑",
      "😶",
      "🙄",
      "😏",
      "😣",
      "😥",
      "😮",
      "🤐",
      "😯",
      "😪",
      "😫",
      "🥱",
      "😴",
      "😌",
      "😛",
      "😜",
      "😝",
      "🤤",
      "😒",
      "😓",
      "😔",
      "😕",
      "🙃",
      "🤑",
      "😲",
      "☹️",
      "🙁",
      "😖",
      "😞",
      "😟",
      "😤",
      "😢",
      "😭",
      "😦",
      "😧",
      "😨",
      "😩",
      "🤯",
      "😬",
      "😰",
      "😱",
      "🥵",
      "🥶",
      "😳",
      "🤪",
      "😵",
      "🥴",
      "😠",
      "😡",
      "🤬",
      "😷",
      "🤒",
      "🤕",
      "🤢",
      "🤮",
      "🤧",
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
      "💞",
      "💓",
      "💗",
      "💖",
      "💘",
      "💝",
      "💟",
      "☮️",
      "✝️",
      "☪️",
      "🕉️",
      "☸️",
      "✡️",
      "🔯",
      "🕎",
      "☯️",
      "☦️",
      "🛐",
      "⛎",
      "♈",
      "♉",
      "♊",
      "♋",
      "♌",
      "♍",
      "♎",
      "♏",
      "♐",
      "♑",
      "♒",
      "♓",
      "🆔",
      "⚛️",
      "🉑",
      "☢️",
      "☣️",
      "📴",
      "📳",
      "🈶",
      "🈚",
      "🈸",
      "🈺",
      "🈷️",
      "✴️",
      "🆚",
      "💮",
      "🉐",
      "㊙️",
      "㊗️",
      "🈴",
      "🈵",
      "🈹",
      "🈲",
      "🅰️",
      "🅱️",
      "🆎",
      "🆑",
      "🅾️",
      "🆘",
      "❌",
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
      "🐧",
      "🐦",
      "🐤",
      "🐣",
      "🐥",
      "🦆",
      "🦅",
      "🦉",
      "🦇",
      "🐺",
      "🐗",
      "🐴",
      "🦄",
      "🐝",
      "🐛",
      "🦋",
      "🐌",
      "🐞",
      "🐜",
      "🦟",
      "🦗",
      "🕷️",
      "🕸️",
      "🦂",
      "🐢",
      "🐍",
      "🦎",
      "🦖",
      "🦕",
      "🐙",
      "🦑",
      "🦐",
      "🦞",
      "🦀",
      "🐡",
      "🐠",
      "🐟",
      "🐬",
      "🐳",
      "🐋",
      "🦈",
      "🐊",
      "🐅",
      "🐆",
      "🦓",
      "🦍",
      "🦧",
      "🐘",
      "🦛",
      "🦏",
      "🐪",
      "🐫",
      "🦒",
      "🦘",
      "🐃",
      "🐂",
      "🐄",
      "🐎",
      "🐖",
      "🐏",
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
      "🥬",
      "🥒",
      "🌶️",
      "🌽",
      "🥕",
      "🧄",
      "🧅",
      "🥔",
      "🍠",
      "🥐",
      "🥯",
      "🍞",
      "🥖",
      "🥨",
      "🧀",
      "🥚",
      "🍳",
      "🧈",
      "🥞",
      "🧇",
      "🥓",
      "🥩",
      "🍗",
      "🍖",
      "🦴",
      "🌭",
      "🍔",
      "🍟",
      "🍕",
      "🥪",
      "🥙",
      "🧆",
      "🌮",
      "🌯",
      "🥗",
      "🥘",
      "🥫",
      "🍝",
      "🍜",
      "🍲",
      "🍛",
      "🍣",
      "🍱",
      "🥟",
      "🦪",
      "🍤",
      "🍙",
      "🍚",
      "🍘",
      "🍥",
      "🥠",
      "🥮",
      "🍢",
      "🍡",
      "🍧",
      "🍨",
      "🍦",
      "🥧",
      "🧁",
      "🍰",
    ],
  },
  {
    id: "custom",
    name: "Custom",
    icon: Plus,
    stickers: [],
  },
]

export default function StickerPanel() {
  const [activeCategory, setActiveCategory] = useState("emoji")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredStickers, setFilteredStickers] = useState<string[]>([])
  const { addSticker } = useImageEditorContext()

  const currentCategory = stickerCategories.find((cat) => cat.id === activeCategory)

  useEffect(() => {
    if (currentCategory) {
      if (searchQuery) {
        // This is a simplified search - in a real app, you'd have better metadata
        setFilteredStickers(
          currentCategory.stickers.filter((sticker) => sticker.toLowerCase().includes(searchQuery.toLowerCase())),
        )
      } else {
        setFilteredStickers(currentCategory.stickers)
      }
    }
  }, [currentCategory, searchQuery])

  const handleStickerClick = (sticker: string) => {
    // In a real implementation, this would add the sticker to the canvas
    console.log("Adding sticker:", sticker)

    // Mock implementation of addSticker
    if (typeof addSticker === "function") {
      addSticker({
        id: `sticker-${Date.now()}`,
        content: sticker,
        x: 200,
        y: 200,
        scale: 1,
        rotation: 0,
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
        <Input
          placeholder="Search stickers..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-5">
          {stickerCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="px-2">
              <category.icon className="h-4 w-4" />
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="bg-zinc-800 rounded-lg p-2">
        <h3 className="font-medium mb-2 px-2">{currentCategory?.name || "Stickers"}</h3>

        <ScrollArea className="h-[300px]">
          <div className="grid grid-cols-6 gap-2 p-2">
            {filteredStickers.map((sticker, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-10 aspect-square flex items-center justify-center text-xl p-0 hover:bg-zinc-700"
                onClick={() => handleStickerClick(sticker)}
              >
                {sticker}
              </Button>
            ))}

            {filteredStickers.length === 0 && (
              <div className="col-span-6 py-8 text-center text-zinc-400">
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

      <div className="bg-zinc-800 rounded-lg p-4">
        <h3 className="font-medium mb-2">Upload Custom Sticker</h3>
        <Button variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Upload Sticker
        </Button>
      </div>
    </div>
  )
}
