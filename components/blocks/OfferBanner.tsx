import { Card, CardContent } from "@/components/ui/card"
import { CountdownTimer } from "@/components/countdown-timer"

interface OfferBannerProps {
  title: string
  description: string
  deadline: Date
  className?: string
}

export function OfferBanner({ title, description, deadline, className }: OfferBannerProps) {
  return (
    <Card className={`bg-[#1a2e22] text-white overflow-hidden ${className}`}>
      <CardContent className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
          <p className="text-lg md:text-xl text-gray-200">{description}</p>
        </div>
        <div className="bg-black/80 rounded-lg p-4 min-w-[280px]">
          <CountdownTimer targetDate={deadline} />
        </div>
      </CardContent>
    </Card>
  )
}

