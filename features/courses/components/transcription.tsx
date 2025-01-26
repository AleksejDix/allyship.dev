type TranscriptionProps = {
  text: string
}

export function Transcription({ text }: TranscriptionProps) {
  return (
    <div className="prose prose-slate max-w-none">
      <h2 className="text-2xl font-semibold mb-4">Transcription</h2>
      <div className="p-6 rounded-xl bg-muted/50 border border-muted-foreground/20 shadow-sm">
        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {text}
        </p>
      </div>
    </div>
  )
}
