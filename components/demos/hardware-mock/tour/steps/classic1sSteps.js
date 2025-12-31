import { deviceLabel, eventStep, hintStep } from './stepHelpers'

function createClassic1sExampleSteps(locale, { command }) {
  const isEn = locale === 'en'
  return [
    hintStep({
      id: 'example-code',
      selector: '[data-tour="example-code"]',
      placement: 'right',
      now: [deviceLabel('classic1s', locale), `\`${command ?? '-'}\``],
      next: isEn ? 'Tap Send to start.' : '点击发送开始。'
    })
  ]
}

function createClassic1sMatrixAndModalHintSteps(locale) {
  const isEn = locale === 'en'
  return [
    hintStep({
      id: 'pin-matrix-and-modal',
      selector: '[data-tour="classic-pin-group"]',
      placement: 'right',
      now: isEn ? 'PIN matrix shown.' : 'PIN 矩阵已显示。',
      next: isEn ? 'Use the PIN panel on the right.' : '在右侧 PIN 面板输入。'
    })
  ]
}

function createClassic1sPinSteps(locale) {
  const isEn = locale === 'en'
  return [
    eventStep({
      id: 'pin',
      selector: '[data-tour="classic-pin-group"]',
      placement: 'right',
      now: isEn ? 'PIN requested.' : '已请求 PIN。',
      next: isEn ? 'Submit any 4 digits in the PIN panel.' : '在 PIN 面板输入任意 4 位并提交。',
      expect: (evt) => evt?.type === 'ui.pin.submit'
    })
  ]
}

function createClassic1sRequestButtonHintSteps(locale, { command, showOnOneKey }) {
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

function createClassic1sConfirmAndWaitSteps(locale) {
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

function createClassic1sWaitResultSteps(locale) {
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

function createClassic1sResultSteps(locale, { hasNext = false } = {}) {
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
          : '关闭导览。',
    })
  ]
}

function createClassic1sCallbackTemplateSteps(locale) {
  const isEn = locale === 'en'
  return [
    hintStep({
      id: 'callback-code',
      selector: '[data-tour="callback-code"]',
      placement: 'right',
      now: isEn
        ? 'Callbacks template (Classic 1s / Pure).'
        : '回调模板（Classic 1s / Pure）。',
      next: isEn ? 'Close when ready.' : '浏览后关闭即可。'
    })
  ]
}

export function createClassic1sInteractiveSteps(locale, { command, showOnOneKey }) {
  const isGetAddress = command === 'btcGetAddress'
  const requiresConfirm = command === 'btcSignMessage' || (isGetAddress && Boolean(showOnOneKey))

  if (requiresConfirm) {
    return [
      ...createClassic1sExampleSteps(locale, { command }),
      ...createClassic1sMatrixAndModalHintSteps(locale),
      ...createClassic1sPinSteps(locale),
      ...createClassic1sRequestButtonHintSteps(locale, { command, showOnOneKey }),
      ...createClassic1sConfirmAndWaitSteps(locale),
      ...createClassic1sResultSteps(locale, { hasNext: false })
    ]
  }

  return [
    ...createClassic1sExampleSteps(locale, { command }),
    ...createClassic1sMatrixAndModalHintSteps(locale),
    ...createClassic1sPinSteps(locale),
    ...createClassic1sWaitResultSteps(locale),
    ...createClassic1sResultSteps(locale, { hasNext: true }),
    ...createClassic1sCallbackTemplateSteps(locale)
  ]
}
