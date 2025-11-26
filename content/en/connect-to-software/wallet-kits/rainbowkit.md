---
description: Integrate OneKey with RainbowKit (EVM)
---

# RainbowKit

## Docs

- Official docs: https://www.rainbowkit.com/docs/introduction

## Install

```bash
yarn add @rainbow-me/rainbowkit wagmi viem
# or
npm install @rainbow-me/rainbowkit wagmi viem
```

## Configure OneKey

Add the OneKey wallet to RainbowKit configuration.

```javascript
// import OneKey Wallet
import { oneKeyWallet } from "@rainbow-me/rainbowkit/wallets";

const appName = "OneKey Demo";
const projectId = "12345";

const { wallets } = getDefaultWallets({ appName, projectId, chains });
const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Recommend",
    // Config OneKey Wallet
    wallets: [oneKeyWallet({ chains })]
  }
]);

const wagmiConfig = createConfig({
  connectors,
  publicClient
});
```

## Quickstart / Demo

- Demo: https://codesandbox.io/embed/rainbowkit-demo-hg62ng?autoresize=1&fontsize=14&hidenavigation=1&theme=dark

## Related

- React + wagmi (hooks-based integration): [Guide](../provider/wagmi)
