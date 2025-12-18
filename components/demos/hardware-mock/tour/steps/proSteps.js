import { deviceLabel, eventStep, hintStep } from './stepHelpers'

function createProExampleSteps(locale, { command }) {
  const isEn = locale === 'en'
  return [
    hintStep({
      id: 'example-code',
      selector: '[data-tour="example-code"]',
      placement: 'right',
      now: [deviceLabel('pro', locale), `\`${command ?? '-'}\``],
      next: isEn ? ['Click “Next”', 'Enter PIN on the device'] : ['点击「下一步」', '在设备上输入 PIN']
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
      next: isEn
        ? ['Enter any 4 digits (not validated in mock)', 'This step advances automatically']
        : ['输入任意 4 位数字（Mock 不校验）', '此步骤会自动推进'],
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
      next: isEn
        ? ['Hint-style callback (usually no `uiResponse`)', 'Click “Next”, then confirm on the device']
        : ['提示类回调：通常不需要 `uiResponse`', '点击「下一步」，然后去设备完成确认']
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
      next: isEn
        ? ['No “Next” on this step', 'Confirm on device; advances when the result returns']
        : ['本步骤不需要「下一步」', '在设备上完成确认，结果返回后自动推进'],
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
      next: isEn ? ['No need to click “Next”', 'Advances when the result returns'] : ['无需点「下一步」', '结果返回后会自动推进'],
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
          ? ['Click “Next” to check the callbacks template']
          : ['You can close the tour now']
        : hasNext
          ? ['点击「下一步」查看 UI_EVENT 回调处理模板']
          : ['到这里就完成了，你可以关闭导览']
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
        ? ['Callbacks template (Pro)', 'No `REQUEST_PIN`; focus on `REQUEST_BUTTON` / `CLOSE_UI_WINDOW`']
        : ['回调处理模板（Pro）', '不会触发 `REQUEST_PIN`；重点看 `REQUEST_BUTTON` / `CLOSE_UI_WINDOW`'],
      next: isEn
        ? ['`REQUEST_BUTTON` happens when the confirm screen is shown (not the end)', 'You can close the tour now']
        : ['`REQUEST_BUTTON` 发生在确认页出现时（不是最后一步）', '到这里就完成了，你可以关闭导览']
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
