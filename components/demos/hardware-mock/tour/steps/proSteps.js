import { deviceLabel, eventStep, hintStep } from './stepHelpers'

function createProExampleSteps(locale, { command }) {
  const isEn = locale === 'en'
  return [
    hintStep({
      id: 'example-code',
      selector: '[data-tour="example-code"]',
      placement: 'right',
      now: [deviceLabel('pro', locale), `\`${command ?? '-'}\``],
      next: isEn ? 'Tap Send to start.' : '点击发送开始。'
    })
  ]
}

function createProPinSteps(locale) {
  const isEn = locale === 'en'
  return [
    eventStep({
      id: 'pin',
      selector: '[data-tour="device-screen"]',
      placement: 'right',
      now: isEn ? 'PIN requested.' : '已请求 PIN。',
      next: isEn ? 'Complete the PIN request to continue.' : '完成 PIN 后继续。',
      expect: (evt) => evt?.type === 'ui.pin.submit'
    })
  ]
}

function createProRequestButtonHintSteps(locale, { command, showOnOneKey }) {
  const isEn = locale === 'en'
  const isGetAddress = command === 'btcGetAddress'
  const condition = isGetAddress ? `showOnOneKey=${String(Boolean(showOnOneKey))}` : null
  return [
    hintStep({
      id: 'callback-request-button',
      selector: '[data-tour="callback-code"]',
      placement: 'right',
      now: isEn
        ? `UI_EVENT: REQUEST_BUTTON${condition ? ` (${condition})` : ''}`
        : `UI_EVENT：REQUEST_BUTTON${condition ? `（${condition}）` : ''}`,
      next: isEn ? 'Confirm on device.' : '在设备上确认。',
    })
  ]
}

function createProConfirmAndWaitSteps(locale) {
  const isEn = locale === 'en'
  return [
    eventStep({
      id: 'confirm',
      selector: '[data-tour="device-screen"]',
      placement: 'right',
      now: isEn ? 'Confirmation required.' : '需要设备确认。',
      next: isEn ? 'Confirm on device.' : '在设备上确认。',
      expect: (evt) => evt?.type === 'command.result'
    })
  ]
}

function createProWaitResultSteps(locale) {
  const isEn = locale === 'en'
  return [
    eventStep({
      id: 'wait-result',
      selector: '[data-tour="result-panel"]',
      placement: 'top',
      now: isEn ? 'Waiting for result…' : '等待返回结果…',
      next: isEn ? 'Result shows here.' : '结果显示在这里。',
      expect: (evt) => evt?.type === 'command.result'
    })
  ]
}

function createProResultSteps(locale, { hasNext = false } = {}) {
  const isEn = locale === 'en'
  return [
    hintStep({
      id: 'result',
      selector: '[data-tour="result-panel"]',
      placement: 'top',
      now: isEn ? 'Result payload ready.' : '结果 payload 已就绪。',
      next: isEn
        ? hasNext
          ? 'Open callbacks template.'
          : 'Close the tour.'
        : hasNext
          ? '查看回调模板。'
          : '关闭导览。'
    })
  ]
}

function createProCallbackTemplateSteps(locale) {
  const isEn = locale === 'en'
  return [
    hintStep({
      id: 'callback-code',
      selector: '[data-tour="callback-code"]',
      placement: 'right',
      now: isEn
        ? 'Callbacks template (Pro).'
        : '回调模板（Pro）。',
      next: isEn ? 'Close when ready.' : '浏览后关闭即可。'
    })
  ]
}

export function createProInteractiveSteps(locale, { command, showOnOneKey }) {
  const isGetAddress = command === 'btcGetAddress'
  const requiresConfirm = command === 'btcSignMessage' || (isGetAddress && Boolean(showOnOneKey))

  if (requiresConfirm) {
    return [
      ...createProExampleSteps(locale, { command }),
      ...createProPinSteps(locale),
      ...createProRequestButtonHintSteps(locale, { command, showOnOneKey }),
      ...createProConfirmAndWaitSteps(locale),
      ...createProResultSteps(locale, { hasNext: false })
    ]
  }

  return [
    ...createProExampleSteps(locale, { command }),
    ...createProPinSteps(locale),
    ...createProWaitResultSteps(locale),
    ...createProResultSteps(locale, { hasNext: true }),
    ...createProCallbackTemplateSteps(locale)
  ]
}
