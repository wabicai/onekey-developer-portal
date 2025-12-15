'use client'

import { useMachine } from '@xstate/react'
import gsap from 'gsap'
import { Copy, Send, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createHardwareMockMachine } from './createHardwareMockMachine'
import { ProDeviceScreen } from './pro/ProDeviceScreen'

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
      noLogs: '暂无日志。试试点击锁屏并输入 PIN，或发送命令触发交互。'
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
      noLogs: 'No logs yet. Tap the lockscreen or send a command to start.'
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

  const [command, setCommand] = useState('btcGetAddress')
  const [btcPath, setBtcPath] = useState("m/44'/0'/0'/0/0")
  const [addressShowOnOneKey, setAddressShowOnOneKey] = useState(true)
  const [useEmptyDevice, setUseEmptyDevice] = useState(false)
  const [messageHex, setMessageHex] = useState('6578616d706c65206d657373616765')
  const [copied, setCopied] = useState(false)

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
    const el = deviceRef.current
    if (!el) return

    gsap.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power1.out' })
  }, [ui?.type, mockReady])

  useEffect(() => {
    const container = logsRef.current
    if (!container) return

    const lastLine = container.lastElementChild
    if (!lastLine) return

    gsap.fromTo(lastLine, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.18, ease: 'power1.out' })
  }, [logs.length])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    let cancelled = false
    async function highlight() {
      try {
        const prismModule = await import('prismjs')
        await import('prismjs/components/prism-typescript')
        const Prism = prismModule?.default ?? prismModule
        if (cancelled) return
        if (codeRef.current) {
          Prism.highlightElement(codeRef.current)
        }
      } catch {
        // ignore highlight errors
      }
    }
    highlight()
    return () => {
      cancelled = true
    }
  }, [code])

  function handleSendCommand() {
    const connectId = state.context.device?.connectId ?? null
    const deviceId = state.context.device?.deviceId ?? null

    const params =
      command === 'btcGetAddress'
        ? { connectId, deviceId, path: btcPath, coin: 'btc', showOnOneKey: addressShowOnOneKey, useEmptyDevice }
        : command === 'btcSignMessage'
          ? { connectId, deviceId, path: btcPath, coin: 'btc', messageHex, useEmptyDevice }
          : undefined

    send({ type: 'SEND', command, params })
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="not-prose my-4 overflow-x-hidden">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">

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

              <div ref={deviceRef} className="mt-3 flex justify-center">
                <ProDeviceScreen
                  basePath={basePath}
                  locale={locale}
                  busy={isBusy}
                  device={state.context.device}
                  ui={ui}
                  onSubmitPin={(pinValue) => send({ type: 'SUBMIT_PIN', pin: pinValue })}
                  onConfirm={() => send({ type: 'CONFIRM', approved: true })}
                  onReject={() => send({ type: 'CONFIRM', approved: false })}
                  onCancel={() => send({ type: 'CANCEL' })}
                  onTapToUnlock={() => {
                    if (!mockReady || isBusy || isAwaitingUi) return
                    send({ type: 'SEND', command: 'deviceUnlock', params: { connectId: state.context.device?.connectId ?? null } })
                  }}
                />
              </div>
            </div>

            <div className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{dict.labels.commandPanel}</div>

              <div className="mt-3 space-y-3">
                <div className="grid gap-2 lg:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      {dict.labels.command}
                    </label>
                    <select
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
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
                  <label className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                    <input
                      type="checkbox"
                      checked={addressShowOnOneKey}
                      onChange={(e) => setAddressShowOnOneKey(e.target.checked)}
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
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                >
                  <Send size={16} strokeWidth={1.8} />
                  {dict.labels.sendCommand}
                </button>
              </div>
            </div>
          </div>

          <div className="flex h-full flex-col gap-4">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{dict.labels.exampleCode}</div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
                >
                  <Copy size={14} strokeWidth={1.8} />
                  {copied ? dict.labels.copied : dict.labels.copy}
                </button>
              </div>
              <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {dict.labels.currentExample}：
                <span className="font-mono text-zinc-700 dark:text-zinc-300"> {command}</span>
              </div>

              <pre className="mt-2 max-h-[240px] overflow-auto rounded-lg border border-zinc-200 bg-white p-3 font-mono text-xs leading-relaxed text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
                <code ref={codeRef} className="language-ts">
                  {code}
                </code>
              </pre>
            </div>

            <div className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{dict.labels.terminal}</div>
                <button
                  type="button"
                  onClick={() => send({ type: 'CLEAR_LOGS' })}
                  className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-900 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
                >
                  <Trash2 size={14} strokeWidth={1.8} />
                  {dict.labels.clearLogs}
                </button>
              </div>

              <div
                ref={logsRef}
                className="mt-3 flex-1 overflow-auto rounded-lg border border-zinc-200 bg-white p-3 font-mono text-xs leading-relaxed text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
              >
                {logs.length === 0 ? (
                  <div className="text-zinc-500 dark:text-zinc-500">{dict.labels.noLogs}</div>
                ) : (
                  logs.map((item) => (
                    <div key={item.id} className="py-0.5">
                      <span className="text-zinc-500 dark:text-zinc-500">[{formatTime(item.ts)}]</span>{' '}
                      <span className={getLevelStyle(item.level)}>{item.title}</span>
                      {item.data !== undefined ? (
                        <span className="text-zinc-500 dark:text-zinc-400"> {formatJson(item.data)}</span>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
