import { deviceLabel, eventStep, hintStep } from './stepHelpers'

function createClassic1sExampleSteps(locale, { command }) {
  const isEn = locale === 'en'
  return [
    hintStep({
      id: 'example-code',
      selector: '[data-tour="example-code"]',
      placement: 'right',
      now: [deviceLabel('classic1s', locale), `\`${command ?? '-'}\``],
      next: isEn ? ['Click “Next” to continue'] : ['点击「下一步」继续']
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
      now: isEn ? 'PIN matrix & input options (Classic 1s).' : 'PIN 矩阵与输入方式（Classic 1s）。',
      next: isEn
        ? [
            'PIN matrix: 0–9 (10 digits), layout: “3×3 + 1 bottom-center”',
            'Click “Next” to open the PIN dialog',
            'Enter any 4 digits'
          ]
        : ['PIN 矩阵：0~9（共 10 位，3×3 + 底部中间 1 位）', '点击「下一步」打开 PIN 弹窗', '输入任意 4 位即可提交']
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
        ? [
            'Any 4 digits work (not validated in mock)',
            'Option A: blind input in dialog (match the on-device matrix)',
            'Option B: switch to device input',
            'Advances automatically after submit'
          ]
        : ['任意 4 位即可（Mock 不校验）', '方式 A：弹窗盲输（对照设备 PIN 矩阵点击位置）', '方式 B：切换到设备输入', '提交后自动推进'],
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
      next: isEn
        ? ['Hint-style callback (usually no `uiResponse`)', 'Click “Next”, then confirm on the device']
        : ['提示类回调：通常不需要 `uiResponse`', '点击「下一步」，然后去设备完成确认']
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
      next: isEn
        ? [
            'No “Next” on this step',
            'Confirm with buttons (Enter=approve, Power=reject)',
            'Advances when the result returns'
          ]
        : ['本步骤不需要「下一步」', '使用按键确认（Enter=同意，Power=拒绝）', '结果返回后导览会自动推进'],
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
      next: isEn ? ['No need to click “Next”', 'Advances when the result returns'] : ['无需点「下一步」', '结果返回后会自动推进'],
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
          ? ['Click “Next” to check the callbacks template']
          : ['You can close the tour now']
        : hasNext
          ? ['点击「下一步」查看 UI_EVENT 回调处理模板']
          : ['到这里就完成了，你可以关闭导览']
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
        ? ['Callbacks template (Classic 1s / Pure)', '`REQUEST_PIN` may happen; focus on it with `REQUEST_BUTTON` / `CLOSE_UI_WINDOW`']
        : ['回调处理模板（Classic 1s / Pure）', '可能触发 `REQUEST_PIN`；重点看 `REQUEST_PIN` / `REQUEST_BUTTON` / `CLOSE_UI_WINDOW`'],
      next: isEn
        ? ['`REQUEST_BUTTON` happens when the confirm screen is shown (not the end)', 'You can close the tour now']
        : ['`REQUEST_BUTTON` 发生在确认页出现时（不是最后一步）', '到这里就完成了，你可以关闭导览']
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
