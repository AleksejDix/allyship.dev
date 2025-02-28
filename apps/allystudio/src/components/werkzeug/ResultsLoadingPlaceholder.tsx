import { cn } from "@/lib/utils"

const ResultsLoadingPlaceholder = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="h-5 w-1/3 bg-muted/40 dark:bg-muted/20 rounded"></div>
      </div>

      {[1, 2, 3].map((index) => (
        <div key={index} className="space-y-3">
          <div className="flex items-center justify-between">
            <div
              className={cn(
                "h-4 w-1/4 rounded",
                index === 1
                  ? "bg-red-400/30 dark:bg-red-400/20"
                  : index === 2
                    ? "bg-amber-300/30 dark:bg-amber-300/20"
                    : "bg-green-300/30 dark:bg-green-300/20"
              )}></div>
            <div className="h-px flex-1 bg-border/20 dark:bg-border/10 mx-3"></div>
          </div>

          {[1, 2].map((item) => (
            <div
              key={`${index}-${item}`}
              className={cn(
                "border rounded-md p-3 mb-3 h-16",
                "bg-muted/30 dark:bg-muted/10 border-border/30"
              )}>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-muted/50 dark:bg-muted/30"></div>
                <div className="h-4 w-3/4 bg-muted/50 dark:bg-muted/30 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default ResultsLoadingPlaceholder
