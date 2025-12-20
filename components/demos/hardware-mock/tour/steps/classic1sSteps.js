import { deviceLabel, eventStep, hintStep } from './stepHelpers'

function createClassic1sExampleSteps(locale, { command }) {
  const isEn = locale === 'en'
  return [
    hintStep({
      id: 'example-code',
      selector: '[data-tour="example-code"]',
      placement: 'right',
      now: [deviceLabel('classic1s', locale), `\`${command ?? '-'}\``],
      next: isEn ? 'Click “Next” to continue.' : '点击「下一步」继续。'
    })
  ]
}

function createClassic1sMatrixAndModalHintSteps(locale) {
  const isEn = locale === 'en'
  return [
    hintStep({
      id: 'pin-matrix-and-modal',
      selector: '[data-tour="device-screen"]',
      placement: 'right',
      now: isEn ? 'Classic 1s PIN matrix & modal overview.' : 'Classic 1s PIN 矩阵与输入弹窗。',
      next: isEn ? 'Click “Next” to open the PIN dialog.' : '点击「下一步」打开 PIN 弹窗。'
    })
  ]
}

function createClassic1sPinSteps(locale) {
  const isEn = locale === 'en'
  return [
    eventStep({
      id: 'pin',
      selector: '[data-tour="classic-pin-modal"], [data-tour="device-screen"]',
      placement: 'right',
      now: isEn ? 'Enter PIN (Classic 1s).' : '请输入 PIN（Classic 1s）。',
      next: isEn
        ? 'Enter any 4 digits (mock) and submit; switch to device input if needed.'
        : '输入任意 4 位（Mock），也可切换到设备输入，提交后自动推进。',
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
      next: isEn ? 'Confirm on the device; `uiResponse` is usually not required.' : '在设备上确认，一般不会调用 `uiResponse`。',
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
      now: isEn ? 'Confirm on device.' : '请在设备上确认。',
      next: isEn ? 'Confirm with buttons; the tour waits for the result.' : '用按键完成确认；结果返回后自动推进。',
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
      next: isEn ? 'Result appears automatically.' : '结果会自动显示在此。',
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
      now: isEn ? 'Here is the final result payload.' : '这里是最终返回结果（payload）。',
      next: isEn
        ? hasNext
          ? 'Next: review the callbacks template.'
          : 'Tour complete—close when ready.'
        : hasNext
          ? '下一步：查看 UI_EVENT 回调模板。'
          : '导览完成，可关闭。',
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
        ? 'Callbacks template (Classic 1s / Pure). Expect `REQUEST_PIN` and `REQUEST_BUTTON`.'
        : '回调模板（Classic 1s / Pure）：可能触发 `REQUEST_PIN` 与 `REQUEST_BUTTON`。',
      next: isEn ? 'Close the tour when ready.' : '浏览完即可关闭导览。'
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
