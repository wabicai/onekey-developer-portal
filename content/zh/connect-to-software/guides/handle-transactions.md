---
description: Handle transactions (EVM) — estimate, send, wait for receipt, and handle errors (follows EIP‑1193 provider pattern)
---

# Handle transactions (EVM)

This guide shows a typical flow using the EIP‑1193 provider: prepare params → send → poll receipt → handle errors.

## Transaction params (prefer EIP‑1559)

```js
const tx = {
  from: account,
  to: '0xRecipient',
  value: '0x2386f26fc10000', // 0.01 ETH in hex Wei
  // Optional EIP‑1559 fields (let wallet/node estimate if possible)
  // maxFeePerGas: '0x...',
  // maxPriorityFeePerGas: '0x...'
}
```

## Send transaction

```js
const txHash = await provider.request({
  method: 'eth_sendTransaction',
  params: [tx],
})
```

## Wait for receipt (poll)

```js
async function waitForReceipt(hash, { interval = 1500, timeout = 120000 } = {}) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    const receipt = await provider.request({ method: 'eth_getTransactionReceipt', params: [hash] })
    if (receipt) return receipt // status / blockNumber / logs ...
    await new Promise((r) => setTimeout(r, interval))
  }
  throw new Error('Timed out waiting for transaction receipt')
}

const receipt = await waitForReceipt(txHash)
```

## Error handling

- 4001: user rejected signature/send
- -32000/-32003: insufficient funds, gas errors from node
- Param formats: 0x‑prefixed hex strings; avoid passing raw BigInt values
- UX: retry/backoff for transient errors; don’t re‑prompt after user rejection

## Recommendations

- Use libraries (viem/ethers) for gas estimation and encoding
- For many reads or multi‑contract calls, prefer Multicall
- For non‑EVM (BTC/NEAR), see each chain’s API reference
