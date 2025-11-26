# 初始化 SDK

## 初始化

初始化 SDK 并向调用者返回初始化结果。

```typescript
HardwareSDK.init(params);
```

### 参数

* `debug` - _可选_ `boolean` 是否打印调试日志
* `fetchConfig`- _可选_ `boolean` 允许通过网络查询更新的设备版本信息，用于提示设备更新和告知旧硬件使用新功能需要的版本。
* `env` - _可选_ `'webusb' | 'react-native' | 'lowlevel'` SDK 使用的环境
  - `'webusb'` - 使用 WebUSB 协议进行浏览器到设备的直接 USB 通信（需要 HTTPS）
  - `'react-native'` - 用于带蓝牙的 React Native 应用
  - `'lowlevel'` - 用于自定义底层传输实现

### 示例

**Web 使用 WebUSB：**
```typescript
HardwareSDK.init({
    debug: false,
    fetchConfig: true,
    env: 'webusb', // 使用 WebUSB 进行直接 USB 通信
});
```

**React Native：**
```typescript
HardwareSDK.init({
    debug: false,
    fetchConfig: true,
    env: 'react-native',
});
```
