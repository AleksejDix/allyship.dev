import { TEST_CONFIGS } from "@/lib/testing/test-config"
import { memo } from "react"

import { useTestContext } from "./TestContext"

// Memoized Progress Indicator Component
const ProgressIndicator = memo(function ProgressIndicator() {
  const { activeTest } = useTestContext()

  if (!activeTest) return <div className="h-6" />

  return (
    <div className="h-6 text-sm text-muted-foreground">
      {`Running ${TEST_CONFIGS[activeTest].displayName}...`}
    </div>
  )
})

export default ProgressIndicator
