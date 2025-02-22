---
title: "Guideline 2.5 – Input Modalities"
description: "Make it easier for users to operate functionality through various inputs beyond keyboard"
category: "Operable"
tags: ["input", "pointer", "touch", "motion", "gestures"]
---

# Guideline 2.5 – Input Modalities

## Overview

This guideline ensures that web content and applications can be operated through various input methods, making them more accessible to users with different abilities and preferences. It addresses pointer interactions, touch gestures, motion controls, and the relationship between visual labels and their programmatic equivalents.

## Success Criteria

### [2.5.1 Pointer Gestures (Level A)](./2.5.1-pointer-gestures.md)

- All multipoint or path-based gestures must have single-pointer alternatives
- Complex gestures must not be required unless essential
- Provide alternative input methods for gesture-based interactions

### [2.5.2 Pointer Cancellation (Level A)](./2.5.2-pointer-cancellation.md)

- Users can cancel or undo pointer actions
- Actions occur on up-event rather than down-event
- Essential functionality exceptions are clearly documented
- Prevent accidental activation

### [2.5.3 Label in Name (Level A)](./2.5.3-label-in-name.md)

- Visual labels must match their accessible names
- Text in labels must be included in accessible names
- Maintain consistency between visual and programmatic labels
- Support voice input users

### [2.5.4 Motion Actuation (Level A)](./2.5.4-motion-actuation.md)

- Motion-based features must have alternative controls
- Device motion features can be disabled
- Prevent accidental actuation through motion
- Provide UI alternatives for motion controls

## Why This Matters

Diverse input methods are essential because:

- Users have different physical abilities and limitations
- Various devices and input methods are used to access content
- Some users rely on specific input methods
- Preventing accidental activation improves usability
- Supporting multiple input methods increases accessibility

## Implementation Approaches

1. **Gesture Alternatives**

   - Provide button controls for swipe actions
   - Implement click alternatives for complex gestures
   - Support both touch and mouse interactions
   - Include keyboard alternatives

2. **Pointer Safety**

   - Use up-events for actions
   - Provide cancel/undo options
   - Implement abort mechanisms
   - Handle touch events safely

3. **Label Matching**

   - Ensure visual and programmatic label consistency
   - Include visible text in accessible names
   - Support voice input commands
   - Maintain clear label relationships

4. **Motion Controls**
   - Provide UI alternatives for motion features
   - Include motion disable options
   - Handle device orientation changes
   - Support alternative input methods

## Common Patterns

### Safe Touch Handling

```tsx
function SafeTouchButton({
  onAction,
  children,
}: {
  onAction: () => void
  children: React.ReactNode
}) {
  const [isDragging, setIsDragging] = useState(false)
  const startPos = useRef<{ x: number; y: number } | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    startPos.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startPos.current) return

    const touch = e.touches[0]
    const deltaX = Math.abs(touch.clientX - startPos.current.x)
    const deltaY = Math.abs(touch.clientY - startPos.current.y)

    // If moved more than 10px, consider it a drag
    if (deltaX > 10 || deltaY > 10) {
      setIsDragging(true)
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging) {
      onAction()
    }
    setIsDragging(false)
    startPos.current = null
  }

  return (
    <button
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="touch-button"
    >
      {children}
    </button>
  )
}
```

### Motion Feature Toggle

```tsx
function MotionFeature() {
  const [isMotionEnabled, setIsMotionEnabled] = useState(false)
  const [orientation, setOrientation] = useState<DeviceOrientationEvent | null>(
    null
  )

  useEffect(() => {
    if (!isMotionEnabled) return

    const handleOrientation = (event: DeviceOrientationEvent) => {
      setOrientation(event)
    }

    window.addEventListener("deviceorientation", handleOrientation)
    return () =>
      window.removeEventListener("deviceorientation", handleOrientation)
  }, [isMotionEnabled])

  return (
    <div className="motion-feature">
      <div className="controls">
        <button
          onClick={() => setIsMotionEnabled(!isMotionEnabled)}
          aria-pressed={isMotionEnabled}
        >
          {isMotionEnabled ? "Disable" : "Enable"} motion controls
        </button>

        {/* Alternative UI controls */}
        <div className="manual-controls">
          <button onClick={() => handleTilt("left")}>Tilt Left</button>
          <button onClick={() => handleTilt("right")}>Tilt Right</button>
        </div>
      </div>

      {/* Feature content */}
    </div>
  )
}
```

## Testing Checklist

1. **Gesture Testing**

   - Verify single-pointer alternatives
   - Test complex gesture bypasses
   - Check keyboard alternatives
   - Validate touch interactions

2. **Pointer Safety**

   - Test action cancellation
   - Verify up-event triggers
   - Check undo functionality
   - Test drag handling

3. **Label Verification**

   - Compare visual and accessible labels
   - Test screen reader output
   - Verify voice input commands
   - Check label relationships

4. **Motion Features**
   - Test motion alternatives
   - Verify disable options
   - Check orientation handling
   - Validate UI controls

## Resources

- [W3C - Understanding Input Modalities](https://www.w3.org/WAI/WCAG21/Understanding/input-modalities.html)
- [MDN - Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [Web.dev - Touch Interaction Guide](https://web.dev/touch/)
- [MDN - Device Orientation Events](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent)
