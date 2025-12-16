'use client'

import { useMachine } from '@xstate/react'
import gsap from 'gsap'
import { Copy, Send } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createHardwareMockMachine } from './createHardwareMockMachine'
import { ProDeviceScreen } from './pro/ProDeviceScreen'
import { HardwareMockTour } from './tour/HardwareMockTour'
import { hardwareMockTourBus } from './tour/hardwareMockTourBus'

const I18N = {
  zh: {
    status: {
      booting: '初始化 Mock...',
      notReady: 'Mock 未就绪',
      unavailable: 'Mock 不可用',
      canceling: '取消中...',
      sending: '交互中...',
      awaitingPin: '等待输入 PIN...',
      submittingPin: '校验 PIN...',
      awaitingConfirm: '等待确认...',
      submittingConfirm: '确认中...',
      ready: '就绪'
    },
    labels: {
      mock: 'Mock',
      ready: '就绪',
      failed: '失败',
      device: '设备',
      unlocked: '已解锁',
      clearLogs: '清空日志',
      exampleCode: '示例代码',
      currentExample: '当前示例',
      copy: '复制',
      copied: '已复制',
      commandPanel: '交互面板',
      command: '命令',
      sendCommand: '发送命令',
      showOnDevice: 'showOnOneKey（在设备上显示并确认）',
      deviceScreen: '设备屏幕（Mock）',
      deviceUiHint: 'UI：PIN / Confirm',
      terminal: '终端日志',
      noLogs: '暂无日志。试试点击锁屏并输入 PIN，或发送命令触发交互。',
      devViewTitle: '开发者视角',
      devViewSubtitle: '示例代码 · UI 回调 · 结果',
      tabExample: '示例代码',
      tabCallback: '回调处理',
      tabResult: '结果',
      callbackHint: '这里展示真实的 UI_EVENT 接线模板（按你的 UI 框架改成弹窗/表单即可）。',
      noResult: '暂无结果。发送命令后这里会展示返回值。',
      showRawLogs: '查看完整日志',
      noPayload: '无返回数据。'
    },
    deviceUi: {
      disconnected: '未连接设备。点击「连接」开始。',
      pinTitle: '解锁设备',
      pinPrompt: '请输入 PIN 码继续（默认 PIN：1234）',
      pinPlaceholder: '请输入 PIN',
      pinSubmit: '提交',
      confirmTitle: '确认签名',
      confirmPrompt: '请在设备上确认交易',
      approve: '同意',
      reject: '拒绝',
      connectedTitle: '设备已连接',
      connectedHint: '发送 btcSignMessage 触发签名流程。',
      unlockedState: '当前解锁状态'
    }
  },
  en: {
    status: {
      booting: 'Initializing Mock...',
      notReady: 'Mock not ready',
      unavailable: 'Mock unavailable',
      canceling: 'Canceling...',
      sending: 'In progress...',
      awaitingPin: 'Waiting for PIN...',
      submittingPin: 'Verifying PIN...',
      awaitingConfirm: 'Waiting for confirmation...',
      submittingConfirm: 'Confirming...',
      ready: 'Ready'
    },
    labels: {
      mock: 'Mock',
      ready: 'Ready',
      failed: 'Failed',
      device: 'Device',
      unlocked: 'Unlocked',
      clearLogs: 'Clear logs',
      exampleCode: 'Example code',
      currentExample: 'Current example',
      copy: 'Copy',
      copied: 'Copied',
      commandPanel: 'Command panel',
      command: 'Command',
      sendCommand: 'Send',
      showOnDevice: 'showOnOneKey (confirm on device)',
      deviceScreen: 'Device screen (Mock)',
      deviceUiHint: 'UI: PIN / Confirm',
      terminal: 'Terminal logs',
      noLogs: 'No logs yet. Tap the lockscreen or send a command to start.',
      devViewTitle: 'Developer View',
      devViewSubtitle: 'Example code · UI callbacks · Result',
      tabExample: 'Example',
      tabCallback: 'Callbacks',
      tabResult: 'Result',
      callbackHint: 'This shows the real UI_EVENT wiring template (adapt it to your UI framework).',
      noResult: 'No result yet. Send a command to see output.',
      showRawLogs: 'Show raw logs',
      noPayload: 'No payload.'
    },
    deviceUi: {
      disconnected: 'No device connected. Click "Connect" to start.',
      pinTitle: 'Unlock device',
      pinPrompt: 'Enter PIN to continue (default: 1234)',
      pinPlaceholder: 'Enter PIN',
      pinSubmit: 'Submit',
      confirmTitle: 'Confirm signing',
      confirmPrompt: 'Confirm the transaction on the device',
      approve: 'Approve',
      reject: 'Reject',
      connectedTitle: 'Device connected',
      connectedHint: "Send 'btcSignMessage' to trigger signing steps.",
      unlockedState: 'Unlocked'
    }
  }
}

function getDict(locale) {
  return I18N[locale] ?? I18N.zh
}

function formatTime(isoString) {
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return '--:--:--'
  return date.toLocaleTimeString(undefined, { hour12: false })
}

function formatBoolean(locale, value) {
  if ((locale ?? 'zh') === 'en') return value ? 'Yes' : 'No'
  return value ? '是' : '否'
}

function formatJson(data) {
  if (data === undefined) return ''
  try {
    return JSON.stringify(data)
  } catch {
    return String(data)
  }
}

function formatJsonPretty(data) {
  if (data === undefined) return ''
  try {
    return JSON.stringify(data, null, 2)
  } catch {
    return String(data)
  }
}

function getLevelStyle(level) {
  switch (level) {
    case 'request':
      return 'text-[#00B812]'
    case 'response':
      return 'text-zinc-900 dark:text-zinc-100'
    case 'error':
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-zinc-600 dark:text-zinc-400'
  }
}

function buildExampleCode({ command, btcPath, addressShowOnOneKey, messageHex, useEmptyDevice }) {
  const init = [
    "import HardwareSDK from '@onekeyfe/hd-common-connect-sdk'",
    '',
    "await HardwareSDK.init({ env: 'webusb', fetchConfig: true, debug: false })",
    ''
  ]

  if (command === 'searchDevices') {
    return [...init, 'const result = await HardwareSDK.searchDevices()', 'console.log(result)'].join('\n')
  }

  const shared = [
    ...init,
    'const devices = await HardwareSDK.searchDevices()',
    'if (!devices.success) throw new Error(devices.payload.error)',
    'const connectId = devices.payload?.[0]?.connectId',
    '',
    'const features = await HardwareSDK.getFeatures(connectId)',
    'if (!features.success) throw new Error(features.payload.error)',
    'const deviceId = features.payload?.device_id',
    ''
  ]

  if (command === 'btcGetAddress') {
    return [
      ...shared,
      'const result = await HardwareSDK.btcGetAddress(connectId, deviceId, {',
      `  path: ${JSON.stringify(btcPath)},`,
      "  coin: 'btc',",
      `  showOnOneKey: ${String(Boolean(addressShowOnOneKey))},`,
      `  useEmptyDevice: ${String(Boolean(useEmptyDevice))},`,
      '})',
      'console.log(result)'
    ].join('\n')
  }

  return [
    ...shared,
    'const result = await HardwareSDK.btcSignMessage(connectId, deviceId, {',
    `  path: ${JSON.stringify(btcPath)},`,
    `  messageHex: ${JSON.stringify(messageHex)},`,
    "  coin: 'btc',",
    `  useEmptyDevice: ${String(Boolean(useEmptyDevice))},`,
    '})',
    'console.log(result)'
  ].join('\n')
}

export function HardwareMockDemo({ locale = 'zh' }) {
  const dict = useMemo(() => getDict(locale), [locale])

  const basePath = useMemo(() => {
    return (process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, '') || '').trim()
  }, [])

  const machine = useMemo(() => createHardwareMockMachine({ basePath }), [basePath])
  const [state, send] = useMachine(machine)

  const logsRef = useRef(null)
  const deviceRef = useRef(null)
  const codeRef = useRef(null)
  const callbackCodeRef = useRef(null)
  const resultCodeRef = useRef(null)
  const lastSentRef = useRef({ command: null, params: null })

  const [command, setCommand] = useState('btcGetAddress')
  const [btcPath, setBtcPath] = useState("m/44'/0'/0'/0/0")
  const [addressShowOnOneKey, setAddressShowOnOneKey] = useState(true)
  const [useEmptyDevice, setUseEmptyDevice] = useState(false)
  const [messageHex, setMessageHex] = useState('6578616d706c65206d657373616765')
  const [copied, setCopied] = useState(false)
  const [tourEnabled, setTourEnabled] = useState(false)
  const tourEnabledRef = useRef(false)
  const handleTourExit = useCallback(() => setTourEnabled(false), [])
  const [rightTab, setRightTab] = useState('example')

  const logs = state.context.logs
  const ui = state.context.ui

  const isBusy =
    state.matches('booting') ||
    state.matches('sending') ||
    state.matches('submittingPin') ||
    state.matches('submittingConfirm') ||
    state.matches('canceling')

  const isAwaitingUi =
    state.matches('awaitingPin') ||
    state.matches('submittingPin') ||
    state.matches('awaitingConfirm') ||
    state.matches('submittingConfirm') ||
    state.matches('canceling')

  const mockReady = state.context.mockReady
  const mockError = state.context.mockError
  const lastError = state.context.lastError
  const deviceUnlocked = Boolean(state.context.device?.unlocked)

  const code = useMemo(
    () => buildExampleCode({ command, btcPath, addressShowOnOneKey, messageHex, useEmptyDevice }),
    [command, btcPath, addressShowOnOneKey, messageHex, useEmptyDevice]
  )

  useEffect(() => {
    tourEnabledRef.current = Boolean(tourEnabled)
  }, [tourEnabled])

  useEffect(() => {
    const off = hardwareMockTourBus.on('tour.focus', (payload) => {
      if (!tourEnabledRef.current) return
      const tab = payload?.tab
      if (tab === 'example' || tab === 'callback' || tab === 'result') {
        setRightTab(tab)
      }
    })
    return off
  }, [])

  const callbackCode = useMemo(() => {
    const isEn = locale === 'en'
    if (command !== 'btcGetAddress' || !addressShowOnOneKey) {
      return isEn
        ? `// UI callbacks (template)\n// Tip: When showOnOneKey=false, there is usually no interactive UI.\n// You can focus on parsing the result and updating your app state.\n`
        : `// UI 回调（模板）\n// 提示：showOnOneKey=false 时通常不会触发需要你响应的交互事件。\n// 你可以把重点放在解析返回值，并更新业务 UI/状态。\n`
    }

    return isEn
      ? `import HardwareSDK, { UI_EVENT, UI_REQUEST, UI_RESPONSE } from '@onekeyfe/hd-common-connect-sdk'\n\n// Subscribe once at app startup (subscribe early to avoid blocking on PIN/Passphrase)\nHardwareSDK.on(UI_EVENT, (msg) => {\n  switch (msg.type) {\n    case UI_REQUEST.REQUEST_PIN: {\n      // Show a PIN modal (mock default PIN: 1234)\n      openPinModal(({ value }) =>\n        HardwareSDK.uiResponse({ type: UI_RESPONSE.RECEIVE_PIN, payload: value })\n      )\n      return\n    }\n\n    case UI_REQUEST.REQUEST_PASSPHRASE: {\n      openPassphraseModal(({ value, onDevice, save }) =>\n        HardwareSDK.uiResponse({\n          type: UI_RESPONSE.RECEIVE_PASSPHRASE,\n          payload: { value, passphraseOnDevice: onDevice, attachPinOnDevice: false, save },\n        })\n      )\n      return\n    }\n\n    // Hint-only events: e.g. REQUEST_BUTTON (confirm on device)\n    default:\n      console.log('UI event', msg.type, msg.payload)\n  }\n})\n\n// When you call btcGetAddress({ showOnOneKey: true }),\n// the SDK emits UI_EVENT messages. Your UI should react to those and call uiResponse\n// only for input-type requests.\n`
      : `import HardwareSDK, { UI_EVENT, UI_REQUEST, UI_RESPONSE } from '@onekeyfe/hd-common-connect-sdk'\n\n// 在应用入口订阅一次（尽早订阅，避免 PIN/Passphrase 等交互阻塞请求）\nHardwareSDK.on(UI_EVENT, (msg) => {\n  switch (msg.type) {\n    case UI_REQUEST.REQUEST_PIN: {\n      // 打开 PIN 输入 UI（本 Mock 默认 PIN：1234）\n      openPinModal(({ value }) =>\n        HardwareSDK.uiResponse({ type: UI_RESPONSE.RECEIVE_PIN, payload: value })\n      )\n      return\n    }\n\n    case UI_REQUEST.REQUEST_PASSPHRASE: {\n      openPassphraseModal(({ value, onDevice, save }) =>\n        HardwareSDK.uiResponse({\n          type: UI_RESPONSE.RECEIVE_PASSPHRASE,\n          payload: { value, passphraseOnDevice: onDevice, attachPinOnDevice: false, save },\n        })\n      )\n      return\n    }\n\n    // 仅提示类事件：比如 REQUEST_BUTTON（请在设备确认）\n    default:\n      console.log('UI event', msg.type, msg.payload)\n  }\n})\n\n// 当你调用 btcGetAddress({ showOnOneKey: true }) 时\n// SDK 会通过 UI_EVENT 发出交互提示，你需要在 UI 层响应并调用 uiResponse（仅限需要输入的请求）。\n`
  }, [addressShowOnOneKey, command, locale])

  useEffect(() => {
    if (!tourEnabled) return
    const connectId = state.context.device?.connectId ?? null
    const deviceId = state.context.device?.deviceId ?? null

    const params =
      command === 'btcGetAddress'
        ? { connectId, deviceId, path: btcPath, coin: 'btc', showOnOneKey: addressShowOnOneKey, useEmptyDevice }
        : command === 'btcSignMessage'
          ? { connectId, deviceId, path: btcPath, coin: 'btc', messageHex, useEmptyDevice }
          : command === 'searchDevices'
            ? undefined
            : undefined

    hardwareMockTourBus.emit('code.updated', { command, params, code })
  }, [tourEnabled, command, btcPath, addressShowOnOneKey, messageHex, useEmptyDevice, code, state.context.device])

  useEffect(() => {
    if (!tourEnabled) return
    if (!ui?.type) return
    hardwareMockTourBus.emit('ui.shown', { uiType: ui.type, action: ui?.action ?? null })
  }, [tourEnabled, ui?.type, ui?.action])

  useEffect(() => {
    const el = deviceRef.current
    if (!el) return

    gsap.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power1.out' })
  }, [ui?.type, mockReady])

  // 结果/日志区域不再逐行滚动动画；保留核心交互区域的轻量动画即可。

  useEffect(() => {
    if (!tourEnabled) return
    const last = logs[logs.length - 1]
    if (!last) return
    if (last.level !== 'response' && last.level !== 'error') return

    // 交互式流程里，第一次 response 往往只是返回 ui（PIN/Confirm），不应当被当成“最终结果”推进导览。
    // 只有当响应里不再包含 ui（即真正的 payload/result）时，才发出 command.result。
    if (last.level === 'response' && last?.data && typeof last.data === 'object' && 'ui' in last.data) {
      return
    }

    const sent = lastSentRef.current ?? { command: null, params: null }
    hardwareMockTourBus.emit('command.result', { command: sent.command, params: sent.params, log: last })
  }, [tourEnabled, logs])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    let cancelled = false
    async function highlight() {
      try {
        const prismModule = await import('prismjs')
        await import('prismjs/components/prism-typescript')
        await import('prismjs/components/prism-json')
        const Prism = prismModule?.default ?? prismModule
        if (cancelled) return
        if (codeRef.current) Prism.highlightElement(codeRef.current)
        if (callbackCodeRef.current) Prism.highlightElement(callbackCodeRef.current)
        if (resultCodeRef.current) Prism.highlightElement(resultCodeRef.current)
      } catch {
        // ignore highlight errors
      }
    }
    highlight()
    return () => {
      cancelled = true
    }
  }, [code, callbackCode, rightTab, logs.length])

  function handleSendCommand() {
    const connectId = state.context.device?.connectId ?? null
    const deviceId = state.context.device?.deviceId ?? null

    const params =
      command === 'btcGetAddress'
        ? { connectId, deviceId, path: btcPath, coin: 'btc', showOnOneKey: addressShowOnOneKey, useEmptyDevice }
        : command === 'btcSignMessage'
          ? { connectId, deviceId, path: btcPath, coin: 'btc', messageHex, useEmptyDevice }
          : undefined

    lastSentRef.current = { command, params }
    if (tourEnabledRef.current) {
      hardwareMockTourBus.emit('command.sent', { command, params })
    }
    send({ type: 'SEND', command, params })
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
      if (tourEnabled) {
        hardwareMockTourBus.emit('code.copied', { command })
      }
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="not-prose my-4 overflow-x-hidden">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <HardwareMockTour locale={locale} enabled={tourEnabled} onExit={handleTourExit} />

        {(mockError || lastError) && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
            {mockError ? `${locale === 'en' ? 'Mock error' : 'Mock 错误'}：${mockError}` : null}
            {mockError && lastError ? ' · ' : null}
            {lastError ? `${locale === 'en' ? 'Error' : '最近错误'}：${lastError}` : null}
          </div>
        )}

        <div className="mt-2 grid gap-4 lg:grid-cols-[minmax(300px,380px)_minmax(0,1fr)] lg:items-stretch">
          <div className="flex h-full flex-col gap-3">
            <div className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{dict.labels.deviceScreen}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">{dict.labels.deviceUiHint}</div>
              </div>

              <div ref={deviceRef} className="mt-3 flex justify-center" data-tour="device-screen">
                <ProDeviceScreen
                  basePath={basePath}
                  locale={locale}
                  busy={isBusy}
                  device={state.context.device}
                  ui={ui}
                  onSubmitPin={(pinValue) => {
                    if (tourEnabled) {
                      hardwareMockTourBus.emit('ui.pin.submit', { pinLength: String(pinValue ?? '').length })
                    }
                    send({ type: 'SUBMIT_PIN', pin: pinValue })
                  }}
                  onConfirm={() => {
                    if (tourEnabled) {
                      hardwareMockTourBus.emit('ui.confirm', { action: ui?.action ?? null, approved: true })
                    }
                    send({ type: 'CONFIRM', approved: true })
                  }}
                  onReject={() => {
                    if (tourEnabled) {
                      hardwareMockTourBus.emit('ui.confirm', { action: ui?.action ?? null, approved: false })
                    }
                    send({ type: 'CONFIRM', approved: false })
                  }}
                  onCancel={() => send({ type: 'CANCEL' })}
                  onTapToUnlock={() => {
                    if (!mockReady || isBusy || isAwaitingUi) return
                    if (tourEnabled) {
                      hardwareMockTourBus.emit('ui.unlock.tap', {})
                    }
                    send({ type: 'SEND', command: 'deviceUnlock', params: { connectId: state.context.device?.connectId ?? null } })
                  }}
                />
              </div>
            </div>

            <div className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{dict.labels.commandPanel}</div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !tourEnabledRef.current
                      tourEnabledRef.current = next
                      setTourEnabled(next)
                    }}
                    className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
                  >
                    {locale === 'en' ? (tourEnabled ? 'Tour: On' : 'Tour: Off') : tourEnabled ? '导览：已开启' : '导览：已关闭'}
                  </button>
                </div>

              <div className="mt-3 space-y-3">
                <div className="grid gap-2 lg:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      {dict.labels.command}
                    </label>
                    <select
                      data-tour="command-select"
                      value={command}
                      onChange={(e) => {
                        const nextCommand = e.target.value
                        setCommand(nextCommand)
                        if (tourEnabled) {
                          hardwareMockTourBus.emit('command.changed', { command: nextCommand })
                        }
                      }}
                      disabled={!mockReady || isBusy || isAwaitingUi}
                      className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition-colors focus:border-[#00B812] dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                    >
                      <option value="searchDevices">searchDevices</option>
                      <option value="btcGetAddress">btcGetAddress</option>
                      <option value="btcSignMessage">btcSignMessage</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Path</label>
                    <input
                      value={btcPath}
                      onChange={(e) => setBtcPath(e.target.value)}
                      disabled={command === 'searchDevices' || !mockReady || isBusy || isAwaitingUi}
                      className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition-colors focus:border-[#00B812] dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 disabled:bg-zinc-100 disabled:text-zinc-400 dark:disabled:bg-zinc-900 dark:disabled:text-zinc-600"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <label data-tour="show-on-onekey" className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                    <input
                      type="checkbox"
                      checked={addressShowOnOneKey}
                      onChange={(e) => {
                        const next = e.target.checked
                        setAddressShowOnOneKey(next)
                        if (tourEnabled) {
                          hardwareMockTourBus.emit('param.changed', { key: 'showOnOneKey', value: next })
                        }
                      }}
                      disabled={command !== 'btcGetAddress' || !mockReady || isBusy || isAwaitingUi}
                      className="h-4 w-4 rounded border-zinc-300 text-[#00B812] focus:ring-[#00B812] disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700"
                    />
                    {dict.labels.showOnDevice}
                  </label>

                  <label className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                    <input
                      type="checkbox"
                      checked={useEmptyDevice}
                      onChange={(e) => setUseEmptyDevice(e.target.checked)}
                      disabled={!mockReady || isBusy || isAwaitingUi}
                      className="h-4 w-4 rounded border-zinc-300 text-[#00B812] focus:ring-[#00B812] disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700"
                    />
                    {locale === 'en' ? 'useEmptyDevice (mock)' : 'useEmptyDevice（Mock）'}
                  </label>
                </div>

                {command === 'btcSignMessage' && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">messageHex</label>
                    <textarea
                      value={messageHex}
                      onChange={(e) => setMessageHex(e.target.value)}
                      disabled={!mockReady || isBusy || isAwaitingUi}
                      rows={3}
                      className="w-full resize-none rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition-colors focus:border-[#00B812] dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSendCommand}
                  disabled={!mockReady || isBusy || isAwaitingUi}
                  data-tour="send-button"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                >
                  <Send size={16} strokeWidth={1.8} />
                  {dict.labels.sendCommand}
                </button>
              </div>
            </div>
          </div>

          <div className="flex h-full flex-col">
            <div className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{dict.labels.devViewTitle}</div>
                  <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{dict.labels.devViewSubtitle}</div>
                </div>
                <div className="inline-flex rounded-md border border-zinc-200 bg-white p-0.5 text-xs dark:border-zinc-800 dark:bg-zinc-950">
                  {[
                    { key: 'example', label: dict.labels.tabExample },
                    { key: 'callback', label: dict.labels.tabCallback },
                    { key: 'result', label: dict.labels.tabResult }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setRightTab(tab.key)}
                      className={[
                        'rounded px-2.5 py-1 font-medium transition-colors',
                        rightTab === tab.key
                          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                          : 'text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-900'
                      ].join(' ')}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {rightTab === 'example' ? (
                <>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {dict.labels.currentExample}：<span className="font-mono text-zinc-700 dark:text-zinc-300">{command}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
                    >
                      <Copy size={14} strokeWidth={1.8} />
                      {copied ? dict.labels.copied : dict.labels.copy}
                    </button>
                  </div>

                  <pre className="mt-2 max-h-[520px] overflow-auto rounded-lg border border-zinc-200 bg-white p-3 font-mono text-xs leading-relaxed text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
                    <code ref={codeRef} data-tour="example-code" className="language-ts">
                      {code}
                    </code>
                  </pre>
                </>
              ) : null}

              {rightTab === 'callback' ? (
                <>
                  <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">{dict.labels.callbackHint}</div>
                  <pre className="mt-2 max-h-[560px] overflow-auto rounded-lg border border-zinc-200 bg-white p-3 font-mono text-[11px] leading-relaxed text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
                    <code ref={callbackCodeRef} data-tour="callback-code" className="language-ts">
                      {callbackCode}
                    </code>
                  </pre>
                </>
              ) : null}

              {rightTab === 'result' ? (
                (() => {
                  const last = [...logs].reverse().find((item) => item.level === 'response' || item.level === 'error') ?? null
                  return (
                    <div className="mt-3">
                      {!last ? (
                        <div className="rounded-lg border border-zinc-200 bg-white p-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-500">
                          {dict.labels.noResult}
                        </div>
                      ) : (
                        <>
                          <div className="font-mono text-xs">
                            <span className="text-zinc-500 dark:text-zinc-500">[{formatTime(last.ts)}]</span>{' '}
                            <span className={getLevelStyle(last.level)}>{last.title}</span>
                          </div>

                          <div
                            ref={logsRef}
                            data-tour="result-panel"
                            className="mt-2 overflow-auto rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950"
                          >
                            {last.data !== undefined ? (
                              <pre className="m-0 font-mono text-[11px] leading-relaxed text-zinc-900 dark:text-zinc-100">
                                <code ref={resultCodeRef} className="language-json">
                                  {formatJsonPretty(last.data)}
                                </code>
                              </pre>
                            ) : (
                              <div className="text-xs text-zinc-500 dark:text-zinc-500">{dict.labels.noPayload}</div>
                            )}
                          </div>

                          <details className="mt-2">
                            <summary className="cursor-pointer select-none text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
                              {dict.labels.showRawLogs}
                            </summary>
                            <div className="mt-2 space-y-1 font-mono text-[11px] text-zinc-700 dark:text-zinc-200">
                              {logs.map((item) => (
                                <div key={item.id}>
                                  <span className="text-zinc-500 dark:text-zinc-500">[{formatTime(item.ts)}]</span>{' '}
                                  <span className={getLevelStyle(item.level)}>{item.title}</span>
                                  {item.data !== undefined ? (
                                    <span className="text-zinc-500 dark:text-zinc-400"> {formatJson(item.data)}</span>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          </details>
                        </>
                      )}
                    </div>
                  )
                })()
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
