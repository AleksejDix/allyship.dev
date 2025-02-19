type VideoProps = {
  videoUrl: string
}

export const Video = ({ videoUrl }: VideoProps) => {
  return (
    <div className="aspect-w-16 aspect-h-9">
      <video
        className="w-full h-full object-cover rounded-lg"
        controls
        src={videoUrl}
      />
    </div>
  )
}
