# 搜索设备

## 搜索设备

搜索已连接的设备，并以数组形式将搜索结果返回给开发者。

对于 USB 连接，返回的数据已包含设备详细信息。

对于蓝牙设备搜索，返回的数据仅包含设备名称和设备 connectId，开发者需要先选择要配对的设备才能获取设备信息。

```typescript
const response = await HardwareSDK.searchDevices();
```

### 参数

* 无

### 示例

```typescript
HardwareSDK.searchDevices().then(result => {
    console.log(`设备列表: ${result}`)
});
```

### 返回结果

```typescript
{
    success: true,
    payload: [
        {
            "connectId": string, // 设备连接 ID
            "uuid": string, // 设备唯一 ID
            "deviceType": string, // 设备类型：'classic' | 'mini' | 'touch' | 'pro'
            "deviceId": string, // 设备 ID，此 ID 可能随设备擦除而改变，仅在使用 @onekeyfe/hd-common-connect-sdk 的 webusb 传输时返回
            "path": string, // 通过 WebUSB 连接 USB 时的设备序列号
            "name": string, // 设备的蓝牙名称
        },
    ]
}
```

### 错误

```typescript
{
    success: false,
    payload: {
        error: string, // 错误消息
        code: number // 错误码
    }
}
```
