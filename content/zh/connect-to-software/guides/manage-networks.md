---
description: Manage networks (EVM) — detect, listen, switch and add chains (EIP‑1193 compatible)
---

# Manage networks (EVM)

This guide shows how to detect the current network, react to `chainChanged`, and request switching/adding networks via the EIP‑1193 provider.

## Detect the current network

```js
const chainId = await provider.request({ method: 'eth_chainId' })
console.log('Current chain ID:', chainId) // e.g. 0x1 for mainnet
```

## Listen for network changes

```js
provider.on?.('chainChanged', (chainId) => {
  // Recreate clients or refresh state as needed
})
```

## Switch to an existing chain

```js
try {
  await provider.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x1' }], // target chainId in hex string
  })
} catch (e) {
  if (e?.code === 4902) {
    // Chain not found — add it instead
  } else if (e?.code === 4001) {
    // User rejected
  } else {
    console.error(e)
  }
}
```

## Add a new chain (if missing)

```js
await provider.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: '0x89',
    chainName: 'Polygon',
    rpcUrls: ['https://polygon-rpc.com'],
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    blockExplorerUrls: ['https://polygonscan.com/'],
  }],
})
```

## Tips

- Always use 0x‑prefixed hex strings for `chainId`
- Handle common error codes: 4001 (user rejected), 4902 (unknown chain)
- Reset cached state after switching chains to avoid stale data
- For non‑EVM chains (NEAR/Solana), see their dedicated sections
