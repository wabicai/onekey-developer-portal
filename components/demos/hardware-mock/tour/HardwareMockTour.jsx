'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Tour, TourContext, useTour } from '@reactour/tour'
import { hardwareMockTourBus } from './hardwareMockTourBus'

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
    tourTitle: isEn ? 'Hardware Mock tour' : '硬件 Mock 导览',
    justTriggered: isEn ? 'Just triggered' : '刚刚触发',
    now: isEn ? 'What happened' : '现在发生了什么',
    next: isEn ? 'What you should do' : '你需要做什么',
    reset: isEn ? 'Reset' : '重置导览',
    close: isEn ? 'Close' : '关闭导览',
    step: isEn ? 'Step' : '步骤'
  }
}

function truncateText(text, maxLen = 120) {
  const s = String(text ?? '')
  if (s.length <= maxLen) return s
  return `${s.slice(0, Math.max(0, maxLen - 1))}…`
}

function createWaitingModelSteps(locale) {
  const isEn = locale === 'en'
  return [
    {
      id: 'waiting-start',
      selector: '[data-tour="send-button"]',
      placement: 'bottom',
      now: isEn
        ? 'Tour is enabled. It will only start after you click “Send”.'
        : '导览已开启，但不会自动弹出；只有在你点击「发送命令」后才开始。',
      next: isEn
        ? 'Pick a command/params, then click “Send” to experience the full interaction flow.'
        : '先选择命令与参数，然后点击「发送命令」来完整体验一次交互流程。',
      expect: (evt) => evt?.type === 'command.sent'
    }
  ]
}

function createFlowSteps(locale, startEvent) {
  const isEn = locale === 'en'
  const command = startEvent?.command ?? null
  const params = startEvent?.params ?? null
  const showOnOneKey = Boolean(params?.showOnOneKey)

  const base = [
    {
      id: 'example-code',
      selector: '[data-tour="example-code"]',
      placement: 'right',
      now: isEn
        ? `You just triggered ${command ?? 'a command'}.`
        : `你刚刚触发了 ${command ?? '命令'}。`,
      next: isEn
        ? 'Focus on this call: it decides whether an interactive flow (PIN / confirm on device) will happen.'
        : '先看这次调用：它决定是否会进入「需要你处理 UI_EVENT / 设备确认」的交互流程。',
      manual: true,
      expect: () => false
    }
  ]

  if (command === 'btcGetAddress' && showOnOneKey) {
    return [
      ...base,
      {
        id: 'unlock-or-pin',
        selector: '[data-tour="device-screen"]',
        placement: 'right',
        now: isEn
          ? 'The SDK may request input (PIN) to unlock the device.'
          : 'SDK 可能会发起“需要输入”的请求（如 PIN 解锁）。',
        next: isEn
          ? 'In this demo: tap the device screen and enter PIN=1111. In real apps: show a PIN UI, then call uiResponse(RECEIVE_PIN).'
          : '在本 Demo：点击设备屏幕并输入 PIN=1111；在真实业务：弹出 PIN 输入 UI，然后调用 uiResponse(RECEIVE_PIN)。',
        manual: true,
        expect: () => false
      },
      {
        id: 'confirm-on-device',
        selector: '[data-tour="device-screen"]',
        placement: 'right',
        now: isEn
          ? 'Next, the device requires confirmation (on-device approve).'
          : '接着会进入“需要在设备上确认”的阶段（设备同意/拒绝）。',
        next: isEn
          ? 'Approve on the device. Typically you only show a hint UI; no uiResponse is needed for hint-only events.'
          : '在设备上点同意。一般只需要在应用里提示用户去设备确认；提示类事件通常不需要 uiResponse。',
        expect: (evt) => evt?.type === 'ui.confirm' && evt?.action === 'btcGetAddress' && evt?.approved === true
      },
      {
        id: 'callback-code',
        selector: '[data-tour="callback-code"]',
        placement: 'right',
        now: isEn
          ? 'Here is the real UI_EVENT wiring pattern (handle REQUEST_* and reply via uiResponse when needed).'
          : '这里是“真实的 UI_EVENT 接线方式”：收到 REQUEST_* 后，输入类要 uiResponse，提示类只展示 UI。',
        next: isEn
          ? 'Notice the breakpoint: it marks the current request type (PIN vs confirm hint).'
          : '注意左侧断点：它只标记当前正在发生的请求类型（PIN / 设备确认提示）。',
        manual: true,
        expect: () => false
      },
      {
        id: 'result',
        selector: '[data-tour="result-panel"]',
        placement: 'top',
        now: isEn
          ? 'Finally, you get the result payload (address / error).'
          : '最后你会拿到返回结果（地址 / 错误信息）。',
        next: isEn
          ? 'Try showOnOneKey=false: the result returns directly without interactive UI_EVENT.'
          : '你可以切换 showOnOneKey=false：通常不会有交互 UI_EVENT，直接返回结果。',
        manual: true,
        expect: () => false
      }
    ]
  }

  if (command === 'btcGetAddress' && !showOnOneKey) {
    return [
      {
        id: 'example-code',
        selector: '[data-tour="example-code"]',
        placement: 'right',
        now: isEn
          ? 'You triggered btcGetAddress(showOnOneKey=false).'
          : '你触发了 btcGetAddress（showOnOneKey=false）。',
        next: isEn
          ? 'This usually skips on-device confirmation, so interactive UI_EVENT is typically not emitted (your app just waits for the result).'
          : '这通常会跳过“设备上显示并确认”，所以一般不会触发需要你处理的 UI_EVENT（应用直接等待结果）。',
        manual: true,
        expect: () => false
      },
      {
        id: 'result',
        selector: '[data-tour="result-panel"]',
        placement: 'top',
        now: isEn ? 'Result returns directly.' : '结果会直接返回。',
        next: isEn
          ? 'Try showOnOneKey=true to experience the full interactive flow (PIN / confirm on device / UI_EVENT wiring).'
          : '你可以切换 showOnOneKey=true，再体验完整交互链路（PIN / 设备确认 / UI_EVENT 接线）。',
        manual: true,
        expect: () => false
      }
    ]
  }

  if (command === 'btcSignMessage') {
    return [
      ...base,
      {
        id: 'unlock-or-pin',
        selector: '[data-tour="device-screen"]',
        placement: 'right',
        now: isEn ? 'Signing may also require unlock/PIN input.' : '签名流程也可能先要求解锁 / PIN 输入。',
        next: isEn
          ? 'In this demo: enter PIN=1111 if prompted. In real apps: handle UI_REQUEST.REQUEST_PIN and reply via uiResponse.'
          : '在本 Demo：如果出现 PIN 就输入 1111；在真实业务：处理 UI_REQUEST.REQUEST_PIN，并用 uiResponse 回复。',
        manual: true,
        expect: () => false
      },
      {
        id: 'confirm-on-device',
        selector: '[data-tour="device-screen"]',
        placement: 'right',
        now: isEn ? 'Then confirm the signing on device.' : '随后在设备上确认签名。',
        next: isEn ? 'Approve on the device to finish signing.' : '在设备上点同意，完成签名。',
        expect: (evt) => evt?.type === 'ui.confirm' && evt?.action === 'btcSignMessage' && evt?.approved === true
      },
      {
        id: 'callback-code',
        selector: '[data-tour="callback-code"]',
        placement: 'right',
        now: isEn ? 'UI_EVENT wiring is the same pattern as above.' : 'UI_EVENT 的处理模式与上面一致。',
        next: isEn ? 'Breakpoints show the current UI request being processed.' : '断点会标记当前正在处理的 UI 请求。',
        manual: true,
        expect: () => false
      },
      {
        id: 'result',
        selector: '[data-tour="result-panel"]',
        placement: 'top',
        now: isEn ? 'Result contains signature payload.' : '结果会包含签名 payload。',
        next: isEn ? 'Rerun to observe differences with other params.' : '你可以再跑一遍观察不同参数下的差异。',
        manual: true,
        expect: () => false
      }
    ]
  }

  return [
    ...base,
    {
      id: 'result',
      selector: '[data-tour="result-panel"]',
      placement: 'top',
      now: isEn ? 'Result is ready.' : '结果已返回。',
      next: isEn ? 'Tweak params and rerun to compare outputs.' : '你可以修改参数并再次发送，体验不同返回结果。',
      manual: true,
      expect: () => false
    }
  ]
}

function formatEvent(evt) {
  if (!evt) return ''
  if (evt.type === 'command.sent') {
    const params = evt?.params ? ` ${truncateText(JSON.stringify(evt.params))}` : ''
    return `${evt.command}${params}`
  }
  if (evt.type === 'command.changed') return `command=${evt.command}`
  if (evt.type === 'param.changed') return `${evt.key}=${String(evt.value)}`
  if (evt.type === 'command.result') {
    const title = evt?.log?.title ? ` ${evt.log.title}` : ''
    return `${evt.command ?? 'unknown'}${title}`
  }
  if (evt.type === 'code.updated') return `exampleCode updated (${evt.command ?? 'unknown'})`
  if (evt.type === 'code.copied') return `exampleCode copied (${evt.command ?? 'unknown'})`
  if (evt.type === 'ui.confirm') return `ui.confirm ${evt.action ?? ''} approved=${String(Boolean(evt.approved))}`
  if (evt.type === 'ui.shown') return `ui.shown type=${evt.uiType ?? ''} action=${evt.action ?? ''}`
  if (evt.type === 'ui.unlock.tap') return 'ui.unlock.tap'
  if (evt.type === 'ui.pin.submit') return `ui.pin.submit len=${String(evt.pinLength ?? '')}`
  return evt.type
}

function focusTabForSelector(selector) {
  if (selector === '[data-tour="example-code"]') return 'example'
  if (selector === '[data-tour="device-screen"]') return 'callback'
  if (selector === '[data-tour="callback-code"]') return 'callback'
  if (selector === '[data-tour="result-panel"]') return 'result'
  return null
}

function createReactourSteps({ locale, dict, modelStepsRef, lastEventRef, currentStepRef, onExit }) {
  const steps = modelStepsRef.current ?? []
  return steps.map((s) => ({
    selector: s.selector,
    position: s.placement,
    content: ({ currentStep, setCurrentStep, setIsOpen }) => {
      const liveSteps = modelStepsRef.current ?? []
      const maxIndex = liveSteps.length - 1
      const safeIndex = clamp(typeof currentStep === 'number' ? currentStep : 0, 0, maxIndex)
      currentStepRef.current = safeIndex
      const step = liveSteps[safeIndex]
      const lastEvent = lastEventRef.current

      const mismatchHint = (() => {
        if (!lastEvent) return null
        if (!step || step.id === 'done') return null
        if (step.expect?.(lastEvent)) return null
        if (lastEvent.type !== 'command.sent' && lastEvent.type !== 'command.changed' && lastEvent.type !== 'param.changed') return null
        return locale === 'en'
          ? `This tour expects: ${step.id}. You can reset if needed.`
          : `你当前触发的操作与预期步骤不一致（预期：${step.id}）。如需从头体验可点「重置导览」。`
      })()

      const showNext = Boolean(step?.manual)

      return (
        <div
          className="text-sm"
          style={{
            width: 'min(340px, calc(100vw - 48px))',
            color: 'var(--ok-tour-text)',
            fontFamily: 'var(--font-ui)'
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-semibold" style={{ color: 'var(--ok-tour-muted)' }}>
              {dict.tourTitle} · {dict.step} {safeIndex + 1}/{liveSteps.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  lastEventRef.current = null
                  currentStepRef.current = 0
                  setCurrentStep(0)
                }}
                className="rounded-md border px-2 py-1 text-xs transition-colors"
                style={{
                  borderColor: 'var(--ok-tour-border)',
                  background: 'color-mix(in srgb, var(--ok-tour-bg) 96%, transparent)',
                  color: 'var(--ok-tour-muted)'
                }}
              >
                {dict.reset}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  onExit?.()
                }}
                className="rounded-md px-2 py-1 text-xs font-medium transition-colors"
                style={{
                  background: 'var(--ok-tour-text)',
                  color: 'var(--ok-tour-bg)'
                }}
              >
                {dict.close}
              </button>
            </div>
          </div>

          {lastEvent ? (
            <div
              className="mt-2 rounded-lg border px-2 py-1.5 text-xs"
              style={{
                borderColor: 'var(--ok-tour-border)',
                background: 'color-mix(in srgb, var(--ok-tour-bg) 92%, var(--ok-tour-text) 8%)',
                color: 'var(--ok-tour-muted)'
              }}
            >
              <span className="font-semibold" style={{ color: 'var(--ok-tour-text)' }}>
                {dict.justTriggered}：
              </span>
              <span className="ml-1 font-mono" style={{ color: 'var(--ok-tour-text)' }}>
                {formatEvent(lastEvent)}
              </span>
            </div>
          ) : null}

          <div className="mt-2">
            <div className="text-xs font-semibold" style={{ color: 'var(--ok-tour-muted)' }}>
              {dict.now}
            </div>
            <div className="mt-1">{step?.now}</div>
          </div>

          <div className="mt-2">
            <div className="text-xs font-semibold" style={{ color: 'var(--ok-tour-muted)' }}>
              {dict.next}
            </div>
            <div className="mt-1" style={{ color: 'var(--ok-tour-text)' }}>
              {step?.next}
            </div>
          </div>

          {showNext ? (
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const steps = modelStepsRef.current ?? []
                  const maxIndex = steps.length - 1
                  const nextIndex = clamp(safeIndex + 1, 0, maxIndex)
                  const nextStep = steps[nextIndex]
                  const tab = focusTabForSelector(nextStep?.selector)
                  if (tab) hardwareMockTourBus.emit('tour.focus', { tab, stepId: nextStep?.id ?? null })
                  currentStepRef.current = nextIndex
                  setCurrentStep(nextIndex)
                }}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-white"
                style={{ background: 'var(--ok-tour-accent)' }}
              >
                {locale === 'en' ? 'Next' : '下一步'}
              </button>
            </div>
          ) : null}

          {mismatchHint ? (
            <div
              className="mt-2 rounded-lg border px-2 py-1.5 text-xs"
              style={{
                borderColor: 'color-mix(in srgb, var(--ok-tour-border) 60%, #f59e0b 40%)',
                background: 'color-mix(in srgb, var(--ok-tour-bg) 86%, #f59e0b 14%)',
                color: 'var(--ok-tour-text)'
              }}
            >
              {mismatchHint}
            </div>
          ) : null}
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

  return (
    <PortalTourProvider
      steps={createReactourSteps({ locale, dict, modelStepsRef, lastEventRef, currentStepRef, onExit })}
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
          overflow: 'hidden',
          wordBreak: 'break-word',
          borderRadius: 12,
          padding: 12,
          backgroundColor: 'var(--ok-tour-bg)',
          border: '1px solid var(--ok-tour-border)',
          boxShadow: 'var(--ok-tour-shadow)'
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
        onExit={onExit}
      />
    </PortalTourProvider>
  )
}

function HardwareMockTourEventBridge({ enabled, locale, dict, modelStepsRef, lastEventRef, currentStepRef, onExit }) {
  const { setIsOpen, setCurrentStep, currentStep, isOpen, setSteps } = useTour()
  const startedRef = useRef(false)
  const sessionCommandRef = useRef(null)
  const onExitRef = useRef(onExit)

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
      setIsOpen(false)
      startedRef.current = false
      sessionCommandRef.current = null
      lastEventRef.current = null
      modelStepsRef.current = createWaitingModelSteps(locale)
      setSteps(createReactourSteps({ locale, dict, modelStepsRef, lastEventRef, currentStepRef, onExit: onExitRef.current }))
      currentStepRef.current = 0
      setCurrentStep(0)
    }
  }, [currentStepRef, dict, enabled, lastEventRef, locale, modelStepsRef, setCurrentStep, setIsOpen, setSteps])

  useEffect(() => {
    if (!enabled) return
    // 开启导览时不弹出；仅初始化“等待开始”的步骤。真正开始由首次 command.sent 触发。
    startedRef.current = false
    sessionCommandRef.current = null
    lastEventRef.current = null
    modelStepsRef.current = createWaitingModelSteps(locale)
    setSteps(createReactourSteps({ locale, dict, modelStepsRef, lastEventRef, currentStepRef, onExit: onExitRef.current }))
    currentStepRef.current = 0
    setCurrentStep(0)
    setIsOpen(false)
  }, [currentStepRef, dict, enabled, lastEventRef, locale, modelStepsRef, setCurrentStep, setIsOpen, setSteps])

  useEffect(() => {
    if (!enabled) return undefined

    function handleEvent(evt) {
      lastEventRef.current = evt
      const steps = modelStepsRef.current ?? []
      const maxIndex = steps.length - 1
      const idx = clamp(currentStepRef.current, 0, maxIndex)
      const step = steps[idx]
      // 当前步骤是“手动讲解步骤”（通过气泡里的“下一步”推进）时，不允许事件跳转以免直接跳过关键步骤。
      if (step?.manual) return
      if (step?.expect?.(evt)) {
        const next = clamp(idx + 1, 0, maxIndex)
        const nextStep = steps[next]
        const tab = focusTabForSelector(nextStep?.selector)
        if (tab) hardwareMockTourBus.emit('tour.focus', { tab, stepId: nextStep?.id ?? null })
        currentStepRef.current = next
        setCurrentStep(next)
        return
      }

      const matchedIndex = steps.findIndex((s) => s?.expect?.(evt))
      if (matchedIndex >= 0) {
        const next = clamp(matchedIndex + 1, 0, maxIndex)
        const nextStep = steps[next]
        const tab = focusTabForSelector(nextStep?.selector)
        if (tab) hardwareMockTourBus.emit('tour.focus', { tab, stepId: nextStep?.id ?? null })
        currentStepRef.current = next
        setCurrentStep(next)
      }
    }

    const offCommandSent = hardwareMockTourBus.on('command.sent', (payload) => {
      const evt = { type: 'command.sent', ...payload }
      const nextCommand = evt?.command ?? null

      if (!startedRef.current || (sessionCommandRef.current && sessionCommandRef.current !== nextCommand)) {
        startedRef.current = true
        sessionCommandRef.current = nextCommand
        modelStepsRef.current = createFlowSteps(locale, evt)
        setSteps(createReactourSteps({ locale, dict, modelStepsRef, lastEventRef, currentStepRef, onExit: onExitRef.current }))
        {
          const first = modelStepsRef.current?.[0]
          const tab = focusTabForSelector(first?.selector)
          if (tab) hardwareMockTourBus.emit('tour.focus', { tab, stepId: first?.id ?? null })
        }
        lastEventRef.current = evt
        currentStepRef.current = 0
        setCurrentStep(0)
        setIsOpen(true)
        return
      }

      handleEvent(evt)
    })

    const offResult = hardwareMockTourBus.on('command.result', (payload) => handleEvent({ type: 'command.result', ...payload }))
    const offConfirm = hardwareMockTourBus.on('ui.confirm', (payload) => handleEvent({ type: 'ui.confirm', ...payload }))
    const offUiShown = hardwareMockTourBus.on('ui.shown', (payload) => handleEvent({ type: 'ui.shown', ...payload }))
    const offPinSubmit = hardwareMockTourBus.on('ui.pin.submit', (payload) => handleEvent({ type: 'ui.pin.submit', ...payload }))

    return () => {
      offCommandSent()
      offResult()
      offConfirm()
      offUiShown()
      offPinSubmit()
    }
  }, [currentStepRef, dict, enabled, lastEventRef, locale, modelStepsRef, setCurrentStep, setIsOpen, setSteps])

  return null
}
