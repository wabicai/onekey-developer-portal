'use client'

import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { PRO_SCREEN } from './constants'

function getScaleForWidth(width) {
  if (!Number.isFinite(width) || width <= 0) return 1
  return Math.min(1, width / PRO_SCREEN.width)
}

export function ProDeviceViewport({ children, maxWidth = 280 }) {
  const wrapRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [measured, setMeasured] = useState(false)

  const wrapStyle = useMemo(
    () => ({
      aspectRatio: `${PRO_SCREEN.width} / ${PRO_SCREEN.height}`,
      maxWidth
    }),
    [maxWidth]
  )

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return undefined

    const update = () => {
      const width = el.getBoundingClientRect().width
      if (!Number.isFinite(width) || width <= 0) return
      setScale(getScaleForWidth(width))
      setMeasured(true)
    }

    update()

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const width = entry.contentRect.width
      if (!Number.isFinite(width) || width <= 0) return
      setScale(getScaleForWidth(width))
      setMeasured(true)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="relative mx-auto w-full overflow-hidden" style={wrapStyle} ref={wrapRef}>
      <div
        className="absolute left-0 top-0 overflow-hidden bg-black ring-1 ring-black/10"
        style={{
          width: PRO_SCREEN.width,
          height: PRO_SCREEN.height,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          opacity: measured ? 1 : 0,
          willChange: 'transform'
        }}
      >
        {children}
      </div>
    </div>
  )
}
