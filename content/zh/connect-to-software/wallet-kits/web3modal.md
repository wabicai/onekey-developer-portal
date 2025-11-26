---
description: Integrate OneKey with Web3Modal (EVM)
---

# Web3Modal

## Docs

- Official docs: https://docs.walletconnect.com/web3modal/about

## Install

```bash
npm install @web3modal/wagmi wagmi@1.4.13 viem@1.21.4
# or
yarn add @web3modal/wagmi wagmi@1.4.13 viem@1.21.4
```

## Configure OneKey

Add OneKey to `featuredWalletIds` and `includeWalletIds`.

```javascript
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  featuredWalletIds: [
    // OneKey Wallet Id, see https://explorer.walletconnect.com/onekey
    "1aedbcfc1f31aade56ca34c38b0a1607b41cccfa3de93c946ef3b4ba2dfab11c",
  ],
  includeWalletIds: [
    // OneKey Wallet Id, see https://explorer.walletconnect.com/onekey
    "1aedbcfc1f31aade56ca34c38b0a1607b41cccfa3de93c946ef3b4ba2dfab11c",
  ],
});
```

## Quickstart / Demo

- Demo: https://codesandbox.io/embed/xd9wjd?module=/src/App.tsx&view=Editor+++Preview

## Related

- React + wagmi (hooks-based integration): [Guide](../provider/wagmi)
