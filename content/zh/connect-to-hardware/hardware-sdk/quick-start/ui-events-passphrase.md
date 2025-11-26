# UI 事件：Passphrase（概述）

- 当需要隐藏钱包时，SDK 会发出 `UI_REQUEST.REQUEST_PASSPHRASE`。
- 两种选择：
  - 在设备上输入（最安全）：
    ```ts
    await HardwareSDK.uiResponse({
      type: UI_RESPONSE.RECEIVE_PASSPHRASE,
      payload: {
        passphraseOnDevice: true,
        value: ''
      }
    });
    ```
  - 软件输入（可选择为会话缓存）：
    ```ts
    await HardwareSDK.uiResponse({
      type: UI_RESPONSE.RECEIVE_PASSPHRASE,
      payload: {
        value,
        passphraseOnDevice: false,
        save: true
      }
    });
    ```
- 强制使用标准钱包：在方法参数中添加 `useEmptyPassphrase: true`。

示例（仅此次调用强制使用标准钱包）：
```ts
const res = await HardwareSDK.btcGetAddress(connectId, deviceId, {
  path: "m/44'/0'/0'/0/0",
  coin: 'btc',
  showOnOneKey: false,
  useEmptyPassphrase: true,
});
```

- WebUSB 的完整、可复制粘贴的对话框请参阅 [WebUSB 连接指南](../transport/web-usb)。
- 事件连接和响应：[事件配置](../api-reference/config-event)。
- 深入解析用户体验和安全注意事项：[密码短语](../concepts/passphrase)。
