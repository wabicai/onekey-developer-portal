---
description: Open OneKey with deeplinks across platforms using a WalletConnect URI (standardized, simplified)
---

# Use deeplinks

This guide shows how to open the OneKey app from mobile web/WebViews using deeplinks that carry a WalletConnect URI. It follows a minimal, implementation‑agnostic pattern.

> Prerequisites: Obtain a WalletConnect v2 Cloud `projectId` for your app. Do not commit secrets. Prefer environment variables (for example: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` or `VITE_WC_PROJECT_ID`), and replace the placeholder `YOUR_PROJECT_ID` in the snippets accordingly.


- Where: mobile browsers, WebViews, React Native/Expo, Telegram Mini Apps, etc.
- Always keep a fallback (Universal Link or QR)

## Link types and priority

1) Custom scheme (preferred)
- `onekey-wallet://wc?uri={encodeURIComponent(wcUri)}`

2) Raw WalletConnect URI (optional)
- `wc:xxxxx@2?relay-protocol=irn&symKey=...`

3) Universal Link (fallback)
- `https://app.onekey.so/wc/connect/wc?uri={encodeURIComponent(wcUri)}`

Note: Always `encodeURIComponent` when putting the URI in a query string.

## Quick example (EVM)

```ts
import { SignClient } from '@walletconnect/sign-client';

const client = await SignClient.init({
  projectId: 'YOUR_PROJECT_ID',
  metadata: { name: 'My DApp', description: 'WalletConnect', url: 'https://example.com', icons: ['https://example.com/icon.png'] },
});

const { uri, approval } = await client.connect({
  requiredNamespaces: { eip155: { methods: ['eth_sendTransaction', 'personal_sign'], chains: ['eip155:1'], events: ['chainChanged', 'accountsChanged'] } },
});

if (uri) {
  const deepLink = `onekey-wallet://wc?uri=${encodeURIComponent(uri)}`;
  const universal = `https://app.onekey.so/wc/connect/wc?uri=${encodeURIComponent(uri)}`;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = deepLink;
    setTimeout(() => { window.location.href = universal; }, 1500);
  } else {
    // Desktop: prefer QR; if linking, open Universal Link
    window.open(universal, '_blank');
  }
}

const session = await approval();
```

## Platform notes

- iOS Safari: prefer `location.href = deepLink`; short timeout to Universal Link fallback
- Android: custom scheme usually works well
- WebViews: often require a user gesture to open external links
- Desktop: prefer QR; provide a “Continue on mobile” Universal Link

## Platform configuration

### iOS (Info.plist)

```xml
<key>CFBundleURLSchemes</key>
<array>
  <string>onekey-wallet</string>
  <string>wc</string>
  </array>

<key>com.apple.developer.associated-domains</key>
<array>
  <string>applinks:app.onekey.so</string>
</array>
```

### Android (AndroidManifest.xml)

```xml
<activity android:name=".MainActivity">
  <!-- Deep Link -->
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="onekey-wallet" />
  </intent-filter>

  <!-- Universal Link -->
  <intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="app.onekey.so" android:pathPrefix="/wc" />
  </intent-filter>
</activity>
```

## Framework examples

### React Native / Expo

```ts
import { Linking } from 'react-native';

async function connectOneKey(wcUri: string) {
  const deepLink = `onekey-wallet://wc?uri=${encodeURIComponent(wcUri)}`;
  const canOpen = await Linking.canOpenURL(deepLink);
  if (canOpen) {
    await Linking.openURL(deepLink);
  } else {
    const universal = `https://app.onekey.so/wc/connect/wc?uri=${encodeURIComponent(wcUri)}`;
    await Linking.openURL(universal);
  }
}
```

### Telegram Mini Apps

```ts
import { openLink } from '@telegram-apps/sdk'
import { SignClient } from '@walletconnect/sign-client'

async function connectWithOneKey() {
  const client = await SignClient.init({
    projectId: 'YOUR_PROJECT_ID',
    metadata: {
      name: 'My Telegram DApp',
      description: 'Telegram Mini App',
      url: 'https://t.me/your_bot',
      icons: ['https://your-icon.png'],
    },
  })

  const { uri, approval } = await client.connect({
    requiredNamespaces: {
      eip155: { methods: ['eth_sendTransaction', 'personal_sign'], chains: ['eip155:1'], events: ['chainChanged', 'accountsChanged'] },
    },
  })

  if (uri) {
    const deepLink = `onekey-wallet://wc?uri=${encodeURIComponent(uri)}`
    openLink(deepLink)
  }

  const session = await approval()
  return session
}
```

## Fallback strategy

- Not installed: show QR or direct to download OneKey
- No response: fallback to Universal Link
- Long URI: reduce methods/events/chains to shorten

## Related

- OneKey Provider (EIP‑1193): [provider](../connect-to-software/provider/README)
