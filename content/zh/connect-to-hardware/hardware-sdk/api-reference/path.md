# 路径参数

## Path

* `path` - `string | Array<number>` 使用 [BIP44](https://github.com/OneKeyHQ/bixin-firmware/blob/bixin_dev/docs/misc/coins-bip44-paths) 路径方案的字符串或硬化数字数组。

> 如果链是 ed25519，则必须完全硬化。
>
> 例如 m/49'/0/'0'/'0'/'0'

#### 示例

使用 BIP44 派生路径的比特币账户 1

```javascript
"m/49'/0/'0'"
```

使用硬化路径的比特币账户 1

```javascript
[(49 | 0x80000000) >>> 0, (0 | 0x80000000 >>> 0), (0 | 0x80000000) >>> 0]
```

使用 BIP44 派生路径的比特币账户 1 的第一个地址

```javascript
"m/49'/0/'0'/0/0"
```

使用硬化路径的比特币账户 1 的第一个地址

```javascript
[(49 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 0, 0]
```

[查看更多示例](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#examples)
