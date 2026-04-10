"use client"

import { useRef, useCallback } from "react"

interface DragScrollOptions {
  /** How fast momentum decays each frame (0–1). Higher = longer glide. */
  friction?: number
}

/**
 * Enables click-and-drag horizontal scrolling on any scrollable container.
 * Works with both mouse (pointer) events and touch events.
 */
export function useDragScroll<T extends HTMLElement>({
  friction = 0.92,
}: DragScrollOptions = {}) {
  const ref = useRef<T>(null)

  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const velocity = useRef(0)
  const lastX = useRef(0)
  const animationId = useRef<number | null>(null)

  const cancelMomentum = useCallback(() => {
    if (animationId.current !== null) {
      cancelAnimationFrame(animationId.current)
      animationId.current = null
    }
  }, [])

  const applyMomentum = useCallback(() => {
    const el = ref.current
    if (!el) return
    if (Math.abs(velocity.current) < 0.5) {
      velocity.current = 0
      return
    }
    el.scrollLeft += velocity.current
    velocity.current *= friction
    animationId.current = requestAnimationFrame(applyMomentum)
  }, [friction])

  const onPointerDown = useCallback(
    (e: React.PointerEvent<T>) => {
      const el = ref.current
      if (!el) return
      if (e.pointerType === "mouse" && e.button !== 0) return

      cancelMomentum()
      isDragging.current = true
      startX.current = e.pageX - el.offsetLeft
      scrollLeft.current = el.scrollLeft
      lastX.current = e.pageX
      velocity.current = 0

      el.setPointerCapture(e.pointerId)
      el.style.cursor = "grabbing"
      el.style.userSelect = "none"
    },
    [cancelMomentum]
  )

  const onPointerMove = useCallback((e: React.PointerEvent<T>) => {
    const el = ref.current
    if (!isDragging.current || !el) return
    const x = e.pageX - el.offsetLeft
    const walk = x - startX.current
    velocity.current = e.pageX - lastX.current
    lastX.current = e.pageX
    el.scrollLeft = scrollLeft.current - walk
  }, [])

  const onPointerUp = useCallback(
    (_e: React.PointerEvent<T>) => {
      const el = ref.current
      if (!el) return
      isDragging.current = false
      el.style.cursor = "grab"
      el.style.userSelect = ""
      animationId.current = requestAnimationFrame(applyMomentum)
    },
    [applyMomentum]
  )

  const onPointerLeave = useCallback(
    (e: React.PointerEvent<T>) => {
      if (isDragging.current && e.pointerType === "mouse") {
        isDragging.current = false
        const el = ref.current
        if (el) {
          el.style.cursor = "grab"
          el.style.userSelect = ""
        }
        animationId.current = requestAnimationFrame(applyMomentum)
      }
    },
    [applyMomentum]
  )

  const onClick = useCallback((e: React.MouseEvent<T>) => {
    if (Math.abs(velocity.current) > 1) {
      e.preventDefault()
      e.stopPropagation()
    }
  }, [])

  const handlers = {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerLeave,
    onClick,
  }

  return { ref, handlers }
}
