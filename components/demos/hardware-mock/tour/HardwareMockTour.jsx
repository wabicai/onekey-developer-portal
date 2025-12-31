'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Tour, TourContext, useTour } from '@reactour/tour'
import { Compass } from 'lucide-react'
import { hardwareMockTourBus } from './hardwareMockTourBus'
import { createClassic1sInteractiveSteps } from './steps/classic1sSteps'
import { createProInteractiveSteps } from './steps/proSteps'
import { eventStep, hintStep, normalizeDeviceType } from './steps/stepHelpers'

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function PortalTourProvider({ children, defaultOpen = false, startAt = 0, steps: defaultSteps, ...props }) {
  // @reactour/tour 的 TourProvider 默认不使用 portal，容易被页面布局/stacking context 遮挡。
  // 这里用 createPortal 把 Tour 渲染到 document.body，确保气泡覆盖层始终可见。
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [currentStep, setCurrentStep] = useState(startAt)
  const [steps, setSteps] = useState(defaultSteps)
  const [meta, setMeta] = useState('')
  const [disabledActions, setDisabledActions] = useState(false)

  const value = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      currentStep,
      setCurrentStep,
      steps,
      setSteps,
      meta,
      setMeta,
      disabledActions,
      setDisabledActions,
      ...props
    }),
    [currentStep, disabledActions, isOpen, meta, props, steps]
  )

  return (
    <TourContext.Provider value={value}>
      {children}
      {isOpen && typeof document !== 'undefined' ? createPortal(<Tour {...value} />, document.body) : null}
    </TourContext.Provider>
  )
}

function getDict(locale) {
  const isEn = locale === 'en'
  return {
    tourTitle: isEn ? 'Hardware Mock' : '硬件 Mock',
    justTriggered: isEn ? 'Triggered' : '已触发',
    guide: isEn ? 'Guide' : '操作指引',
    close: isEn ? 'Close' : '关闭导览'
  }
}

function InlineCode({ children }) {
  return (
    <code
      className="rounded-md px-1 py-0.5 font-mono text-[11px] leading-[1.2]"
      style={{
        fontFamily: 'var(--font-mono)',
        background: 'color-mix(in srgb, var(--ok-tour-bg) 88%, var(--ok-tour-text) 12%)',
        border: '1px solid color-mix(in srgb, var(--ok-tour-border) 80%, var(--ok-tour-text) 20%)',
        color: 'var(--ok-tour-text)',
        whiteSpace: 'normal',
        overflowWrap: 'anywhere',
        wordBreak: 'break-word'
      }}
    >
      {children}
    </code>
  )
}

function InlineQuote({ children }) {
  return (
    <span
      className="rounded-md px-1.5 py-0.5 text-[11px] font-medium leading-[1.2]"
      style={{
        background: 'color-mix(in srgb, var(--ok-tour-bg) 92%, var(--ok-tour-accent) 8%)',
        border: '1px solid color-mix(in srgb, var(--ok-tour-border) 70%, var(--ok-tour-accent) 30%)',
        color: 'var(--ok-tour-text)',
        whiteSpace: 'normal',
        overflowWrap: 'anywhere',
        wordBreak: 'break-word'
      }}
    >
      {children}
    </span>
  )
}

function renderTourText(value) {
  if (value == null) return null
  if (typeof value !== 'string') return value

  const text = value
  // 轻量高亮：函数调用 / 常量 / key=value / 常见 UI 文案引用（“Send”、「下一步」等）
  const tokenRe =
    /(`[^`]+`|「[^」]+」|“[^”]+”|"[^"]+"|\b[A-Za-z_$][\w$]*\(\)|\b[A-Z][A-Z0-9_]{2,}\b|\b[A-Za-z_$][\w$]*=[^ \n，。；,.;)]+)/g

  const parts = []
  let lastIndex = 0
  let match
  while ((match = tokenRe.exec(text)) !== null) {
    const start = match.index
    const end = start + match[0].length
    if (start > lastIndex) parts.push(text.slice(lastIndex, start))
    const token = match[0]

    if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(<InlineCode key={`code-${start}`}>{token.slice(1, -1)}</InlineCode>)
    } else if (token.startsWith('「') && token.endsWith('」')) {
      parts.push(<InlineQuote key={`quote-${start}`}>{token.slice(1, -1)}</InlineQuote>)
    } else if (token.startsWith('“') && token.endsWith('”')) {
      parts.push(<InlineQuote key={`quote-${start}`}>{token.slice(1, -1)}</InlineQuote>)
    } else if (token.startsWith('"') && token.endsWith('"')) {
      parts.push(<InlineQuote key={`quote-${start}`}>{token.slice(1, -1)}</InlineQuote>)
    } else {
      parts.push(<InlineCode key={`code-${start}`}>{token}</InlineCode>)
    }
    lastIndex = end
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))

  const out = []
  parts.forEach((p, idx) => {
    if (typeof p === 'string' && p.includes('\n')) {
      const lines = p.split('\n')
      lines.forEach((line, lineIdx) => {
        if (line) out.push(line)
        if (lineIdx < lines.length - 1) out.push(<br key={`br-${idx}-${lineIdx}`} />)
      })
      return
    }
    out.push(p)
  })
  return out
}

function safeExpect(expect, evt) {
  if (typeof expect !== 'function') return false
  try {
    return Boolean(expect(evt))
  } catch {
    return false
  }
}

function isEventStep(step) {
  return step?.mode === 'event'
}

function isStepSatisfied(step, events) {
  if (!isEventStep(step)) return false
  const list = Array.isArray(events) ? events : []
  for (const evt of list) {
    if (safeExpect(step?.expect, evt)) return true
  }
  return false
}

function findFirstIncompleteIndex(steps, startIndex, events) {
  const maxIndex = steps.length - 1
  let idx = clamp(startIndex, 0, maxIndex)
  while (idx <= maxIndex) {
    const step = steps[idx]
    if (isEventStep(step) && isStepSatisfied(step, events)) {
      idx += 1
      continue
    }
    break
  }
  return clamp(idx, 0, maxIndex)
}

function createWaitingModelSteps(locale) {
  const isEn = locale === 'en'
  return [
    eventStep({
      id: 'waiting-start',
      selector: '[data-tour="send-button"]',
      placement: 'bottom',
      now: isEn ? 'Waiting for a command.' : '等待命令。',
      next: isEn ? 'Pick a command and tap Send.' : '选择命令并发送。',
      expect: (evt) => evt?.type === 'command.sent'
    })
  ]
}

function createSearchDevicesSteps(locale) {
  const isEn = locale === 'en'
  return [
    hintStep({
      id: 'example-code',
      selector: '[data-tour="example-code"]',
      placement: 'right',
      now: isEn ? '`searchDevices` sent.' : '`searchDevices` 已发送。',
      next: isEn ? 'Check the Result panel.' : '查看 Result 面板。'
    }),
    eventStep({
      id: 'wait-result',
      selector: '[data-tour="result-panel"]',
      placement: 'top',
      now: isEn ? 'Waiting for result…' : '等待结果…',
      next: isEn ? 'Result shows here.' : '结果显示在这里。',
      expect: (evt) => evt?.type === 'command.result'
    }),
    hintStep({
      id: 'result',
      selector: '[data-tour="result-panel"]',
      placement: 'top',
      now: isEn ? 'Device list ready.' : '设备列表已就绪。',
      next: isEn ? 'Try `btcGetAddress` / `btcSignMessage`.' : '可继续 `btcGetAddress` / `btcSignMessage`。'
    })
  ]
}

function createCallbackAndResultSteps(locale) {
  const isEn = locale === 'en'
  return [
    hintStep({
      id: 'result',
      selector: '[data-tour="result-panel"]',
      placement: 'top',
      now: isEn ? ['Result payload ready.'] : ['结果 payload 已就绪。'],
      next: isEn ? 'Open callbacks template.' : '查看回调模板。'
    }),
    hintStep({
      id: 'callback-code',
      selector: '[data-tour="callback-code"]',
      placement: 'right',
      now: isEn ? 'UI_EVENT template.' : 'UI_EVENT 模板。',
      next: isEn ? 'Handle `REQUEST_*` events.' : '处理 `REQUEST_*` 事件。'
    })
  ]
}

function createFlowSteps(locale, startEvent) {
  const isEn = locale === 'en'
  const command = startEvent?.command ?? null
  const params = startEvent?.params ?? null
  const deviceType = normalizeDeviceType(startEvent?.deviceType)
  const showOnOneKey = Boolean(params?.showOnOneKey)
  if (command === 'searchDevices') return createSearchDevicesSteps(locale)

  if (command === 'btcGetAddress' || command === 'btcSignMessage') {
    if (deviceType === 'classic1s') return createClassic1sInteractiveSteps(locale, { command, showOnOneKey })
    return createProInteractiveSteps(locale, { command, showOnOneKey })
  }

  return [
    hintStep({
      id: 'example-code',
      selector: '[data-tour="example-code"]',
      placement: 'right',
      now: isEn ? [`Command: \`${command ?? '-'}\``] : [`命令：\`${command ?? '-'}\``],
      next: isEn ? ['Send a supported command.'] : ['发送支持的命令。']
    }),
    ...createCallbackAndResultSteps(locale)
  ]
}


function focusTabForSelector(selector) {
  if (selector === '[data-tour="example-code"]') return 'example'
  if (selector === '[data-tour="callback-code"]') return 'callback'
  if (selector === '[data-tour="result-panel"]') return 'result'
  return null
}

function sidePlacementForSelector(selector) {
  const token = String(selector ?? '')
  if (token.includes('result-panel') || token.includes('example-code') || token.includes('callback-code')) return 'left'
  return 'right'
}

function renderTourContent(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) return null
    if (value.length === 1) return renderTourText(value[0])
    return (
      <ul className="mt-0.5 space-y-1.5">
        {value.map((item, idx) => (
          <li key={`li-${idx}`} className="flex items-start gap-2">
            <span
              className="mt-[6px] inline-flex h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: 'color-mix(in srgb, var(--ok-tour-text) 55%, var(--ok-tour-muted) 45%)' }}
            />
            <span className="min-w-0">{renderTourText(item)}</span>
          </li>
        ))}
      </ul>
    )
  }
  return renderTourText(value)
}

function normalizeTourItems(value) {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

function GuideCard({ icon: Icon, title, accentColor, primary, secondary }) {
  const hasPrimary = Array.isArray(primary) && primary.length > 0
  const hasSecondary = Array.isArray(secondary) && secondary.length > 0

  return (
    <div
      className="mt-2 rounded-lg border px-3 py-3 ok-tour-card"
      style={{
        borderColor: `color-mix(in srgb, var(--ok-tour-border) 85%, ${accentColor} 15%)`,
        backgroundColor: 'var(--ok-tour-bg)',
        backgroundImage: 'none',
        opacity: 1,
        borderLeft: `2px solid ${accentColor}`
      }}
    >
      <div className="flex items-center gap-2">
        {Icon ? (
          <span
            className="inline-flex h-5 w-5 items-center justify-center rounded-md"
            style={{
              background: `color-mix(in srgb, var(--ok-tour-bg) 94%, ${accentColor} 6%)`,
              color: accentColor
            }}
          >
            <Icon size={14} />
          </span>
        ) : null}
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: accentColor }}>
          {title}
        </div>
      </div>
      {hasPrimary ? (
        <div
          className="mt-2 text-sm font-semibold leading-relaxed"
          style={{ color: 'var(--ok-tour-text)', overflowWrap: 'anywhere', wordBreak: 'break-word' }}
        >
          {renderTourContent(primary)}
        </div>
      ) : null}
      {hasSecondary ? (
        <div
          className="mt-1 text-xs leading-relaxed"
          style={{ color: 'var(--ok-tour-muted)', overflowWrap: 'anywhere', wordBreak: 'break-word' }}
        >
          {renderTourContent(secondary)}
        </div>
      ) : null}
    </div>
  )
}

function emitStepChanged(steps, index) {
  const list = Array.isArray(steps) ? steps : []
  const maxIndex = Math.max(0, list.length - 1)
  const safeIndex = clamp(typeof index === 'number' ? index : 0, 0, maxIndex)
  const step = list[safeIndex]
  const tab = focusTabForSelector(step?.selector)
  hardwareMockTourBus.emit('tour.step.changed', {
    stepId: step?.id ?? null,
    mode: step?.mode ?? null,
    index: safeIndex,
    total: list.length,
    selector: step?.selector ?? null,
    tab
  })
}

function emitTourClosed() {
  hardwareMockTourBus.emit('tour.step.changed', {
    stepId: null,
    mode: null,
    index: 0,
    total: 0,
    selector: null,
    tab: null
  })
}

function createReactourSteps({ locale, dict, modelStepsRef, lastEventRef, currentStepRef, eventLogRef, onExit }) {
  const steps = modelStepsRef.current ?? []
  return steps.map((s) => ({
    selector: s.selector,
    position: sidePlacementForSelector(s.selector),
    content: ({ currentStep, setCurrentStep, setIsOpen }) => {
      const liveSteps = modelStepsRef.current ?? []
      const maxIndex = liveSteps.length - 1
      const safeIndex = clamp(typeof currentStep === 'number' ? currentStep : 0, 0, maxIndex)
      currentStepRef.current = safeIndex
      const step = liveSteps[safeIndex]
      const canNext = Boolean(step?.mode === 'hint' && step?.allowNext !== false && safeIndex < maxIndex)
      const isLast = safeIndex >= maxIndex
      const isEvent = step?.mode === 'event'

      const closeTour = () => {
        setIsOpen(false)
        emitTourClosed()
        onExit?.()
      }

      return (
        <div
          className="text-sm"
          style={{
            width: 'min(360px, calc(100vw - 48px))',
            color: 'var(--ok-tour-text)',
            fontFamily: 'var(--font-ui)'
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <div className="truncate text-[13px] font-semibold leading-tight" style={{ color: 'var(--ok-tour-text)' }}>
                {dict.tourTitle}
              </div>
              <div className="shrink-0 text-[11px] font-medium" style={{ color: 'var(--ok-tour-muted)' }}>
                {safeIndex + 1}/{liveSteps.length}
              </div>
            </div>
          </div>

          <GuideCard
            icon={Compass}
            title={dict.guide}
            accentColor="var(--ok-tour-accent)"
            primary={normalizeTourItems(step?.now)}
            secondary={normalizeTourItems(step?.next)}
          />

          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={closeTour}
              className="rounded-md px-3 py-1.5 text-xs font-medium transition-colors hover:opacity-90 active:opacity-80"
              style={{
                background: 'color-mix(in srgb, var(--ok-tour-bg) 92%, var(--ok-tour-text) 8%)',
                color: 'var(--ok-tour-text)',
                border: '1px solid var(--ok-tour-border)'
              }}
            >
              {dict.close}
            </button>

            {canNext ? (
              <button
                type="button"
                onClick={() => {
                  const steps = modelStepsRef.current ?? []
                  const maxIndex = steps.length - 1
                  const rawNext = clamp(safeIndex + 1, 0, maxIndex)
                  const nextIndex = rawNext
                  const nextStep = steps[nextIndex]
                  const tab = focusTabForSelector(nextStep?.selector)
                  if (tab) hardwareMockTourBus.emit('tour.focus', { tab, stepId: nextStep?.id ?? null })
                  emitStepChanged(steps, nextIndex)
                  currentStepRef.current = nextIndex
                  setCurrentStep(nextIndex)
                }}
                className="ok-tour-next rounded-md px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-95 active:opacity-80"
                style={{
                  background: 'var(--ok-tour-accent)',
                  boxShadow: '0 8px 18px rgba(0, 184, 18, 0.25)'
                }}
              >
                <span>{locale === 'en' ? 'Next' : '下一步'}</span>
                <span className="ok-tour-next-icon" aria-hidden="true">→</span>
              </button>
            ) : isLast ? (
              <button
                type="button"
                onClick={closeTour}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-95 active:opacity-80"
                style={{
                  background: 'var(--ok-tour-accent)',
                  boxShadow: '0 8px 18px rgba(0, 184, 18, 0.25)'
                }}
              >
                {locale === 'en' ? 'Done' : '完成'}
              </button>
            ) : isEvent ? (
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium"
                style={{
                  background: 'color-mix(in srgb, var(--ok-tour-bg) 92%, var(--ok-tour-text) 8%)',
                  color: 'var(--ok-tour-muted)',
                  border: '1px solid var(--ok-tour-border)',
                  opacity: 0.9
                }}
              >
                <span
                  className="inline-flex h-1.5 w-1.5 rounded-full"
                  style={{ background: 'color-mix(in srgb, var(--ok-tour-muted) 75%, var(--ok-tour-text) 25%)' }}
                />
                {locale === 'en' ? 'Waiting…' : '等待操作…'}
              </button>
            ) : null}
          </div>

        </div>
      )
    }
  }))
}

export function HardwareMockTour({ locale = 'zh', enabled, onExit }) {
  const dict = useMemo(() => getDict(locale), [locale])
  const modelStepsRef = useRef(createWaitingModelSteps(locale))
  const currentStepRef = useRef(0)
  const lastEventRef = useRef(null)
  const eventLogRef = useRef([])

  return (
    <PortalTourProvider
      steps={createReactourSteps({ locale, dict, modelStepsRef, lastEventRef, currentStepRef, eventLogRef, onExit })}
      defaultOpen={false}
      showBadge={false}
      showDots={false}
      disableInteraction={false}
      onClickMask={() => {}}
      styles={{
        maskWrapper: (base) => ({ ...base, zIndex: 9999 }),
        popover: (base) => ({
          ...base,
          zIndex: 10000,
          width: 'min(380px, calc(100vw - 24px))',
          maxWidth: 'min(380px, calc(100vw - 24px))',
          maxHeight: 'min(520px, calc(100vh - 80px))',
          overflowX: 'hidden',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          wordBreak: 'break-word',
          borderRadius: 12,
          padding: 12,
          backgroundColor: 'var(--ok-tour-bg)',
          backgroundImage: 'none',
          border: '1px solid var(--ok-tour-border)',
          boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)'
        }),
        badge: (base) => ({ ...base, display: 'none' }),
        dot: (base) => ({ ...base, display: 'none' }),
        close: (base) => ({ ...base, display: 'none' }),
        controls: (base) => ({ ...base, display: 'none' })
      }}
    >
      <HardwareMockTourEventBridge
        enabled={enabled}
        locale={locale}
        dict={dict}
        modelStepsRef={modelStepsRef}
        lastEventRef={lastEventRef}
        currentStepRef={currentStepRef}
        eventLogRef={eventLogRef}
        onExit={onExit}
      />
    </PortalTourProvider>
  )
}

function HardwareMockTourEventBridge({
  enabled,
  locale,
  dict,
  modelStepsRef,
  lastEventRef,
  currentStepRef,
  eventLogRef,
  onExit
}) {
  const { setIsOpen, setCurrentStep, currentStep, setSteps } = useTour()
  const onExitRef = useRef(onExit)
  const focusElRef = useRef(null)

  useEffect(() => {
    onExitRef.current = onExit
  }, [onExit])

  useEffect(() => {
    const steps = modelStepsRef.current ?? []
    const maxIndex = steps.length - 1
    currentStepRef.current = clamp(typeof currentStep === 'number' ? currentStep : 0, 0, maxIndex)
  }, [currentStep, currentStepRef, modelStepsRef])

  useEffect(() => {
    if (!enabled) {
      if (focusElRef.current) {
        focusElRef.current.classList.remove('ok-tour-focus')
        focusElRef.current = null
      }
      return
    }

    const steps = modelStepsRef.current ?? []
    const maxIndex = Math.max(0, steps.length - 1)
    const safeIndex = clamp(typeof currentStep === 'number' ? currentStep : 0, 0, maxIndex)
    const selector = steps[safeIndex]?.selector
    const nextEl = selector ? document.querySelector(selector) : null

    if (focusElRef.current && focusElRef.current !== nextEl) {
      focusElRef.current.classList.remove('ok-tour-focus')
      focusElRef.current = null
    }

    if (nextEl && nextEl instanceof HTMLElement) {
      nextEl.classList.add('ok-tour-focus')
      focusElRef.current = nextEl
    }

    return () => {
      if (focusElRef.current) {
        focusElRef.current.classList.remove('ok-tour-focus')
        focusElRef.current = null
      }
    }
  }, [currentStep, enabled, modelStepsRef])

  useEffect(() => {
    if (!enabled) {
      setIsOpen(false)
      lastEventRef.current = null
      eventLogRef.current = []
      modelStepsRef.current = createWaitingModelSteps(locale)
      setSteps(
        createReactourSteps({ locale, dict, modelStepsRef, lastEventRef, currentStepRef, eventLogRef, onExit: onExitRef.current })
      )
      currentStepRef.current = 0
      setCurrentStep(0)
    }
  }, [currentStepRef, dict, enabled, lastEventRef, locale, modelStepsRef, setCurrentStep, setIsOpen, setSteps])

  useEffect(() => {
    if (!enabled) return
    // 开启导览时不弹出；仅初始化“等待开始”的步骤。真正开始由首次 command.sent 触发。
    lastEventRef.current = null
    eventLogRef.current = []
    modelStepsRef.current = createWaitingModelSteps(locale)
    setSteps(
      createReactourSteps({ locale, dict, modelStepsRef, lastEventRef, currentStepRef, eventLogRef, onExit: onExitRef.current })
    )
    currentStepRef.current = 0
    setCurrentStep(0)
    setIsOpen(false)
  }, [currentStepRef, dict, enabled, lastEventRef, locale, modelStepsRef, setCurrentStep, setIsOpen, setSteps])

  useEffect(() => {
    if (!enabled) return undefined

    function handleEvent(evt) {
      lastEventRef.current = evt
      eventLogRef.current = [...(eventLogRef.current ?? []), evt].slice(-80)
      const steps = modelStepsRef.current ?? []
      const maxIndex = steps.length - 1
      const idx = clamp(currentStepRef.current, 0, maxIndex)
      const step = steps[idx]
      if (!step) return
      if (!isEventStep(step)) return
      if (!safeExpect(step.expect, evt)) return

      const rawNext = clamp(idx + 1, 0, maxIndex)
      const next = rawNext
      const nextStep = steps[next]
      const tab = focusTabForSelector(nextStep?.selector)
      if (tab) hardwareMockTourBus.emit('tour.focus', { tab, stepId: nextStep?.id ?? null })
      emitStepChanged(steps, next)
      currentStepRef.current = next
      setCurrentStep(next)
    }

    const offCommandSent = hardwareMockTourBus.on('command.sent', (payload) => {
      const evt = { type: 'command.sent', ...payload }
      eventLogRef.current = [evt]
      modelStepsRef.current = createFlowSteps(locale, evt)
      setSteps(
        createReactourSteps({ locale, dict, modelStepsRef, lastEventRef, currentStepRef, eventLogRef, onExit: onExitRef.current })
      )
      {
        const first = modelStepsRef.current?.[0]
        const tab = focusTabForSelector(first?.selector)
        if (tab) hardwareMockTourBus.emit('tour.focus', { tab, stepId: first?.id ?? null })
        emitStepChanged(modelStepsRef.current ?? [], 0)
      }
      lastEventRef.current = evt
      currentStepRef.current = 0
      setCurrentStep(0)
      setIsOpen(true)
    })

    const offResult = hardwareMockTourBus.on('command.result', (payload) => handleEvent({ type: 'command.result', ...payload }))
    const offConfirm = hardwareMockTourBus.on('ui.confirm', (payload) => handleEvent({ type: 'ui.confirm', ...payload }))
    const offUiShown = hardwareMockTourBus.on('ui.shown', (payload) => handleEvent({ type: 'ui.shown', ...payload }))
    const offPinSubmit = hardwareMockTourBus.on('ui.pin.submit', (payload) => handleEvent({ type: 'ui.pin.submit', ...payload }))
    const offRefresh = hardwareMockTourBus.on('tour.refresh', () => {
      setSteps(
        createReactourSteps({ locale, dict, modelStepsRef, lastEventRef, currentStepRef, eventLogRef, onExit: onExitRef.current })
      )
    })
    return () => {
      offCommandSent()
      offResult()
      offConfirm()
      offUiShown()
      offPinSubmit()
      offRefresh()
    }
  }, [currentStepRef, dict, enabled, lastEventRef, locale, modelStepsRef, setCurrentStep, setIsOpen, setSteps])

  return null
}
