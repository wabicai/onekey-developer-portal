---
description: Batch requests and performance (EVM) — concurrency, Multicall, and server proxy options
---

# Batch requests (EVM)

Injected EIP‑1193 providers typically don’t expose native JSON‑RPC batch arrays. In practice, use the following patterns to improve performance.

## Option 1: Concurrent requests via Promise.all

```js
const blockNumber = await provider.request({ method: 'eth_blockNumber' })
const [b1, b2, b3] = await Promise.all([
  provider.request({ method: 'eth_getBalance', params: ['0xA', blockNumber] }),
  provider.request({ method: 'eth_getBalance', params: ['0xB', blockNumber] }),
  provider.request({ method: 'eth_getBalance', params: ['0xC', blockNumber] }),
])
```

Pros: simple and effective. Cons: can stress the RPC and hit rate limits.

## Option 2: Multicall (recommended for reads)

Use on‑chain aggregation via a Multicall contract or viem’s `multicall`.

```ts
import { createPublicClient, custom } from 'viem'
const publicClient = createPublicClient({ transport: custom((window as any).$onekey?.ethereum || (window as any).ethereum) })

const results = await publicClient.multicall({
  contracts: [/* contract calls */],
})
```

Pros: fewer RPC round trips. Cons: requires ABI and an additional dependency.

## Option 3: Server‑side RPC proxy

Aggregate, cache, and degrade multiple frontend calls server‑side using native JSON‑RPC batching.

## Choosing

- Read‑heavy flows → prefer Multicall; otherwise use `Promise.all`
- Rate‑limited environments → introduce a server proxy and caching
- Cross‑network/multi‑account → split batches and implement retries
