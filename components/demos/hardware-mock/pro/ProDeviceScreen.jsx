'use client'

import { ProDeviceViewport } from './ProDeviceViewport'
import { ProAddressOfflineScreen } from './ProAddressOfflineScreen'
import { ProHomeScreen } from './ProHomeScreen'
import { ProLockScreen } from './ProLockScreen'
import { ProPinScreen } from './ProPinScreen'
import { ProTxConfirmScreen } from './ProTxConfirmScreen'

export function ProDeviceScreen({
  basePath,
  locale,
  busy,
  device,
  ui,
  onSubmitPin,
  onConfirm,
  onReject,
  onCancel,
  onTapToUnlock
}) {
  const randomPinMap = Boolean(device?.randomPinMap ?? false)
  const deviceUnlocked = Boolean(device?.unlocked)

  return (
    <ProDeviceViewport>
      {ui?.type === 'pin' ? (
        <ProPinScreen
          key={ui.requestId}
          basePath={basePath}
          locale={locale}
          ui={ui}
          randomPinMap={randomPinMap}
          disabled={busy}
          onSubmit={onSubmitPin}
          onCancel={onCancel}
        />
      ) : ui?.type === 'confirm' && (ui.action === 'btcGetAddress' || ui.action === 'BTCgetAddress' || ui.action === 'get_address') ? (
        <ProAddressOfflineScreen
          key={ui.requestId}
          basePath={basePath}
          locale={locale}
          details={ui.details}
          disabled={busy}
          onDone={onConfirm}
        />
      ) : ui?.type === 'confirm' ? (
        <ProTxConfirmScreen
          key={ui.requestId}
          basePath={basePath}
          locale={locale}
          details={ui.details}
          disabled={busy}
          onApprove={onConfirm}
          onReject={onReject}
        />
      ) : (
        <>
          {deviceUnlocked ? (
            <ProHomeScreen basePath={basePath} locale={locale} device={device} busy={busy} />
          ) : (
            <ProLockScreen basePath={basePath} locale={locale} device={device} disabled={busy} onTap={onTapToUnlock} />
          )}
        </>
      )}
    </ProDeviceViewport>
  )
}
