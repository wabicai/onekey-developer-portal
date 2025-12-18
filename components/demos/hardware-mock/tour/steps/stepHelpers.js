export function hintStep({ id, selector, placement, now, next, allowNext = true }) {
  return {
    id,
    selector,
    placement,
    now,
    next,
    mode: 'hint',
    allowNext,
    expect: () => false
  }
}

export function eventStep({ id, selector, placement, now, next, expect }) {
  return {
    id,
    selector,
    placement,
    now,
    next,
    mode: 'event',
    allowNext: false,
    expect
  }
}

export function normalizeDeviceType(value) {
  return value === 'classic1s' ? 'classic1s' : 'pro'
}

export function deviceLabel(deviceType, locale) {
  const type = normalizeDeviceType(deviceType)
  if (type === 'classic1s') return locale === 'en' ? 'OneKey Classic 1s' : 'OneKey Classic 1s'
  return locale === 'en' ? 'OneKey Pro' : 'OneKey Pro'
}

