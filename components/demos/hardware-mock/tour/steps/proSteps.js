import { deviceLabel, eventStep, hintStep } from './stepHelpers'

function createProExampleSteps(locale, { command }) {
  const isEn = locale === 'en'
  return [
    hintStep({
      id: 'example-code',
      selector: '[data-tour="example-code"]',
      placement: 'right',
      now: [deviceLabel('pro', locale), `\`${command ?? '-'}\``],
      next: isEn ? 'Click “Next” after Send.' : '发送后点击「下一步」。'
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
      now: isEn ? 'Enter PIN on Pro.' : '请在 Pro 上输入 PIN。',
      next: isEn ? 'PIN submission auto-advances the tour.' : 'PIN 提交后自动推进。',
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
      next: isEn ? 'Confirm on your device; no `uiResponse` is needed.' : '在设备上确认，一般不需要 `uiResponse`。',
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
      now: isEn ? 'Confirm on device.' : '请在设备上确认。',
      next: isEn ? 'Wait for the result; the tour auto-advances.' : '等待结果返回，导览会自动推进。',
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
      next: isEn ? 'Result appears here automatically.' : '结果会自动显示在此。',
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
      now: isEn ? 'Here is the final result payload.' : '这里是最终返回结果（payload）。',
      next: isEn
        ? hasNext
          ? 'Next: review the callbacks template.'
          : 'Tour complete—close when ready.'
        : hasNext
          ? '下一步：查看 UI_EVENT 回调模板。'
          : '导览完成，可关闭。'
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
        ? 'Callbacks template (Pro). Handle `REQUEST_BUTTON` / `CLOSE_UI_WINDOW`.'
        : '回调模板（Pro）：关注 `REQUEST_BUTTON` 与 `CLOSE_UI_WINDOW`。',
      next: isEn ? 'Close the tour when ready.' : '此处浏览完即可关闭导览。'
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
