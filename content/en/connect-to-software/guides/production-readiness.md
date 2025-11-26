---
description: Production readiness — errors, retries, state, security, and observability
---

# Production readiness checklist

## Connection & state

- Provider detection order: `window.$onekey.ethereum` → OneKey in multi‑provider list → `window.ethereum`
- Ask for connection on user intent (avoid unsolicited popups)
- Listen to `accountsChanged`/`chainChanged` and recreate clients as needed

## Errors & retries

- Standard codes: 4001 (rejected), 4902 (unknown chain)
- Network/node errors: exponential backoff; capture and classify for telemetry
- Tx polling: set timeouts and user guidance to avoid dead‑ends

## Security & permissions

- Nonce‑based sign‑in to prevent replay (see “Authenticate users”)
- Don’t trust frontend‑supplied `chainId`/`address` server‑side; re‑validate
- Limit dangerous RPCs; expose only what you need

## Performance & UX

- Cache read‑only data sensibly; prefer Multicall for many reads
- Show clear network/account and fee information in UI
- Prepare deeplinks and Universal Link fallbacks for mobile

## Observability & support

- Instrument key paths: connect rate, rejection rate, tx success rate
- Record error codes with context (chain/node/method)
- Provide copy‑ready error details for support and debugging
