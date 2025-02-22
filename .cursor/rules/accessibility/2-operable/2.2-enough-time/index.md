---
title: "Guideline 2.2 – Enough Time"
description: "Provide users enough time to read and use content"
category: "Operable"
tags: ["timing", "timeout", "pause", "extend", "interruptions"]
---

# Guideline 2.2 – Enough Time

## Overview

This guideline ensures that users have enough time to read and use content. This is crucial for users who may need more time to read, understand, or interact with content, including people with cognitive disabilities, visual impairments, or motor difficulties.

## Success Criteria

### [2.2.1 Timing Adjustable (Level A)](./2.2.1-timing-adjustable.md)

- Users can turn off, adjust, or extend time limits
- Exceptions for real-time events and essential time limits
- Users must get warning before time expires
- At least 20 seconds to extend time

### [2.2.2 Pause, Stop, Hide (Level A)](./2.2.2-pause-stop-hide.md)

- Moving, blinking, scrolling content can be paused
- Auto-updating information can be paused, stopped, or hidden
- Applies to content that starts automatically
- Lasts more than 5 seconds

## Why This Matters

Providing enough time is essential because:

- Users with disabilities may need more time to read
- Motor impairments can slow interaction speed
- Screen reader users need time to navigate content
- Cognitive disabilities affect processing speed
- Environmental factors can impact interaction time

## Implementation Approaches

1. **Time Limits**

   - Make time limits adjustable
   - Provide clear warnings
   - Allow multiple extensions
   - Support permanent time disabling

2. **Moving Content**

   - Add pause controls
   - Remember user preferences
   - Provide alternative access
   - Avoid auto-starting animations

3. **Auto-Updates**

   - Allow pausing updates
   - Provide manual refresh
   - Show update status
   - Control update frequency

4. **Session Management**
   - Warn before timeout
   - Save user progress
   - Provide re-authentication
   - Maintain entered data

## Common Patterns

### Session Timeout

```tsx
function SessionTimeout() {
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutes
  const [isWarningVisible, setIsWarningVisible] = useState(false)

  useEffect(() => {
    if (timeLeft <= 60 && !isWarningVisible) {
      setIsWarningVisible(true)
    }
    if (timeLeft <= 0) {
      logout()
    }
  }, [timeLeft])

  return (
    <div role="status" aria-live="polite">
      {isWarningVisible && (
        <div className="timeout-warning">
          <p>Your session will expire in {timeLeft} seconds</p>
          <div className="button-group">
            <button
              onClick={() => {
                setTimeLeft(900)
                setIsWarningVisible(false)
              }}
              aria-label="Extend session by 15 minutes"
            >
              Extend Session
            </button>
            <button
              onClick={() => {
                setTimeLeft(Infinity)
                setIsWarningVisible(false)
              }}
              aria-label="Keep session active indefinitely"
            >
              Stay Logged In
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
```

### Auto-Updating Content

```tsx
function LiveUpdates() {
  const [isPaused, setIsPaused] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  return (
    <div role="region" aria-label="Live updates">
      <div className="controls">
        <button onClick={() => setIsPaused(!isPaused)} aria-pressed={isPaused}>
          {isPaused ? "Resume" : "Pause"} Updates
        </button>
        {lastUpdate && (
          <p aria-live="polite">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        )}
      </div>

      <div className="content">{/* Content that updates */}</div>
    </div>
  )
}
```

## Testing Checklist

1. **Time Limit Testing**

   - Verify timeout warnings
   - Test extension mechanisms
   - Check saved progress
   - Validate re-authentication

2. **Animation Control**

   - Test pause functionality
   - Verify stop controls
   - Check animation duration
   - Validate user preferences

3. **Update Testing**

   - Test pause mechanisms
   - Verify manual updates
   - Check update frequency
   - Validate status indicators

4. **Session Testing**
   - Test timeout behavior
   - Check warning timing
   - Verify data persistence
   - Validate re-login process

## Resources

- [W3C WAI - Understanding Enough Time](https://www.w3.org/WAI/WCAG21/Understanding/time-adjustable)
- [WebAIM - Cognitive Disabilities](https://webaim.org/articles/cognitive/)
- [MDN - Handling Session Timeouts](https://developer.mozilla.org/en-US/docs/Web/Security/Types_of_attacks/Session_hijacking)
- [ARIA Authoring Practices - Live Regions](https://www.w3.org/WAI/ARIA/apg/patterns/live-regions/)
