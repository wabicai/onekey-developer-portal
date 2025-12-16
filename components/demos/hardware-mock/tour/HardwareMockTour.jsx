'use client'

import { useEffect, useMemo, useRef } from 'react'
import { TourProvider, useTour } from '@reactour/tour'
import { hardwareMockTourBus } from './hardwareMockTourBus'

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
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

function createWaitingModelSteps(locale) {
  const isEn = locale === 'en'
  return [
    {
      id: 'waiting-start',
      selector: '[data-tour="send-button"]',
      placement: 'bottom',
      now: isEn ? 'Tour is enabled. It will start when you click Send.' : '导览已开启，但不会自动弹出；在你点击「发送命令」后才开始。',
      next: isEn ? 'Choose params freely, then click Send.' : '你可以先随意选择参数，然后点击「发送命令」。',
      expect: (evt) => evt?.type === 'command.sent'
    }
  ]
}

function createFlowSteps(locale, startEvent) {
  const isEn = locale === 'en'
  const command = startEvent?.command ?? null
  const params = startEvent?.params ?? null
  const showOnOneKey = Boolean(params?.showOnOneKey)

  if (command === 'btcGetAddress' && showOnOneKey) {
    return [
      {
        id: 'btcGetAddress-show-interaction',
        selector: '[data-tour="device-screen"]',
        placement: 'right',
        now: isEn ? 'You triggered btcGetAddress(showOnOneKey=true).' : '你触发了 btcGetAddress（showOnOneKey=true）。',
        next: isEn
          ? 'If locked, tap the device screen to unlock, then enter PIN (default: 1234). If already unlocked, you will directly see confirmation.'
          : '如果是锁屏状态，先点击设备屏幕开始解锁，然后输入 PIN（默认：1234）。如果设备已解锁，会直接进入确认界面。',
        expect: (evt) =>
          evt?.type === 'ui.pin.submit' ||
          (evt?.type === 'ui.shown' && evt?.uiType === 'confirm' && evt?.action === 'btcGetAddress')
      },
      {
        id: 'device-confirm-address',
        selector: '[data-tour="device-screen"]',
        placement: 'right',
        now: isEn ? 'Confirm the address on device.' : '在设备上确认地址（同意/Done）。',
        next: isEn ? 'Then check callback handling code.' : '确认后查看“事件/回调处理”的代码示意。',
        expect: (evt) => evt?.type === 'ui.confirm' && evt?.action === 'btcGetAddress' && evt?.approved === true
      },
      {
        id: 'callback-code',
        selector: '[data-tour="callback-code"]',
        placement: 'right',
        now: isEn ? 'This shows how to handle interactive UI callbacks conceptually.' : '这里用“伪代码”说明如何在业务层处理交互回调（PIN/Confirm）。',
        next: isEn ? 'Click “Next” to check the result output.' : '点击「下一步」再查看「结果」输出。',
        // 这里不自动推进，避免 result 很快返回导致用户来不及看回调代码
        expect: () => false
      },
      {
        id: 'result',
        selector: '[data-tour="result-panel"]',
        placement: 'top',
        now: isEn ? 'Result is ready.' : '结果已返回。',
        next: isEn ? 'You can rerun with showOnOneKey=false to compare.' : '你可以切换 showOnOneKey=false 再跑一遍对比差异。',
        expect: () => false
      }
    ]
  }

  return [
    {
      id: 'example-code',
      selector: '[data-tour="example-code"]',
      placement: 'right',
      now: isEn ? `You triggered ${command ?? 'a command'}.` : `你触发了 ${command ?? '命令'}。`,
      next: isEn ? 'This Example Code is the main integration reference.' : '这段「示例代码」是主要的接入参考。',
      expect: (evt) => evt?.type === 'command.result' && evt?.command === command
    },
    {
      id: 'result',
      selector: '[data-tour="result-panel"]',
      placement: 'top',
      now: isEn ? 'Result is ready.' : '结果已返回。',
      next: isEn ? 'You can tweak params and rerun.' : '你可以修改参数并再次发送，体验不同交互。',
      expect: () => false
    }
  ]
}

function formatEvent(evt) {
  if (!evt) return ''
  if (evt.type === 'command.sent') return `${evt.command}${evt?.params ? ` ${JSON.stringify(evt.params)}` : ''}`
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

      const showNext =
        step?.id === 'callback-code'

      return (
        <div className="w-[340px] text-sm text-zinc-900 dark:text-zinc-100">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
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
                className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                {dict.reset}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  onExit?.()
                }}
                className="rounded-md bg-zinc-900 px-2 py-1 text-xs text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                {dict.close}
              </button>
            </div>
          </div>

          {lastEvent ? (
            <div className="mt-2 rounded-lg bg-zinc-50 px-2 py-1.5 text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
              <span className="font-semibold">{dict.justTriggered}：</span>
              <span className="ml-1 font-mono">{formatEvent(lastEvent)}</span>
            </div>
          ) : null}

          <div className="mt-2">
            <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{dict.now}</div>
            <div className="mt-1">{step?.now}</div>
          </div>

          <div className="mt-2">
            <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{dict.next}</div>
            <div className="mt-1 text-zinc-700 dark:text-zinc-200">{step?.next}</div>
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
                className="rounded-md bg-[#00B812] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#00a810]"
              >
                {locale === 'en' ? 'Next' : '下一步'}
              </button>
            </div>
          ) : null}

          {mismatchHint ? (
            <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
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
    <TourProvider
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
          maxWidth: 380,
          overflow: 'hidden',
          wordBreak: 'break-word'
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
    </TourProvider>
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
