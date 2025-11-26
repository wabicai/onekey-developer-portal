---
description: Authenticate users (EVM) — use EIP‑4361 (SIWE) or a nonce‑based scheme
---

# Authenticate users (SIWE)

Have users sign a “login statement” on the frontend, verify it on the backend, and establish a session (e.g., JWT). This mirrors common EVM flows and works with OneKey.

## Flow

1) Backend generates a one‑time `nonce` and returns the message to sign (prefer the SIWE format)
2) Frontend requests a signature via `personal_sign` or `eth_signTypedData_v4`
3) Frontend posts `{ address, message, signature }` to the backend for verification
4) Backend validates signature + nonce, then issues a session token

## Frontend example (plain message)

```ts
const provider = (window as any).$onekey?.ethereum || (window as any).ethereum
const [address] = await provider.request({ method: 'eth_requestAccounts' })

// 1) Ask backend for a message and nonce
const { message } = await fetch('/auth/prepare', { method: 'POST', body: JSON.stringify({ address }) }).then(r => r.json())

// 2) Ask wallet to sign (note personal_sign param order is [message, address])
const signature = await provider.request({ method: 'personal_sign', params: [message, address] })

// 3) Post back for verification
const result = await fetch('/auth/verify', { method: 'POST', body: JSON.stringify({ address, message, signature }) }).then(r => r.json())
```

## Backend verification notes

- Recover the signer address and compare to the claimed address
- Make `nonce` single‑use and time‑bound (prevent replay)
- Bind `domain`/`chainId` as needed (part of SIWE fields)
- Choose appropriate expiry and refresh strategy for the session token

> Tip: If you use SIWE, rely on the community `siwe` package. If you roll your own format, include fields like `domain`, `address`, `statement`, `uri`, `version`, `chainId`, `nonce`, `issuedAt`.
