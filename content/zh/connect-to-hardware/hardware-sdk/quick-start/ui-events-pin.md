# UI 事件：PIN（概述）

> **警告：**
> 在 OneKey Pro 和 OneKey Touch 设备上，PIN 码只能在硬件设备上输入。这些型号不支持软件 PIN 输入。


- 当执行受保护的调用（如 `btcGetAddress`）且设备已锁定时，SDK 会发出 `UI_REQUEST.REQUEST_PIN`。
- 使用以下方式之一响应：
  - 在设备上输入（推荐）：
    ```ts
    await HardwareSDK.uiResponse({
      type: UI_RESPONSE.RECEIVE_PIN,
      payload: '@@ONEKEY_INPUT_PIN_IN_DEVICE'
    });
    ```
  - 软件盲输 PIN（Pro/Touch 不支持）：显示固定的 3×3 键盘并发送转换后的 PIN 字符串。
    ```ts
    let inputValue = '1111'
    await HardwareSDK.uiResponse({
      type: UI_RESPONSE.RECEIVE_PIN,
      payload: value
    });
    ```
- 收到 `UI_REQUEST.CLOSE_UI_WINDOW` 时关闭提示框。

了解更多：
- [事件配置](../api-reference/config-event)
- PIN 深入解析（映射、用户体验、重试）：[PIN 码](../concepts/pin)
- WebUSB 连接提示和用户体验：[WebUSB 连接指南](../transport/web-usb)
