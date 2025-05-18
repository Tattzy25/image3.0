import ImageEditor from "@/components/image-editor"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Real-Time Image Editor",
  description: "A powerful real-time image editor with AI generation capabilities",
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-7xl">
        <ImageEditor />
      </div>
    </main>
  )
}
