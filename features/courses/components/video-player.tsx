"use client"

type VideoPlayerProps = {
  videoId: string
  title: string
}

export function VideoPlayer({ videoId, title }: VideoPlayerProps) {
  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-black">
      {/* Replace with your video player implementation */}
      <div className="absolute inset-0 flex items-center justify-center text-white">
        Video Player: {title}
      </div>
    </div>
  )
}
