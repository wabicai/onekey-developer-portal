---
description: Interact with contracts using OneKey’s EIP‑1193 provider (viem/ethers examples)
---

# Interact with contracts (EVM)

You can pair the injected EIP‑1193 provider with any web3 library. Below are examples using viem and ethers v6.

## viem example

```ts
import { createPublicClient, createWalletClient, custom, parseAbi } from 'viem'

const provider = (window as any).$onekey?.ethereum || (window as any).ethereum
const publicClient = createPublicClient({ transport: custom(provider) })
const walletClient = createWalletClient({ transport: custom(provider) })

const abi = parseAbi([
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 value) returns (bool)'
])
const token = '0xToken'
const account = (await provider.request({ method: 'eth_requestAccounts' }))[0]

// Read
const balance = await publicClient.readContract({ address: token, abi, functionName: 'balanceOf', args: [account] })

// Write (triggers signing)
const hash = await walletClient.writeContract({ account, address: token, abi, functionName: 'transfer', args: ['0xRecipient', 10n ** 18n] })
```

## ethers v6 example

```ts
import { BrowserProvider, Contract } from 'ethers'

const provider = new BrowserProvider((window as any).$onekey?.ethereum || (window as any).ethereum)
const signer = await provider.getSigner()

const abi = [
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 value) returns (bool)'
]
const token = new Contract('0xToken', abi, signer)

// Read
const addr = await signer.getAddress()
const bal = await token.balanceOf(addr)

// Write
const tx = await token.transfer('0xRecipient', 1n * 10n ** 18n)
const receipt = await tx.wait()
```

## Tips

- Call `eth_requestAccounts` before interactions and listen to `accountsChanged`/`chainChanged`
- Use strings or BigInt consistently; hex strings must be 0x‑prefixed; amounts are in Wei
- Reads can use a public client (no signing), writes require a signer/account
