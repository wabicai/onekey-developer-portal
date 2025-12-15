import { delay, http, HttpResponse } from 'msw'

function ok(data) {
  return HttpResponse.json({ ok: true, data })
}

function badRequest(message, code = 'BAD_REQUEST') {
  return HttpResponse.json(
    { ok: false, error: { code, message } },
    { status: 400 }
  )
}

function createRequestId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `req_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

function normalizePath(path) {
  if (typeof path !== 'string') return "m/44'/0'/0'/0/0"
  const value = path.trim()
  if (!value) return "m/44'/0'/0'/0/0"
  if (value.startsWith('m/')) return value
  if (value.startsWith('/')) return `m${value}`
  return `m/${value}`
}

function parseBip44Path(path) {
  const normalized = normalizePath(path)
  const parts = normalized
    .split('/')
    .map((item) => item.trim())
    .filter(Boolean)

  if (parts[0] !== 'm') return { purpose: null, coinType: null, raw: normalized }

  const hardenedInt = (value) => {
    if (!value) return null
    const cleaned = value.replace(/['hH]$/, '')
    const num = Number.parseInt(cleaned, 10)
    return Number.isFinite(num) ? num : null
  }

  return {
    raw: normalized,
    purpose: hardenedInt(parts[1]),
    coinType: hardenedInt(parts[2])
  }
}

function getNetworkMetaFromPath(path) {
  const parsed = parseBip44Path(path)
  if (parsed.coinType === 60) {
    return {
      network: 'Ethereum',
      icon: '/hardware-pro/res/evm-eth.png',
      primaryColor: '#637FFF'
    }
  }
  if (parsed.coinType === 501) {
    return {
      network: 'Solana',
      icon: '/hardware-pro/res/chain-sol.png',
      primaryColor: '#C74AE3'
    }
  }
  return {
    network: 'Bitcoin',
    icon: '/hardware-pro/res/btc-btc.png',
    primaryColor: '#FF9C00'
  }
}

function getAddrTypeFromPath(path, network) {
  const parsed = parseBip44Path(path)
  if (network === 'Bitcoin') {
    if (parsed.purpose === 49) return 'Nested Segwit'
    if (parsed.purpose === 84) return 'Native Segwit'
    if (parsed.purpose === 86) return 'Taproot'
    return 'Legacy'
  }
  if (network === 'Ethereum') {
    return 'BIP44 Standard'
  }
  if (network === 'Solana') {
    return 'BIP44 Standard'
  }
  return ''
}

function fakeAddress({ network, path }) {
  const seed = `${network}:${normalizePath(path)}`
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  if (network === 'Ethereum') {
    const hex = hash.toString(16).padStart(8, '0')
    return `0x${hex}${hex}${hex}${hex}${hex}`.slice(0, 42)
  }
  if (network === 'Solana') {
    return `So1aNaMock${hash.toString(36).padStart(20, '0')}`.slice(0, 44)
  }
  return `bc1qmock${hash.toString(36).padStart(32, '0')}`.slice(0, 42)
}

function normalizeSignTxParams(params) {
  const to =
    typeof params?.to === 'string' && params.to.trim()
      ? params.to.trim()
      : 'bc1qmockreceiverxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  const asset =
    typeof params?.asset === 'string' && params.asset.trim() ? params.asset.trim() : 'BTC'
  const amount =
    typeof params?.amount === 'string' && params.amount.trim() ? params.amount.trim() : '0.001'

  return {
    asset,
    to,
    amount
  }
}

function normalizeSignMessageParams(params) {
  const path = normalizePath(params?.path)
  const messageHex =
    typeof params?.messageHex === 'string' && params.messageHex.trim()
      ? params.messageHex.trim()
      : '6578616d706c65206d657373616765'

  return {
    path,
    messageHex
  }
}

function buildPinUi({ requestId, triesLeft = null, error = null }) {
  return {
    type: 'pin',
    requestId,
    triesLeft,
    error
  }
}

function buildConfirmUi({ requestId, action, details }) {
  return {
    type: 'confirm',
    requestId,
    action,
    details
  }
}

const session = {
  connected: false,
  unlocked: false,
  pinTriesLeft: 3,
  randomPinMap: false,
  pending: null
}

export const handlers = [
  http.post(/\/__mock__\/device\/connect\/?$/, async () => {
    await delay(450)
    session.connected = true
    session.unlocked = false
    session.pinTriesLeft = 3
    session.pending = null
    return ok({
      deviceId: 'OK-EMULATOR-001',
      model: 'OneKey Pro',
      deviceName: 'OneKey Pro',
      bleName: 'ONEKEY-EMULATOR',
      firmware: '3.0.0-mock',
      transport: 'mock',
      unlocked: session.unlocked,
      randomPinMap: session.randomPinMap
    })
  }),

  http.post(/\/__mock__\/device\/disconnect\/?$/, async () => {
    await delay(200)
    session.connected = false
    session.unlocked = false
    session.pinTriesLeft = 3
    session.pending = null
    return ok({ disconnected: true })
  }),

  http.post(/\/__mock__\/device\/command\/?$/, async ({ request }) => {
    const body = await request.json().catch(() => ({}))
    const command = body?.command
    const params = body?.params ?? {}

    if (!command || typeof command !== 'string') {
      return badRequest('command 不能为空')
    }

    if (!session.connected && command !== 'get_info' && command !== 'searchDevices') {
      return badRequest('设备未连接，请先执行 connect。', 'NOT_CONNECTED')
    }

    const commandDelay =
      command === 'btcSignMessage' || command === 'BTCsignMessage' || command === 'sign_tx' || command === 'confirm_action'
        ? 900
        : command === 'submit_pin'
          ? 450
          : 350
    await delay(commandDelay)

    switch (command) {
      case 'searchDevices': {
        session.connected = true
        return ok({
          success: true,
          payload: [
            {
              connectId: 'mock-connect-001',
              uuid: 'mock-uuid-001',
              deviceType: 'pro',
              deviceId: 'OK-EMULATOR-001',
              path: 'mock-path',
              name: 'ONEKEY-EMULATOR'
            }
          ]
        })
      }

      case 'getFeatures': {
        const connectId = typeof params?.connectId === 'string' ? params.connectId : null
        if (!connectId) return badRequest('connectId 不能为空。', 'CONNECT_ID_EMPTY')

        session.connected = true
        return ok({
          success: true,
          payload: {
            device_id: 'OK-EMULATOR-001',
            model: 'OneKey Pro',
            deviceName: 'OneKey Pro',
            bleName: 'ONEKEY-EMULATOR',
            firmware: '3.0.0-mock',
            transport: 'mock',
            unlocked: session.unlocked,
            randomPinMap: session.randomPinMap
          }
        })
      }

      case 'get_info':
        return ok({
          model: 'OneKey Pro',
          deviceName: 'OneKey Pro',
          bleName: 'ONEKEY-EMULATOR',
          firmware: '3.0.0-mock',
          features: ['mock', 'demo', 'deterministic'],
          unlocked: session.unlocked,
          randomPinMap: session.randomPinMap
        })

      case 'deviceUnlock':
      case 'unlock_device': {
        if (session.unlocked) {
          session.pending = null
          return ok({ success: true, payload: { unlocked: true }, unlocked: true })
        }

        if (session.pending?.type === 'deviceUnlock') {
          const { requestId, stage } = session.pending
          if (stage === 'pin') return ok({ ui: buildPinUi({ requestId, triesLeft: session.pinTriesLeft }) })
        }

        const requestId = createRequestId()
        session.pending = { type: 'deviceUnlock', requestId, stage: 'pin' }
        return ok({ ui: buildPinUi({ requestId, triesLeft: session.pinTriesLeft }) })
      }

      case 'btcGetAddress':
      case 'BTCgetAddress':
      case 'get_address': {
        const path = normalizePath(params?.path)
        const showOnDevice = Boolean(params?.showOnOneKey ?? params?.showOnDevice)

        const meta = getNetworkMetaFromPath(path)
        const addrType = getAddrTypeFromPath(path, meta.network)
        const address = fakeAddress({ network: meta.network, path })

        if (!showOnDevice) {
          return ok({
            success: true,
            payload: {
              path,
              address
            },
            path,
            address,
            network: meta.network
          })
        }

        if (session.pending?.type === 'btcGetAddress') {
          const { requestId, stage } = session.pending
          if (stage === 'pin') return ok({ ui: buildPinUi({ requestId, triesLeft: session.pinTriesLeft }) })
          if (stage === 'confirm') {
            return ok({
              unlocked: session.unlocked,
              ui: buildConfirmUi({
                requestId,
                action: 'btcGetAddress',
                details: session.pending.details
              })
            })
          }
        }

        const requestId = createRequestId()

        const details = {
          network: meta.network,
          primaryColor: meta.primaryColor,
          icon: meta.icon,
          path,
          addrType,
          address,
          qrFirst: false
        }

        if (!session.unlocked) {
          session.pending = {
            type: 'btcGetAddress',
            requestId,
            stage: 'pin',
            details
          }
          return ok({ ui: buildPinUi({ requestId, triesLeft: session.pinTriesLeft }) })
        }

        session.pending = {
          type: 'btcGetAddress',
          requestId,
          stage: 'confirm',
          details
        }
        return ok({
          ui: buildConfirmUi({
            requestId,
            action: 'btcGetAddress',
            details
          })
        })
      }

      case 'btcSignMessage':
      case 'BTCsignMessage':
      case 'sign_tx': {
        const signPayload = command === 'sign_tx' ? normalizeSignTxParams(params) : normalizeSignMessageParams(params)

        if (session.pending?.type === 'btcSignMessage') {
          const { requestId, stage } = session.pending
          if (stage === 'pin') return ok({ ui: buildPinUi({ requestId, triesLeft: session.pinTriesLeft }) })
          if (stage === 'confirm') {
            return ok({
              ui: buildConfirmUi({ requestId, action: 'btcSignMessage', details: session.pending.payload })
            })
          }
        }

        const requestId = createRequestId()

        if (!session.unlocked) {
          session.pending = { type: 'btcSignMessage', requestId, stage: 'pin', payload: signPayload }
          return ok({ ui: buildPinUi({ requestId, triesLeft: session.pinTriesLeft }) })
        }

        session.pending = { type: 'btcSignMessage', requestId, stage: 'confirm', payload: signPayload }
        return ok({ ui: buildConfirmUi({ requestId, action: 'btcSignMessage', details: signPayload }) })
      }

      case 'submit_pin': {
        const requestId = typeof params?.requestId === 'string' ? params.requestId : null
        if (!session.pending || session.pending.stage !== 'pin') {
          return badRequest('当前不需要输入 PIN。', 'NO_PIN_REQUEST')
        }
        if (requestId && requestId !== session.pending.requestId) {
          return badRequest('PIN 请求已过期。', 'REQUEST_EXPIRED')
        }

        const pin = typeof params?.pin === 'string' ? params.pin.trim() : ''
        if (!pin) return badRequest('PIN 不能为空。', 'PIN_EMPTY')

        if (pin !== '1234') {
          session.pinTriesLeft = Math.max(0, session.pinTriesLeft - 1)
          return ok({
            unlocked: false,
            ui: buildPinUi({
              requestId: session.pending.requestId,
              triesLeft: session.pinTriesLeft,
              error: 'PIN_INVALID'
            })
          })
        }

        session.unlocked = true

        if (session.pending.type === 'deviceUnlock') {
          session.pending = null
          return ok({ success: true, payload: { unlocked: session.unlocked }, unlocked: session.unlocked })
        }

        if (session.pending.type === 'btcGetAddress') {
          session.pending = { ...session.pending, stage: 'confirm' }
          return ok({
            unlocked: session.unlocked,
            ui: buildConfirmUi({
              requestId: session.pending.requestId,
              action: 'btcGetAddress',
              details: session.pending.details
            })
          })
        }

        if (session.pending.type === 'btcSignMessage') {
          session.pending = { ...session.pending, stage: 'confirm' }
          return ok({
            unlocked: session.unlocked,
            ui: buildConfirmUi({
              requestId: session.pending.requestId,
              action: 'btcSignMessage',
              details: session.pending.payload
            })
          })
        }

        session.pending = null
        return ok({
          unlocked: session.unlocked
        })
      }

      case 'confirm_action': {
        const requestId = typeof params?.requestId === 'string' ? params.requestId : null
        if (!session.pending || session.pending.stage !== 'confirm') {
          return badRequest('当前没有需要确认的操作。', 'NO_CONFIRM_REQUEST')
        }
        if (requestId && requestId !== session.pending.requestId) {
          return badRequest('确认请求已过期。', 'REQUEST_EXPIRED')
        }

        const approved = Boolean(params?.approved)
        const pending = session.pending

        session.pending = null

        if (!approved) {
          return badRequest('用户拒绝确认（Mock）。', 'USER_REJECTED')
        }

        if (pending.type === 'btcGetAddress') {
          return ok({
            success: true,
            payload: {
              address: pending.details.address,
              path: pending.details.path
            },
            unlocked: session.unlocked,
            ...pending.details,
            path: pending.details.path,
            address: pending.details.address,
            network: pending.details.network
          })
        }

        if (pending.type === 'btcSignMessage') {
          return ok({
            success: true,
            payload: {
              address: fakeAddress({ network: 'Bitcoin', path: pending.payload?.path }),
              signature: 'ZGVhZGJlZWY='
            },
            signature: 'ZGVhZGJlZWY=',
            messageHex: pending.payload?.messageHex ?? ''
          })
        }

        const tx = pending.tx ?? {}
        return ok({
          signature: '0xdeadbeefmock',
          txid: '0xmocktxid',
          signed: { ...tx }
        })
      }

      case 'cancel_action': {
        const requestId = typeof params?.requestId === 'string' ? params.requestId : null
        if (!session.pending) {
          return ok({ cancelled: true })
        }
        if (requestId && requestId !== session.pending.requestId) {
          return badRequest('操作已过期。', 'REQUEST_EXPIRED')
        }
        session.pending = null
        return ok({ cancelled: true })
      }

      default:
        return badRequest(`未知命令：${command}`, 'UNKNOWN_COMMAND')
    }
  })
]
