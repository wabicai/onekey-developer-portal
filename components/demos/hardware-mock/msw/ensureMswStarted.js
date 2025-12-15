let startPromise = null

function ensureLeadingSlash(value) {
  if (!value) return ''
  return value.startsWith('/') ? value : `/${value}`
}

export async function ensureMswStarted({ basePath }) {
  if (typeof window === 'undefined') return

  if (!('serviceWorker' in navigator)) {
    throw new Error('当前浏览器不支持 Service Worker，无法启用 MSW Mock。')
  }

  if (startPromise) return startPromise

  startPromise = (async () => {
    const { worker } = await import('./browser')
    const normalizedBasePath = ensureLeadingSlash(basePath).replace(/\/$/, '')

    await worker.start({
      quiet: true,
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: `${normalizedBasePath}/mockServiceWorker.js`
      }
    })
  })()

  return startPromise
}

