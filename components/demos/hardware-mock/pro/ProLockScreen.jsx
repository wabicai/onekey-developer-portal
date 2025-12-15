'use client'

import { useMemo } from 'react'
import { PRO_COLORS, PRO_SCREEN } from './constants'
import { getProI18n } from './i18n'
import { ProDeviceStatusBar } from './ProDeviceStatusBar'

function joinPath(basePath, pathname) {
  const base = (basePath ?? '').trim()
  if (!base) return pathname
  if (pathname.startsWith('/')) return `${base}${pathname}`
  return `${base}/${pathname}`
}

export function ProLockScreen({ basePath, locale, device, disabled = false, onTap }) {
  const i18n = useMemo(() => getProI18n(locale), [locale])
  const wallpaper = joinPath(basePath, '/hardware-pro/res/wallpaper-1.jpg')

  const title = device?.deviceName ?? device?.model ?? 'OneKey Pro'
  const subtitle = device?.bleName ?? ''

  return (
    <div
      className="absolute inset-0"
      onClick={() => {
        if (disabled) return
        onTap?.()
      }}
      style={{
        width: PRO_SCREEN.width,
        height: PRO_SCREEN.height,
        background: PRO_COLORS.BLACK,
        color: PRO_COLORS.WHITE,
        cursor: disabled ? 'default' : 'pointer'
      }}
    >
      <img
        src={wallpaper}
        alt=""
        draggable={false}
        className="absolute left-0 top-0"
        style={{
          width: PRO_SCREEN.width,
          height: PRO_SCREEN.height,
          objectFit: 'cover',
          opacity: 0.4
        }}
      />

      <ProDeviceStatusBar basePath={basePath} usb ble="enabled" battery={60} />

      <div
        className="absolute left-0 top-0"
        style={{ width: PRO_SCREEN.width, height: PRO_SCREEN.height }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: 76,
            width: 456,
            height: 38,
            textAlign: 'center',
            fontSize: 30,
            fontWeight: 600,
            letterSpacing: -1,
            lineHeight: '38px',
            color: PRO_COLORS.WHITE,
            opacity: 0.85
          }}
        >
          {title}
        </div>

        {subtitle ? (
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: 130,
              width: 456,
              textAlign: 'center',
              fontSize: 30,
              fontWeight: 400,
              letterSpacing: -1,
              lineHeight: '38px',
              color: PRO_COLORS.WHITE,
              opacity: 0.85
            }}
          >
            {subtitle}
          </div>
        ) : null}

        <div
          className="absolute left-0 flex flex-col items-center"
          style={{
            bottom: 24,
            width: PRO_SCREEN.width
          }}
        >
          <img
            src={joinPath(basePath, '/hardware-pro/res/lock.png')}
            alt=""
            draggable={false}
            style={{ width: 40, height: 40, marginBottom: 16, opacity: 0.85 }}
          />
          <div
            style={{
              width: 456,
              textAlign: 'center',
              fontSize: 26,
              fontWeight: 400,
              letterSpacing: -1,
              lineHeight: '32px',
              color: PRO_COLORS.WHITE,
              opacity: 0.85
            }}
          >
            {i18n.lockTapToUnlock}
          </div>
        </div>
      </div>
    </div>
  )
}
