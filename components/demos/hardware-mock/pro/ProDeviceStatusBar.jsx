import { PRO_COLORS, PRO_SCREEN } from './constants'

function joinPath(basePath, pathname) {
  const base = (basePath ?? '').trim()
  if (!base) return pathname
  if (pathname.startsWith('/')) return `${base}${pathname}`
  return `${base}/${pathname}`
}

export function ProDeviceStatusBar({
  basePath,
  usb = true,
  ble = 'enabled',
  battery = 60
}) {
  const iconBase = joinPath(basePath, '/hardware-pro/res')
  const bleIcon =
    ble === 'connected'
      ? `${iconBase}/ble-connected.png`
      : ble === 'disabled'
        ? `${iconBase}/ble-disabled.png`
        : `${iconBase}/ble-enabled.png`

  const batteryIcon = `${iconBase}/battery-${battery}-white.png`

  return (
    <div
      className="absolute left-0 top-0 flex items-center justify-end gap-0"
      style={{
        width: PRO_SCREEN.width,
        height: PRO_SCREEN.statusBarHeight,
        padding: '6px 4px',
        color: PRO_COLORS.WHITE
      }}
    >
      {usb ? (
        <img
          src={`${iconBase}/usb.png`}
          alt=""
          draggable={false}
          style={{ width: 32, height: 32 }}
        />
      ) : null}

      <img
        src={bleIcon}
        alt=""
        draggable={false}
        style={{ width: 32, height: 32 }}
      />

      <img
        src={batteryIcon}
        alt=""
        draggable={false}
        style={{ width: 32, height: 32 }}
      />
    </div>
  )
}

