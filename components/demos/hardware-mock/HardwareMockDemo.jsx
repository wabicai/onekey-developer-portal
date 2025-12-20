'use client'

import { useMachine } from '@xstate/react'
import gsap from 'gsap'
import { Check, ChevronDown, Copy, Delete, ExternalLink, Info, Send, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { createHardwareMockMachine } from './createHardwareMockMachine'
import { EditorCodeBlock } from './EditorCodeBlock'
import { ProDeviceScreen } from './pro/ProDeviceScreen'
import { Classic1sDeviceScreen } from './classic1s/Classic1sDeviceScreen'
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
      terminal: '终端日志',
      noLogs: '暂无日志。试试先解锁设备并输入 PIN，或发送命令触发交互。',
      demoNotice: 'Mock 演示（不连接真实硬件）',
      pinNote: 'PIN：任意 4 位（Mock 不校验）',
      openEmulator: '打开 OneKey Emulator',
      devViewTitle: '开发者视角',
      tabExample: '示例代码',
      tabCallback: '回调处理',
      tabResult: '结果',
      noResult: '暂无结果。发送命令后这里会展示返回值。',
      showRawLogs: '查看完整日志',
      noPayload: '无返回数据。'
    },
    tour: {
      idleTitle: '导览提示',
      idlePrimary: '点击「导览」并发送第一个命令，体验交互流程。',
      idleSecondary: '也可以先预览右侧的示例与回调模板。',
      actionTitle: '操作指引',
      reviewTitle: '结果预览',
      sendPrimary: '选择命令/参数后点击「发送命令」。',
      sendSecondary: '结果会在右侧 Result 面板出现。',
      pinPrimary: '在设备或弹窗输入任意 4 位 PIN。',
      pinSecondary: '提交后导览会自动推进。',
      confirmPrimary: '在设备上确认交互。',
      confirmSecondary: '等待结果自动返回。',
      waitResultPrimary: '等待结果自动呈现。',
      waitResultSecondary: '可在 Result 面板中查看 payload。',
      resultPrimary: '结果已准备好，从右侧阅读 payload。',
      resultSecondary: '若需要，切换到 Callbacks 查阅 UI_EVENT。',
      callbackPrimary: '回调模板在右侧，复盘 UI_EVENT。',
      callbackSecondary: '参考 `REQUEST_*` 事件处理流程。'
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
      terminal: 'Terminal logs',
      noLogs: 'No logs yet. Try unlocking the device or send a command to start.',
      demoNotice: 'Mock demo (no real hardware)',
      pinNote: 'PIN: any 4 digits (not validated)',
      openEmulator: 'Open OneKey Emulator',
      devViewTitle: 'Developer View',
      tabExample: 'Example',
      tabCallback: 'Callbacks',
      tabResult: 'Result',
      noResult: 'No result yet. Send a command to see output.',
      showRawLogs: 'Show raw logs',
      noPayload: 'No payload.'
    },
    tour: {
      idleTitle: 'Tour hint',
      idlePrimary: 'Enable the tour and send your first command to start the flow.',
      idleSecondary: 'Or skim the example and callbacks on the right to preview the SDK.',
      actionTitle: 'Action hint',
      reviewTitle: 'Review hint',
      sendPrimary: 'Select command/params and tap “Send”.',
      sendSecondary: 'Result shows up in the Result panel on the right.',
      pinPrimary: 'Enter any 4-digit PIN on the device (or dialog).',
      pinSecondary: 'Submitting advances the tour automatically.',
      confirmPrimary: 'Confirm the interaction on the device.',
      confirmSecondary: 'Wait for the result to appear in the Result tab.',
      waitResultPrimary: 'Waiting for the result to arrive.',
      waitResultSecondary: 'Result output appears on the right.',
      resultPrimary: 'Payload is ready—review it on the right.',
      resultSecondary: 'Switch to Callbacks if you need UI_EVENT guidance.',
      callbackPrimary: 'Callback template lives on the right.',
      callbackSecondary: 'Handle the REQUEST_* events based on UI hints.'
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

function findLineNumber(text, includes) {
  if (!text) return null
  const lines = String(text).split('\n')
  const idx = lines.findIndex((line) => line.includes(includes))
  return idx >= 0 ? idx + 1 : null
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

const TOUR_HINT_ACCENTS = {
  action: '#00B812',
  review: '#2563eb',
  idle: '#64748b'
}

function buildTourHintPayload({ locale, dict, stepId, tourEnabled, tourStarted }) {
  const isEn = locale === 'en'
  const tourDict = dict?.tour ?? {}
  const safeString = (key, fallback) => (tourDict[key] ?? fallback)

  const defaultActionTitle = isEn ? 'Action hint' : '操作指引'
  const defaultReviewTitle = isEn ? 'Review hint' : '结果预览'
  const defaultSendPrimary = isEn ? 'Select command/params and tap “Send”.' : '选择命令/参数后点击「发送命令」。'
  const defaultSendSecondary = isEn ? 'Result shows up in the Result panel on the right.' : '结果会在右侧 Result 面板出现。'
  const defaultIdlePrimary = isEn ? 'Enable the tour and send your first command to start the flow.' : '点击「导览」并发送第一个命令，体验交互流程。'
  const defaultIdleSecondary = isEn ? 'Or skim the example and callbacks on the right to preview the SDK.' : '也可以先预览右侧的示例与回调模板。'

  if (!tourEnabled || !tourStarted) {
    return {
      type: 'idle',
      accent: TOUR_HINT_ACCENTS.idle,
      title: safeString('idleTitle', isEn ? 'Tour hint' : '导览提示'),
      primary: safeString('idlePrimary', defaultIdlePrimary),
      secondary: safeString('idleSecondary', defaultIdleSecondary)
    }
  }

  const actionBase = {
    type: 'action',
    accent: TOUR_HINT_ACCENTS.action,
    title: safeString('actionTitle', defaultActionTitle),
    primary: safeString('sendPrimary', defaultSendPrimary),
    secondary: safeString('sendSecondary', defaultSendSecondary)
  }
  const reviewBase = {
    type: 'review',
    accent: TOUR_HINT_ACCENTS.review,
    title: safeString('reviewTitle', defaultReviewTitle)
  }

  switch (stepId) {
    case 'waiting-start':
    case 'example-code':
      return actionBase
    case 'pin-matrix-and-modal':
    case 'pin':
      return {
        ...actionBase,
        primary: safeString('pinPrimary', isEn ? 'Enter any 4-digit PIN on the device (or dialog).' : '在设备或弹窗输入任意 4 位 PIN。'),
        secondary: safeString('pinSecondary', isEn ? 'Submitting advances the tour automatically.' : '提交后导览会自动推进。')
      }
    case 'callback-request-button':
    case 'confirm':
      return {
        ...actionBase,
        primary: safeString('confirmPrimary', isEn ? 'Confirm the interaction on the device.' : '在设备上确认交互。'),
        secondary: safeString('confirmSecondary', isEn ? 'Wait for the result to appear in the Result tab.' : '等待结果自动返回。')
      }
    case 'wait-result':
      return {
        ...reviewBase,
        primary: safeString('waitResultPrimary', isEn ? 'Waiting for the result to arrive.' : '等待结果自动呈现。'),
        secondary: safeString('waitResultSecondary', isEn ? 'Result output appears on the right.' : '可在 Result 面板中查看 payload。')
      }
    case 'result':
      return {
        ...reviewBase,
        primary: safeString('resultPrimary', isEn ? 'Payload is ready—review it on the right.' : '结果已准备好，从右侧阅读 payload。'),
        secondary: safeString('resultSecondary', isEn ? 'Switch to Callbacks if you need UI_EVENT guidance.' : '若需要，切换到 Callbacks 查阅 UI_EVENT。')
      }
    case 'callback-code':
      return {
        ...reviewBase,
        primary: safeString('callbackPrimary', isEn ? 'Callback template lives on the right.' : '回调模板在右侧，复盘 UI_EVENT。'),
        secondary: safeString('callbackSecondary', isEn ? 'Handle the REQUEST_* events based on UI hints.' : '参考 `REQUEST_*` 事件处理流程。')
      }
    default:
      return actionBase
  }
}

function TourHintCard({ hint, locale }) {
  const accent = hint?.accent ?? TOUR_HINT_ACCENTS.action
  const title = hint?.title ?? (locale === 'en' ? 'Tour hint' : '导览提示')
  const typeLabel =
    locale === 'en'
      ? hint?.type === 'review'
        ? 'Review'
        : 'Action'
      : hint?.type === 'review'
        ? '结果'
        : '操作'

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 px-4 py-3 text-sm text-zinc-900 shadow-sm transition-transform duration-150 hover:-translate-y-[1px] dark:border-zinc-800/60 dark:bg-zinc-950/40 dark:text-zinc-100"
      style={{ borderColor: accent }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 rotate-45 border-l-2 border-t-2 lg:block animate-pulse"
        style={{ borderColor: accent }}
      />

      <div className="flex items-center justify-between gap-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{title}</div>
        <span
          className="rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: `color-mix(in srgb, ${accent} 40%, #fff 60%)`,
            color: accent
          }}
        >
          {typeLabel}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{hint?.primary ?? ''}</p>
      {hint?.secondary ? (
        <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">{hint.secondary}</p>
      ) : null}
    </div>
  )
}

function buildExampleCode({ locale, command, btcPath, addressShowOnOneKey, messageHex }) {
  const init = [
    "import HardwareSDK from '@onekeyfe/hd-common-connect-sdk'",
    '',
    'await HardwareSDK.init({',
    "  env: 'webusb',",
    '  fetchConfig: true,',
    '  debug: false,',
    '})',
    ''
  ]

  if (command === 'searchDevices') {
    return [
      ...init,
      'const res = await HardwareSDK.searchDevices()',
      'if (!res.success) throw new Error(res.payload.error)',
      '',
      'console.log(res.payload)'
    ].join('\n')
  }

  const shared = [
    ...init,
    'const devicesRes = await HardwareSDK.searchDevices()',
    'if (!devicesRes.success) throw new Error(devicesRes.payload.error)',
    'const connectId = devicesRes.payload[0].connectId',
    '',
    'const featuresRes = await HardwareSDK.getFeatures(connectId)',
    'if (!featuresRes.success) throw new Error(featuresRes.payload.error)',
    'const deviceId = featuresRes.payload.device_id',
    ''
  ]

  if (command === 'btcGetAddress') {
    return [
      ...shared,
      'const res = await HardwareSDK.btcGetAddress(connectId, deviceId, {',
      `  path: ${JSON.stringify(btcPath)},`,
      "  coin: 'btc',",
      `  showOnOneKey: ${String(Boolean(addressShowOnOneKey))},`,
      '})',
      'if (!res.success) throw new Error(res.payload.error)',
      '',
      'console.log(res.payload)'
    ].join('\n')
  }

  return [
    ...shared,
    'const res = await HardwareSDK.btcSignMessage(connectId, deviceId, {',
    `  path: ${JSON.stringify(btcPath)},`,
    `  messageHex: ${JSON.stringify(messageHex)},`,
    "  coin: 'btc',",
    '})',
    'if (!res.success) throw new Error(res.payload.error)',
    '',
    'console.log(res.payload)'
  ].join('\n')
}

function createSeededRng(seed) {
  let state = 2166136261
  const s = String(seed ?? '')
  for (let i = 0; i < s.length; i += 1) {
    state ^= s.charCodeAt(i)
    state = Math.imul(state, 16777619)
  }
  return () => {
    state = Math.imul(1664525, state) + 1013904223
    return ((state >>> 0) % 1_000_000) / 1_000_000
  }
}

function seededShuffle(items, seed) {
  const rng = createSeededRng(seed)
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function buildClassicPinLayout(seed) {
  const digits = seededShuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], seed)
  return digits.slice(0, 10)
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
  const lastSentRef = useRef({ command: null, params: null })
  const deviceTypeRef = useRef('pro')
  const uiTypeRef = useRef(null)
  const classicPinEntryOnDeviceRef = useRef(false)

  const [command, setCommand] = useState('btcGetAddress')
  const [btcPath, setBtcPath] = useState("m/44'/0'/0'/0/0")
  const [addressShowOnOneKey, setAddressShowOnOneKey] = useState(true)
  const [messageHex, setMessageHex] = useState('6578616d706c65206d657373616765')
  const [deviceTypeControl, setDeviceTypeControl] = useState('pro')
  const [classicPinModalOpen, setClassicPinModalOpen] = useState(false)
  const [classicPinValue, setClassicPinValue] = useState('')
  const [classicPinEntryOnDevice, setClassicPinEntryOnDevice] = useState(false)
  const pinOriginRef = useRef(null) // manual | command | null
  const [copied, setCopied] = useState(false)
  const [tourEnabled, setTourEnabled] = useState(true)
  const tourEnabledRef = useRef(true)
  const handleTourExit = useCallback(() => setTourEnabled(false), [])
  const [tourStarted, setTourStarted] = useState(false)
  const tourStartedRef = useRef(false)
  const [currentTourStepId, setCurrentTourStepId] = useState(null)
  const [rightTab, setRightTab] = useState('example')
  const [editorFocus, setEditorFocus] = useState({ tab: 'example', activeLine: null })
  const currentTourStepIdRef = useRef(null)
  const preferredCallbackLineRef = useRef(null)
  const [tourHint, setTourHint] = useState(() =>
    buildTourHintPayload({ locale, dict, stepId: null, tourEnabled, tourStarted })
  )

  const logs = state.context.logs
  const ui = state.context.ui

  const tourGuided = Boolean(tourEnabled && tourStarted)
  const allowPinInteraction = !tourGuided || currentTourStepId === 'pin'
  const allowConfirmInteraction = !tourGuided || currentTourStepId === 'confirm'

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
  const deviceType = state.context.device?.deviceType ?? 'pro'
  const statusDotClass = mockError || lastError ? 'bg-red-500' : mockReady ? 'bg-[#00B812]' : 'bg-zinc-400'
  const statusBadgeClass =
    mockError || lastError
      ? 'bg-red-50 text-red-700 ring-red-100 dark:bg-red-500/10 dark:text-red-100 dark:ring-red-500/30'
      : mockReady
        ? 'bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-100 dark:ring-emerald-500/30'
        : 'bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-zinc-800/70 dark:text-zinc-200 dark:ring-zinc-700'
  const statusText = useMemo(() => {
    if (state.matches('booting')) return dict.status.booting
    if (state.matches('notReady')) return dict.status.notReady
    if (state.matches('unavailable')) return dict.status.unavailable
    if (state.matches('canceling')) return dict.status.canceling
    if (state.matches('sending')) return dict.status.sending
    if (state.matches('awaitingPin')) return dict.status.awaitingPin
    if (state.matches('submittingPin')) return dict.status.submittingPin
    if (state.matches('awaitingConfirm')) return dict.status.awaitingConfirm
    if (state.matches('submittingConfirm')) return dict.status.submittingConfirm
    if (state.matches('ready')) return dict.status.ready
    return mockReady ? dict.status.ready : dict.status.notReady
  }, [dict.status, mockReady, state])
  const pinRequestId = ui?.type === 'pin' ? ui?.requestId ?? null : null
  const classicPinMatrix = useMemo(() => {
    if (deviceType !== 'classic1s') return null
    if (ui?.type !== 'pin') return null
    return buildClassicPinLayout(String(ui?.requestId ?? 'pin'))
  }, [deviceType, ui?.requestId, ui?.type])

  deviceTypeRef.current = deviceType
  uiTypeRef.current = ui?.type ?? null
  classicPinEntryOnDeviceRef.current = Boolean(classicPinEntryOnDevice)

  useEffect(() => {
    setDeviceTypeControl(deviceType)
  }, [deviceType])

	  useEffect(() => {
	    if (deviceType !== 'classic1s') {
	      setClassicPinModalOpen(false)
	      setClassicPinEntryOnDevice(false)
	      setClassicPinValue('')
	      pinOriginRef.current = null
	      return
	    }

    if (ui?.type !== 'pin') {
      setClassicPinModalOpen(false)
      setClassicPinEntryOnDevice(false)
      setClassicPinValue('')
      pinOriginRef.current = null
      return
    }

    // Classic 1s：
    // - 手动点击 unlock：直接进入设备端 PIN 界面（不弹窗）
    // - 发起受保护交互触发 REQUEST_PIN：弹出手机侧盲输 PIN 弹窗，可切换到设备输入
	    if (pinOriginRef.current === 'manual') {
	      setClassicPinModalOpen(false)
	      setClassicPinEntryOnDevice(true)
	      setClassicPinValue('')
	      return
	    }

	    setClassicPinValue('')
	    setClassicPinEntryOnDevice(false)
	    setClassicPinModalOpen(Boolean(allowPinInteraction))
	    if (tourGuided && allowPinInteraction) {
	      window.setTimeout(() => {
	        hardwareMockTourBus.emit('tour.refresh', { reason: 'classic1s.pin.modal.effect' })
	      }, 0)
	    }
	  }, [allowPinInteraction, deviceType, pinRequestId, tourGuided, ui?.type])

  const code = useMemo(
    () =>
      buildExampleCode({
        locale,
        command,
        btcPath,
        addressShowOnOneKey,
        messageHex
      }),
    [addressShowOnOneKey, btcPath, command, locale, messageHex]
  )

  const exampleFilename = useMemo(() => {
    if (command === 'searchDevices') return 'examples/searchDevices.ts'
    if (command === 'btcGetAddress') return 'examples/btcGetAddress.ts'
    if (command === 'btcSignMessage') return 'examples/btcSignMessage.ts'
    return 'examples/demo.ts'
  }, [command])

  const callbackFilename = useMemo(() => {
    return 'src/hardware-ui-events.ts'
  }, [])

  const resultFilename = useMemo(() => {
    return `results/${command}.json`
  }, [command])

  useEffect(() => {
    tourEnabledRef.current = Boolean(tourEnabled)
    if (!tourEnabled) {
      setTourStarted(false)
      tourStartedRef.current = false
      currentTourStepIdRef.current = null
      setCurrentTourStepId(null)
    }
  }, [tourEnabled])

  useEffect(() => {
    tourStartedRef.current = Boolean(tourStarted)
    if (!tourStarted) {
      currentTourStepIdRef.current = null
      setCurrentTourStepId(null)
    }
  }, [tourStarted])

  useEffect(() => {
    setTourHint(
      buildTourHintPayload({
        locale,
        dict,
        stepId: currentTourStepId,
        tourEnabled,
        tourStarted
      })
    )
  }, [locale, dict, currentTourStepId, tourEnabled, tourStarted])

  const callbackCode = useMemo(() => {
    const isEn = locale === 'en'
    const isPro = (deviceTypeControl ?? 'pro') !== 'classic1s'
    const extraHint =
      command === 'btcGetAddress' && !addressShowOnOneKey
        ? isEn
          ? `\n// Note: showOnOneKey=false usually skips device confirmation, so REQUEST_BUTTON may not happen.\n`
          : `\n// 注意：showOnOneKey=false 通常会跳过“设备上确认”，因此可能不会触发 REQUEST_BUTTON。\n`
        : ''

    if (isEn) {
      if (isPro) {
        return `import HardwareSDK from '@onekeyfe/hd-common-connect-sdk'
import { UI_EVENT, UI_REQUEST } from '@onekeyfe/hd-core'

// Pro: PIN is entered on device, so REQUEST_PIN will NOT be emitted.
// Subscribe once at app startup (subscribe early to avoid blocking).
HardwareSDK.on(UI_EVENT, (message) => {
  switch (message.type) {
    case UI_REQUEST.REQUEST_BUTTON: {
      // The device needs user confirmation (e.g. btcGetAddress showOnOneKey=true).
      // This callback happens when the confirm screen is shown (not at the end).
      // Usually you only show a "Confirm on device" hint (no uiResponse needed).
      return
    }

    case UI_REQUEST.CLOSE_UI_WINDOW: {
      // Close any modal/dialog you opened (Classic/Pure PIN prompt etc.)
      return
    }

    default:
      return
  }
})
${extraHint}`
      }

      return `import HardwareSDK from '@onekeyfe/hd-common-connect-sdk'
import { UI_EVENT, UI_REQUEST, UI_RESPONSE } from '@onekeyfe/hd-core'

// Classic 1s / Pure: REQUEST_PIN may happen. Pro will NOT emit REQUEST_PIN (PIN is entered on device).
// Subscribe once at app startup (subscribe early to avoid blocking on PIN).
HardwareSDK.on(UI_EVENT, (message) => {
  switch (message.type) {
    case UI_REQUEST.REQUEST_PIN: {
      // Option A (recommended): input PIN on device
      HardwareSDK.uiResponse({
        type: UI_RESPONSE.RECEIVE_PIN,
        payload: '@@ONEKEY_INPUT_PIN_IN_DEVICE',
      })

      // Option B: blind PIN input in software (Classic 1s / Pure only)
      // HardwareSDK.uiResponse({ type: UI_RESPONSE.RECEIVE_PIN, payload: userInputPin })
      return
    }

    case UI_REQUEST.REQUEST_BUTTON: {
      // The device needs user confirmation (e.g. btcGetAddress showOnOneKey=true).
      // This callback happens when the confirm screen is shown (not at the end).
      // Usually you only show a "Confirm on device" hint (no uiResponse needed).
      return
    }

    case UI_REQUEST.CLOSE_UI_WINDOW: {
      // Close any modal/dialog you opened for blind PIN input.
      return
    }

    default:
      return
  }
})
${extraHint}`
    }

    if (isPro) {
      return `import HardwareSDK from '@onekeyfe/hd-common-connect-sdk'
import { UI_EVENT, UI_REQUEST } from '@onekeyfe/hd-core'

// Pro：PIN 在设备上输入，因此不会触发 REQUEST_PIN，也不需要 uiResponse。
// 建议：应用启动时订阅一次（越早越好），避免交互流程阻塞。
HardwareSDK.on(UI_EVENT, (message) => {
  switch (message.type) {
    case UI_REQUEST.REQUEST_BUTTON: {
      // 设备进入需要确认的阶段（例如 btcGetAddress showOnOneKey=true）。
      // 该回调发生在“确认页面出现时”（不是最后）。
      // 通常你只需要提示“请在设备确认”（一般不需要 uiResponse）。
      return
    }

    case UI_REQUEST.CLOSE_UI_WINDOW: {
      // 关闭你打开的弹窗（例如 Classic/Pure 的 PIN 弹窗）
      return
    }

    default:
      return
  }
})
${extraHint}`
    }

    return `import HardwareSDK from '@onekeyfe/hd-common-connect-sdk'
import { UI_EVENT, UI_REQUEST, UI_RESPONSE } from '@onekeyfe/hd-core'

// Classic 1s / Pure：可能触发 REQUEST_PIN；Pro 不会（因为 PIN 在设备上输入）。
// 建议：应用启动时订阅一次（越早越好），避免 PIN 交互导致调用卡住。
HardwareSDK.on(UI_EVENT, (message) => {
  switch (message.type) {
    case UI_REQUEST.REQUEST_PIN: {
      // 方式 1（推荐）：在设备上输入 PIN
      HardwareSDK.uiResponse({
        type: UI_RESPONSE.RECEIVE_PIN,
        payload: '@@ONEKEY_INPUT_PIN_IN_DEVICE',
      })

      // 方式 2：软件盲输 PIN（Classic 1s / Pure 才支持）
      // HardwareSDK.uiResponse({ type: UI_RESPONSE.RECEIVE_PIN, payload: userInputPin })
      return
    }

    case UI_REQUEST.REQUEST_BUTTON: {
      // 设备进入需要确认的阶段（例如 btcGetAddress showOnOneKey=true）。
      // 该回调发生在“确认页面出现时”（不是最后）。
      // 通常你只需要提示“请在设备确认”（一般不需要 uiResponse）。
      return
    }

    case UI_REQUEST.CLOSE_UI_WINDOW: {
      // 用户完成输入/取消后，SDK 会要求你关闭弹窗（盲输 PIN 场景）
      return
    }

    default:
      return
  }
})
${extraHint}`
  }, [addressShowOnOneKey, command, deviceTypeControl, locale])

  const editorMarks = useMemo(() => {
    const exampleCall =
      command === 'btcGetAddress'
        ? findLineNumber(code, 'HardwareSDK.btcGetAddress')
        : command === 'btcSignMessage'
          ? findLineNumber(code, 'HardwareSDK.btcSignMessage')
          : command === 'searchDevices'
            ? findLineNumber(code, 'HardwareSDK.searchDevices')
            : null

    const callbackOn = findLineNumber(callbackCode, 'HardwareSDK.on(UI_EVENT')
    const callbackPin = findLineNumber(callbackCode, 'case UI_REQUEST.REQUEST_PIN')
    const callbackReceivePin = findLineNumber(callbackCode, 'UI_RESPONSE.RECEIVE_PIN')
    const callbackButtonHint = findLineNumber(callbackCode, 'REQUEST_BUTTON')

    return {
      example: {
        exampleCall
      },
      callback: {
        callbackOn,
        callbackPin,
        callbackReceivePin,
        callbackButtonHint
      }
    }
  }, [callbackCode, code, command])

  useEffect(() => {
    const offStep = hardwareMockTourBus.on('tour.step.changed', (payload) => {
      const stepId = payload?.stepId ?? null
      currentTourStepIdRef.current = stepId
      setCurrentTourStepId(stepId)

      // Classic 1s：Step=输入 PIN 时应优先锁定弹窗（而不是设备屏幕）。
      if (
        stepId === 'pin' &&
        deviceTypeRef.current === 'classic1s' &&
        uiTypeRef.current === 'pin' &&
        pinOriginRef.current !== 'manual' &&
        !classicPinEntryOnDeviceRef.current
      ) {
        setClassicPinValue('')
        setClassicPinEntryOnDevice(false)
        setClassicPinModalOpen(true)
        window.setTimeout(() => {
          hardwareMockTourBus.emit('tour.refresh', { reason: 'classic1s.pin.modal.open' })
        }, 0)
      }
    })
    return offStep
  }, [])

  useEffect(() => {
    const off = hardwareMockTourBus.on('tour.focus', (payload) => {
      if (!tourEnabledRef.current || !tourStartedRef.current) return
      const tab = payload?.tab
      if (tab === 'example' || tab === 'callback' || tab === 'result') {
        flushSync(() => {
          setRightTab(tab)
          setEditorFocus((prev) => {
            if (tab === 'example') return { ...prev, tab, activeLine: editorMarks.example.exampleCall ?? null }
            if (tab === 'callback') {
              const preferred = preferredCallbackLineRef.current
              return { ...prev, tab, activeLine: preferred ?? editorMarks.callback.callbackOn ?? null }
            }
            if (tab === 'result') return { ...prev, tab, activeLine: null }
            return { ...prev, tab }
          })
        })
      }
    })
    return off
  }, [editorMarks])

  useEffect(() => {
    if (!tourEnabled) return
    const connectId = state.context.device?.connectId ?? null
    const deviceId = state.context.device?.deviceId ?? null

    const params =
      command === 'btcGetAddress'
        ? {
            connectId,
            deviceId,
            path: btcPath,
            coin: 'btc',
            showOnOneKey: addressShowOnOneKey
          }
        : command === 'btcSignMessage'
          ? {
              connectId,
              deviceId,
              path: btcPath,
              coin: 'btc',
              messageHex
            }
          : command === 'searchDevices'
            ? undefined
            : undefined

    hardwareMockTourBus.emit('code.updated', { command, params, code })
  }, [tourEnabled, command, btcPath, addressShowOnOneKey, messageHex, code, state.context.device])

  useEffect(() => {
    if (!tourEnabled || !tourStarted) return
    if (!ui?.type) return
    hardwareMockTourBus.emit('ui.shown', { uiType: ui.type, action: ui?.action ?? null })
    // 仅记录“如果导览稍后聚焦到 callback-code，应当标记哪一行”。
    if (ui.type === 'pin') preferredCallbackLineRef.current = editorMarks.callback.callbackPin ?? null
    if (ui.type === 'confirm') {
      preferredCallbackLineRef.current =
        editorMarks.callback.callbackButtonHint ?? editorMarks.callback.callbackOn ?? null
    }
    if (rightTab === 'callback') {
      const preferred = preferredCallbackLineRef.current
      if (preferred) {
        flushSync(() => {
          setEditorFocus((prev) => (prev.tab === 'callback' ? { ...prev, activeLine: preferred } : prev))
        })
      }
    }
  }, [editorMarks, rightTab, tourEnabled, tourStarted, ui?.type, ui?.action])

  useEffect(() => {
    if (!tourEnabled || !tourStarted) return
    if (currentTourStepId === 'callback-request-button') {
      preferredCallbackLineRef.current =
        editorMarks.callback.callbackButtonHint ?? editorMarks.callback.callbackOn ?? null
      if (rightTab === 'callback') {
        const preferred = preferredCallbackLineRef.current
        if (preferred) {
          flushSync(() => {
            setEditorFocus((prev) => (prev.tab === 'callback' ? { ...prev, activeLine: preferred } : prev))
          })
        }
      }
    }
  }, [currentTourStepId, editorMarks, rightTab, tourEnabled, tourStarted])

  useEffect(() => {
    const el = deviceRef.current
    if (!el) return

    gsap.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power1.out' })
  }, [ui?.type, mockReady])

  // 结果/日志区域不再逐行滚动动画；保留核心交互区域的轻量动画即可。

  useEffect(() => {
    if (!tourEnabled || !tourStarted) return
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
    // Tour 期间的“结果”展示由导览步骤驱动（避免 callback-code 步骤还没看完就自动跳到 Result）。
    // 如果当前导览本身已经聚焦到 result，再同步激活该 tab。
    if (currentTourStepIdRef.current === 'result') {
      flushSync(() => {
        setRightTab('result')
        setEditorFocus((prev) => ({ ...prev, tab: 'result', activeLine: null }))
      })
    }
  }, [tourEnabled, tourStarted, logs])

  // Prism 高亮已由 EditorCodeBlock 负责，这里不再手动调用 Prism。

  function handleSendCommand() {
    const connectId = state.context.device?.connectId ?? null
    const deviceId = state.context.device?.deviceId ?? null

    if (deviceTypeControl === 'classic1s') {
      pinOriginRef.current = 'command'
    } else {
      pinOriginRef.current = null
    }

    const params =
      command === 'btcGetAddress'
        ? {
            connectId,
            deviceId,
            path: btcPath,
            coin: 'btc',
            showOnOneKey: addressShowOnOneKey
          }
        : command === 'btcSignMessage'
          ? {
              connectId,
              deviceId,
              path: btcPath,
              coin: 'btc',
              messageHex
            }
          : undefined

	    lastSentRef.current = { command, params }
	    if (tourEnabledRef.current) {
	      // 先标记“导览已开始”，确保 Tour 触发的 tour.focus 能被立即消费。
	      tourStartedRef.current = true
	      setTourStarted(true)
	      currentTourStepIdRef.current = null
	      setCurrentTourStepId(null)
	      preferredCallbackLineRef.current = null
	      hardwareMockTourBus.emit('command.sent', { command, params, deviceType: deviceTypeControl })
	    }
	    setRightTab('example')
	    setEditorFocus((prev) => ({
	      ...prev,
      tab: 'example',
      activeLine: editorMarks.example.exampleCall ?? null
    }))
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
    <div className="not-prose my-4 overflow-x-hidden" style={{ fontFamily: 'var(--font-ui)' }}>
      <div className="p-4">
        <HardwareMockTour locale={locale} enabled={tourEnabled} onExit={handleTourExit} />

	        {deviceType === 'classic1s' && classicPinModalOpen && ui?.type === 'pin' ? (
	          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
	            <div
	              className="w-full max-w-[400px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
	              data-tour="classic-pin-modal"
	            >
		              <div className="flex items-start justify-between gap-4 px-5 py-4">
			                <div className="min-w-0">
			                  <div className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
			                    {locale === 'en' ? 'Enter PIN' : '输入 PIN'}
			                  </div>
			                  <div className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
			                    {locale === 'en'
			                      ? 'Check the PIN matrix on your device, then click the matching positions here. Any 4 digits work (not validated in mock).'
			                      : '请先在设备屏幕上查看 PIN 矩阵，再在此处点击对应位置输入。任意 4 位即可提交（Mock 不校验）。'}
			                  </div>
			                </div>

	                <button
	                  type="button"
	                  onClick={() => {
	                    setClassicPinModalOpen(false)
	                    setClassicPinEntryOnDevice(false)
	                    setClassicPinValue('')
	                    send({ type: 'CANCEL' })
	                  }}
		                  className="grid h-9 w-9 place-items-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
	                  aria-label={locale === 'en' ? 'Close' : '关闭'}
	                >
	                  <X className="h-5 w-5" />
	                </button>
		              </div>

		              <div className="px-5 pb-4">
		                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/60">
		                  <div className="grid grid-cols-3 gap-px bg-zinc-200 dark:bg-zinc-800/60">
		                      <div className="col-span-3 bg-white px-4 py-3 dark:bg-zinc-950">
		                      <div className="flex h-10 items-center justify-center gap-2">
		                        {Array.from({ length: Math.min(4, classicPinValue.length) }).map((_, idx) => (
		                          <span
		                            key={`pin-dot-${idx}`}
		                            className="h-2.5 w-2.5 rounded-full bg-zinc-900 dark:bg-zinc-100"
		                          />
		                        ))}
		                      </div>
		                    </div>

		                    {Array.from({ length: 12 }).map((_, cellIndex) => {
		                      const isDeleteKey = cellIndex === 9
		                      const isConfirmKey = cellIndex === 11
		                      const positionIndex = cellIndex < 9 ? cellIndex : cellIndex === 10 ? 9 : null // 0-8 dots + bottom-middle dot(9)
		                      const baseDisabled = isBusy || !allowPinInteraction

		                      if (isDeleteKey) {
		                        const disabled = baseDisabled || !classicPinValue
		                        return (
		                          <button
		                            key="pin-delete"
		                            type="button"
		                            disabled={disabled}
		                            onClick={() => {
		                              if (disabled) return
		                              setClassicPinValue((prev) => prev.slice(0, -1))
		                            }}
		                            className={[
		                              'h-[68px] w-full',
		                              'grid place-items-center',
		                              'bg-zinc-200 text-zinc-700',
		                              'transition-colors',
		                              'hover:bg-zinc-300 active:bg-zinc-400',
		                              'focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40 dark:focus-visible:ring-zinc-500/40',
		                              'disabled:pointer-events-none disabled:opacity-50',
		                              'dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:active:bg-zinc-600'
		                            ].join(' ')}
		                            aria-label={locale === 'en' ? 'Delete' : '删除'}
		                          >
		                            <Delete className="h-5 w-5" />
		                          </button>
		                        )
		                      }

		                      if (isConfirmKey) {
		                        const disabled = baseDisabled || classicPinValue.length < 4
		                        return (
		                          <button
		                            key="pin-confirm"
		                            type="button"
		                            disabled={disabled}
		                            onClick={() => {
		                              if (disabled) return
		                              setClassicPinModalOpen(false)
		                              if (tourEnabled && tourStarted) {
		                                hardwareMockTourBus.emit('ui.pin.submit', { pinLength: String(classicPinValue ?? '').length })
		                              } else {
		                                setRightTab('callback')
		                                setEditorFocus((prev) => ({
		                                  ...prev,
		                                  tab: 'callback',
		                                  activeLine: editorMarks.callback.callbackReceivePin ?? null
		                                }))
		                              }
		                              send({ type: 'SUBMIT_PIN', pin: String(classicPinValue ?? '').slice(0, 4) })
		                            }}
		                            className={[
		                              'h-[68px] w-full',
		                              'grid place-items-center',
		                              'bg-zinc-600 text-white',
		                              'transition-colors',
		                              'hover:bg-zinc-700 active:bg-zinc-800',
		                              'focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40 dark:focus-visible:ring-zinc-500/40',
		                              'disabled:pointer-events-none disabled:opacity-50',
		                              'dark:bg-zinc-300 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:active:bg-zinc-100'
		                            ].join(' ')}
		                            aria-label={locale === 'en' ? 'Confirm' : '确认'}
		                          >
		                            <Check className="h-6 w-6" />
		                          </button>
		                        )
		                      }

		                      if (positionIndex === null) return null

		                      return (
		                        <button
		                          key={`dot-${positionIndex}`}
		                          type="button"
		                          disabled={baseDisabled}
		                          onClick={() => {
		                            if (!allowPinInteraction) return
		                            const mapping = classicPinMatrix ?? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
		                            const digit = mapping[positionIndex]
		                            setClassicPinValue((prev) => `${prev}${String(digit)}`.slice(0, 4))
		                          }}
		                          className={[
		                            'h-[68px] w-full',
		                            'grid place-items-center',
		                            'bg-zinc-50',
		                            'transition-colors',
		                            'hover:bg-zinc-100 active:bg-zinc-200',
		                            'focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40 dark:focus-visible:ring-zinc-500/40',
		                            'disabled:pointer-events-none disabled:opacity-50',
		                            'dark:bg-zinc-900/40 dark:hover:bg-zinc-900/70 dark:active:bg-zinc-800'
		                          ].join(' ')}
		                          aria-label={`pin-dot-${positionIndex}`}
		                        >
		                          <span className="h-3 w-3 rounded-full bg-zinc-800 dark:bg-zinc-100" />
		                        </button>
		                      )
		                    })}
		                  </div>
		                </div>

		                <button
		                  type="button"
		                  disabled={isBusy || !allowPinInteraction}
		                  onClick={() => {
		                    if (!allowPinInteraction) return
		                    setClassicPinModalOpen(false)
		                    setClassicPinValue('')
		                    setClassicPinEntryOnDevice(true)
		                    if (tourGuided && currentTourStepIdRef.current === 'pin') {
		                      window.setTimeout(() => {
		                        hardwareMockTourBus.emit('tour.refresh', { reason: 'classic1s.pin.switchToDevice' })
		                      }, 0)
		                    }
		                  }}
		                  className="mt-4 w-full text-center text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 disabled:opacity-50 dark:text-zinc-400 dark:hover:text-zinc-100"
		                >
		                  {locale === 'en' ? 'Use device input' : '使用设备输入'}
		                </button>
		              </div>
	            </div>
	          </div>
	        ) : null}

        {(mockError || lastError) && (
          <div className="mt-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">
            {mockError ? `${locale === 'en' ? 'Mock error' : 'Mock 错误'}：${mockError}` : null}
            {mockError && lastError ? ' · ' : null}
            {lastError ? `${locale === 'en' ? 'Error' : '最近错误'}：${lastError}` : null}
          </div>
        )}

        <div className="mt-2 rounded-2xl bg-zinc-50/60 p-4 dark:bg-zinc-900/30">
          <div className="grid min-h-0 gap-6 lg:grid-cols-[minmax(320px,480px)_minmax(0,1fr)] lg:items-stretch">
            <div className="flex min-h-0 flex-col gap-4 lg:flex-row lg:gap-5">
              <div className="flex-1 min-w-0">
                <div className="pb-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{dict.labels.deviceScreen}</div>
                    <div
                      className={[
                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1',
                        statusBadgeClass
                      ].join(' ')}
                    >
                      <span className={['h-2 w-2 rounded-full', statusDotClass].join(' ')} />
                      <span className="whitespace-nowrap">{statusText}</span>
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-zinc-600 ring-1 ring-zinc-200/80 dark:text-zinc-200 dark:ring-zinc-800/70">
                      <Info size={14} strokeWidth={2} className="text-zinc-400 dark:text-zinc-500" />
                      <span className="whitespace-nowrap">{dict.labels.pinNote}</span>
                    </div>

                    <a
                      href="https://hardware-example.onekey.so/#/emulator"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200/70 bg-white/90 px-2.5 text-xs font-semibold text-zinc-800 shadow-sm transition-all hover:-translate-y-[1px] hover:border-zinc-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B812]/30 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:border-zinc-700"
                    >
                      {dict.labels.openEmulator}
                      <ExternalLink size={14} strokeWidth={1.8} />
                    </a>

                    <div className="relative">
                      <select
                        value={deviceTypeControl}
                        onChange={(e) => {
                          const next = e.target.value === 'classic1s' ? 'classic1s' : 'pro'
                          setDeviceTypeControl(next)
                          send({ type: 'SEND', command: 'setDeviceModel', params: { deviceType: next } })
                        }}
                        disabled={!mockReady || isBusy || isAwaitingUi || tourStarted}
                        className="h-9 appearance-none rounded-lg border border-zinc-200/70 bg-white/80 pl-3 pr-9 text-sm font-medium text-zinc-900 shadow-sm transition-all hover:border-zinc-300 hover:bg-white focus:border-[#00B812]/50 focus:ring-2 focus:ring-[#00B812]/25 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:hover:border-zinc-700"
                        aria-label={locale === 'en' ? 'Device model' : '设备型号'}
                      >
                        <option value="pro">OneKey Pro</option>
                        <option value="classic1s">OneKey Classic 1s</option>
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
                        aria-hidden="true"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const next = !tourEnabledRef.current
                        tourEnabledRef.current = next
                        setTourEnabled(next)
                      }}
                      className={[
                        'inline-flex h-9 items-center gap-2 rounded-lg border px-2.5 text-sm font-semibold transition-all shadow-sm',
                        tourEnabled
                          ? 'border-[#00B812]/60 bg-[#00B812]/10 text-[#0a7024] hover:bg-[#00B812]/15 dark:border-[#00B812]/50 dark:bg-[#00B812]/20 dark:text-[#a4ffba]'
                          : 'border-zinc-200/70 bg-white/80 text-zinc-900 hover:border-zinc-300 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:hover:border-zinc-700'
                      ].join(' ')}
                      aria-pressed={tourEnabled}
                    >
                      <span
                        className={[
                          'h-2.5 w-2.5 rounded-full',
                          tourEnabled ? 'bg-[#00B812] shadow-[0_0_0_4px_rgba(0,184,18,0.16)]' : 'bg-zinc-400'
                        ].join(' ')}
                      />
                      <span>{locale === 'en' ? 'Tour' : '导览'}</span>
                    </button>
                  </div>

                  <div ref={deviceRef} className="mt-3 flex justify-center" data-tour="device-screen">
                    {deviceType === 'classic1s' ? (
                      <Classic1sDeviceScreen
                        locale={locale}
                        busy={isBusy}
                        device={state.context.device}
                        ui={ui}
                        pinEntryOnDevice={classicPinEntryOnDevice}
                        pinMatrix={classicPinMatrix}
                        allowPinInput={allowPinInteraction}
                        allowConfirmInput={allowConfirmInteraction}
                        onSubmitPin={(pinValue) => {
                          if (!allowPinInteraction) return
                          if (tourEnabled && tourStarted) {
                            hardwareMockTourBus.emit('ui.pin.submit', { pinLength: String(pinValue ?? '').length })
                          } else {
                            setRightTab('callback')
                            setEditorFocus((prev) => ({
                              ...prev,
                              tab: 'callback',
                              activeLine: editorMarks.callback.callbackReceivePin ?? null
                            }))
                          }
                          send({ type: 'SUBMIT_PIN', pin: pinValue })
                        }}
                        onConfirm={() => {
                          if (!allowConfirmInteraction) return
                          if (tourEnabled && tourStarted) {
                            hardwareMockTourBus.emit('ui.confirm', { action: ui?.action ?? null, approved: true })
                          } else if (ui?.action === 'btcGetAddress') {
                            setRightTab('callback')
                            setEditorFocus((prev) => ({ ...prev, tab: 'callback', activeLine: editorMarks.callback.callbackOn ?? null }))
                          }
                          send({ type: 'CONFIRM', approved: true })
                        }}
                        onReject={() => {
                          if (!allowConfirmInteraction) return
                          if (tourEnabled) {
                            hardwareMockTourBus.emit('ui.confirm', { action: ui?.action ?? null, approved: false })
                          }
                          send({ type: 'CONFIRM', approved: false })
                        }}
                        onTapToUnlock={() => {
                          if (tourGuided) return
                          if (!mockReady || isBusy || isAwaitingUi) return
                          pinOriginRef.current = 'manual'
                          setClassicPinModalOpen(false)
                          setClassicPinEntryOnDevice(true)
                          setClassicPinValue('')
                          if (tourEnabled) {
                            hardwareMockTourBus.emit('ui.unlock.tap', {})
                          }
                          send({ type: 'SEND', command: 'deviceUnlock', params: { connectId: state.context.device?.connectId ?? null } })
                        }}
                      />
                    ) : (
                      <ProDeviceScreen
                        basePath={basePath}
                        locale={locale}
                        busy={isBusy}
                        device={state.context.device}
                        ui={ui}
                        allowPinInput={allowPinInteraction}
                        allowConfirmInput={allowConfirmInteraction}
                        onSubmitPin={(pinValue) => {
                          if (!allowPinInteraction) return
                          if (tourEnabled && tourStarted) {
                            hardwareMockTourBus.emit('ui.pin.submit', { pinLength: String(pinValue ?? '').length })
                          } else {
                            setRightTab('callback')
                            setEditorFocus((prev) => ({
                              ...prev,
                              tab: 'callback',
                              activeLine: editorMarks.callback.callbackReceivePin ?? null
                            }))
                          }
                          send({ type: 'SUBMIT_PIN', pin: pinValue })
                        }}
                        onConfirm={() => {
                          if (!allowConfirmInteraction) return
                          if (tourEnabled && tourStarted) {
                            hardwareMockTourBus.emit('ui.confirm', { action: ui?.action ?? null, approved: true })
                          } else if (ui?.action === 'btcGetAddress') {
                            setRightTab('callback')
                            setEditorFocus((prev) => ({ ...prev, tab: 'callback', activeLine: editorMarks.callback.callbackOn ?? null }))
                          }
                          send({ type: 'CONFIRM', approved: true })
                        }}
                        onReject={() => {
                          if (!allowConfirmInteraction) return
                          if (tourEnabled) {
                            hardwareMockTourBus.emit('ui.confirm', { action: ui?.action ?? null, approved: false })
                          }
                          send({ type: 'CONFIRM', approved: false })
                        }}
                        onCancel={() => send({ type: 'CANCEL' })}
                        onTapToUnlock={() => {
                          if (tourGuided) return
                          if (!mockReady || isBusy || isAwaitingUi) return
                          if (tourEnabled) {
                            hardwareMockTourBus.emit('ui.unlock.tap', {})
                          }
                          send({ type: 'SEND', command: 'deviceUnlock', params: { connectId: state.context.device?.connectId ?? null } })
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex min-w-0 flex-col gap-4 lg:w-[360px]">
                <TourHintCard hint={tourHint} locale={locale} />
                <div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-950/40">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{dict.labels.commandPanel}</div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="grid gap-2 lg:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          {dict.labels.command}
                        </label>
                        <div className="relative">
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
                            disabled={!mockReady || isBusy || isAwaitingUi || tourGuided}
                            className="h-9 w-full appearance-none rounded-lg bg-zinc-100/80 pl-3 pr-9 text-sm font-medium text-zinc-900 outline-none transition-colors hover:bg-zinc-100 focus:ring-2 focus:ring-[#00B812]/25 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-900/40 dark:text-zinc-100 dark:hover:bg-zinc-900/55"
                          >
                            <option value="searchDevices">searchDevices</option>
                            <option value="btcGetAddress">btcGetAddress</option>
                            <option value="btcSignMessage">btcSignMessage</option>
                          </select>
                          <ChevronDown
                            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
                            aria-hidden="true"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Path</label>
                        <input
                          value={btcPath}
                          onChange={(e) => setBtcPath(e.target.value)}
                          disabled={command === 'searchDevices' || !mockReady || isBusy || isAwaitingUi || tourGuided}
                          className="h-9 w-full rounded-lg bg-zinc-100/80 px-3 text-sm font-medium text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 hover:bg-zinc-100 focus:ring-2 focus:ring-[#00B812]/25 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-900/40 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:hover:bg-zinc-900/55"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <label
                        data-tour="show-on-onekey"
                        className="inline-flex items-center gap-3 rounded-lg bg-zinc-100/80 px-3 py-2 text-xs font-medium text-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-200"
                      >
                        <span className="text-zinc-700 dark:text-zinc-200">{dict.labels.showOnDevice}</span>
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
                          disabled={command !== 'btcGetAddress' || !mockReady || isBusy || isAwaitingUi || tourGuided}
                          className="peer sr-only"
                        />
                        <span className="relative h-5 w-9 rounded-full bg-zinc-200 transition-colors peer-checked:bg-[#00B812] peer-disabled:opacity-60 dark:bg-zinc-800">
                          <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4 dark:bg-zinc-50" />
                        </span>
                      </label>
                    </div>

                    {command === 'btcSignMessage' && (
                      <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">messageHex</label>
                        <textarea
                          value={messageHex}
                          onChange={(e) => setMessageHex(e.target.value)}
                          disabled={!mockReady || isBusy || isAwaitingUi || tourGuided}
                          rows={3}
                          className="w-full resize-none rounded-lg bg-zinc-100/80 px-3 py-2 text-sm font-medium text-zinc-900 outline-none transition-colors hover:bg-zinc-100 focus:ring-2 focus:ring-[#00B812]/25 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-900/40 dark:text-zinc-100 dark:hover:bg-zinc-900/55"
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleSendCommand}
                      disabled={!mockReady || isBusy || isAwaitingUi || tourGuided}
                      data-tour="send-button"
                      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#00B812] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#00A311] focus:outline-none focus:ring-2 focus:ring-[#00B812]/25 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Send size={16} strokeWidth={1.8} />
                      {dict.labels.sendCommand}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex h-full min-h-0 flex-col">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{dict.labels.devViewTitle}</div>
                <span className="truncate rounded-lg bg-white/80 px-2 py-0.5 font-mono text-[11px] text-zinc-700 dark:bg-zinc-950/60 dark:text-zinc-300">
                    {command}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {rightTab === 'example' ? (
                    <button
                      type="button"
                      onClick={handleCopy}
                      disabled={tourGuided}
                      className="grid h-9 w-9 place-items-center rounded-lg bg-white/80 text-zinc-900 shadow-sm transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-950/60 dark:text-zinc-100 dark:hover:bg-zinc-950"
                      aria-label={copied ? dict.labels.copied : dict.labels.copy}
                      title={copied ? dict.labels.copied : dict.labels.copy}
                    >
                      {copied ? <Check size={16} strokeWidth={1.8} /> : <Copy size={16} strokeWidth={1.8} />}
                    </button>
                  ) : null}

                  <div className="inline-flex rounded-lg bg-white/80 p-0.5 text-xs shadow-sm dark:bg-zinc-950/60">
                    {[
                      { key: 'example', label: dict.labels.tabExample },
                      { key: 'callback', label: dict.labels.tabCallback },
                      { key: 'result', label: dict.labels.tabResult }
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        disabled={tourGuided}
                        onClick={() => {
                          if (tourGuided) return
                          setRightTab(tab.key)
                          setEditorFocus((prev) => {
                            if (tab.key === 'example') return { ...prev, tab: tab.key, activeLine: editorMarks.example.exampleCall ?? null }
                            if (tab.key === 'callback') return { ...prev, tab: tab.key, activeLine: editorMarks.callback.callbackOn ?? null }
                            if (tab.key === 'result') return { ...prev, tab: tab.key, activeLine: null }
                            return { ...prev, tab: tab.key }
                          })
                        }}
                        className={[
                          'rounded px-2.5 py-1 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60',
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
              </div>

              <div className="mt-3 flex min-h-0 flex-1 flex-col">
                {rightTab === 'example' ? (
                  <EditorCodeBlock
                    dataTour="example-code"
                    code={code}
                    language="typescript"
                    filename={exampleFilename}
                    activeLine={tourEnabled && tourStarted && editorFocus.tab === 'example' ? editorFocus.activeLine : null}
                    breakpoints={
                      tourEnabled && tourStarted && editorFocus.tab === 'example' && editorFocus.activeLine ? [editorFocus.activeLine] : []
                    }
                    showBreakpoints={tourEnabled && tourStarted}
                    className="min-h-0 flex-1"
                  />
                ) : null}

                {rightTab === 'callback' ? (
                  <EditorCodeBlock
                    dataTour="callback-code"
                    code={callbackCode}
                    language="typescript"
                    filename={callbackFilename}
                    activeLine={tourEnabled && tourStarted && editorFocus.tab === 'callback' ? editorFocus.activeLine : null}
                    breakpoints={
                      tourEnabled && tourStarted && editorFocus.tab === 'callback' && editorFocus.activeLine ? [editorFocus.activeLine] : []
                    }
                    showBreakpoints={tourEnabled && tourStarted}
                    className="min-h-0 flex-1"
                  />
                ) : null}

                {rightTab === 'result'
                  ? (() => {
                      const last = [...logs].reverse().find((item) => item.level === 'response' || item.level === 'error') ?? null
                      return (
                        <div className="flex min-h-0 flex-1 flex-col gap-2" data-tour="result-panel">
                          {last ? (
                            <div className="font-mono text-xs">
                              <span className="text-zinc-500 dark:text-zinc-500">[{formatTime(last.ts)}]</span>{' '}
                              <span className={getLevelStyle(last.level)}>{last.title}</span>
                            </div>
                          ) : null}

                          {last && last.data !== undefined ? (
                            <EditorCodeBlock
                              code={formatJsonPretty(last.data)}
                              language="json"
                              filename={resultFilename}
                              activeLine={null}
                              breakpoints={[]}
                              cursor="default"
                              className="min-h-0 flex-1"
                            />
                          ) : (
                            <div className="flex min-h-0 flex-1 items-center justify-center rounded-xl bg-white/70 p-3 text-xs text-zinc-500 dark:bg-zinc-950/40 dark:text-zinc-500">
                              {!last ? dict.labels.noResult : dict.labels.noPayload}
                            </div>
                          )}

                          {last ? (
                            <details>
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
                          ) : null}
                        </div>
                      )
                    })()
                  : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
