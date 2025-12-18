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
  allowPinInput = true,
  allowConfirmInput = true,
  allowUnlock = true,
  onSubmitPin,
  onConfirm,
  onReject,
  onCancel,
  onTapToUnlock
}) {
  const randomPinMap = Boolean(device?.randomPinMap ?? false)
  const deviceUnlocked = Boolean(device?.unlocked)
  const pinDisabled = Boolean(busy || !allowPinInput)
  const confirmDisabled = Boolean(busy || !allowConfirmInput)
  const unlockDisabled = Boolean(busy || !allowUnlock)

  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      <div
        className="rounded-[44px] bg-gradient-to-b from-zinc-800 via-zinc-950 to-black p-3 ring-1 ring-white/10"
        style={{ boxShadow: '0 22px 48px rgba(0,0,0,0.25)' }}
      >
        <div className="overflow-hidden rounded-[34px] bg-black ring-1 ring-white/10">
          <ProDeviceViewport maxWidth={9999}>
            {ui?.type === 'pin' ? (
              <ProPinScreen
                key={ui.requestId}
                basePath={basePath}
                locale={locale}
                ui={ui}
                randomPinMap={randomPinMap}
                disabled={pinDisabled}
                onSubmit={onSubmitPin}
                onCancel={onCancel}
              />
            ) : ui?.type === 'confirm' && (ui.action === 'btcGetAddress' || ui.action === 'BTCgetAddress' || ui.action === 'get_address') ? (
              <ProAddressOfflineScreen
                key={ui.requestId}
                basePath={basePath}
                locale={locale}
                details={ui.details}
                disabled={confirmDisabled}
                onDone={onConfirm}
              />
            ) : ui?.type === 'confirm' ? (
              <ProTxConfirmScreen
                key={ui.requestId}
                basePath={basePath}
                locale={locale}
                details={ui.details}
                disabled={confirmDisabled}
                onApprove={onConfirm}
                onReject={onReject}
              />
            ) : (
              <>
                {deviceUnlocked ? (
                  <ProHomeScreen basePath={basePath} locale={locale} device={device} busy={busy} />
                ) : (
                  <ProLockScreen
                    basePath={basePath}
                    locale={locale}
                    device={device}
                    disabled={unlockDisabled}
                    onTap={allowUnlock ? onTapToUnlock : undefined}
                  />
                )}
              </>
            )}
          </ProDeviceViewport>
        </div>

        <div className="mt-3 pb-0.5 text-center text-[11px] font-semibold tracking-[0.16em] text-white/70">
          OneKey
        </div>
      </div>
    </div>
  )
}
