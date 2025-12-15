function normalizeBasePath(basePath) {
  const value = (basePath ?? '').trim()
  if (!value) return ''
  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`
  return withLeadingSlash.replace(/\/$/, '')
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  })

  const json = await response.json().catch(() => null)

  if (!response.ok) {
    const message = json?.error?.message ?? `请求失败（HTTP ${response.status}）`
    throw new Error(message)
  }

  if (!json?.ok) {
    const message = json?.error?.message ?? '请求失败（未知错误）'
    throw new Error(message)
  }

  return json.data
}

export function createMockHardwareClient({ basePath }) {
  const normalizedBasePath = normalizeBasePath(basePath)

  const api = {
    basePath: normalizedBasePath,

    async connect() {
      return postJson(`${normalizedBasePath}/__mock__/device/connect`, {})
    },

    async disconnect() {
      return postJson(`${normalizedBasePath}/__mock__/device/disconnect`, {})
    },

    async sendCommand(command, params) {
      return postJson(`${normalizedBasePath}/__mock__/device/command`, {
        command,
        params
      })
    }
  }

  api.searchDevices = async () => api.sendCommand('searchDevices')
  api.getFeatures = async (connectId) => api.sendCommand('getFeatures', { connectId })

  api.btcGetAddress = async (connectId, deviceId, params) =>
    api.sendCommand('btcGetAddress', { ...(params ?? {}), connectId, deviceId })
  api.btcSignMessage = async (connectId, deviceId, params) =>
    api.sendCommand('btcSignMessage', { ...(params ?? {}), connectId, deviceId })

  api.deviceUnlock = async (connectId, params) =>
    api.sendCommand('deviceUnlock', { ...(params ?? {}), connectId })

  api.submitPin = async (params) => api.sendCommand('submit_pin', params)
  api.confirmAction = async (params) => api.sendCommand('confirm_action', params)
  api.cancelAction = async (params) => api.sendCommand('cancel_action', params)

  return api
}
