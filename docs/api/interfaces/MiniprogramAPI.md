[**@tofrankie/miniprogram-ga4**](../README.md)

***

[@tofrankie/miniprogram-ga4](../globals.md) / MiniprogramAPI

# Interface: MiniprogramAPI

Defined in: [core/types.ts:18](https://github.com/tofrankie/miniprogram-ga4/blob/e6b628077df4ffb5f4b4f952d3a4e0884e716f0c/src/core/types.ts#L18)

## Properties

### getStorageSync()

> **getStorageSync**: (`key`) => `string`

Defined in: [core/types.ts:20](https://github.com/tofrankie/miniprogram-ga4/blob/e6b628077df4ffb5f4b4f952d3a4e0884e716f0c/src/core/types.ts#L20)

读取本地存储

#### Parameters

##### key

`string`

#### Returns

`string`

***

### onAppShow()

> **onAppShow**: (`callback`) => `void`

Defined in: [core/types.ts:24](https://github.com/tofrankie/miniprogram-ga4/blob/e6b628077df4ffb5f4b4f952d3a4e0884e716f0c/src/core/types.ts#L24)

监听小程序切前台

#### Parameters

##### callback

() => `void`

#### Returns

`void`

***

### request()

> **request**: (`options`) => `void`

Defined in: [core/types.ts:26](https://github.com/tofrankie/miniprogram-ga4/blob/e6b628077df4ffb5f4b4f952d3a4e0884e716f0c/src/core/types.ts#L26)

发起网络请求

#### Parameters

##### options

[`MiniprogramRequestOptions`](MiniprogramRequestOptions.md)

#### Returns

`void`

***

### setStorageSync()

> **setStorageSync**: (`key`, `value`) => `void`

Defined in: [core/types.ts:22](https://github.com/tofrankie/miniprogram-ga4/blob/e6b628077df4ffb5f4b4f952d3a4e0884e716f0c/src/core/types.ts#L22)

写入本地存储

#### Parameters

##### key

`string`

##### value

`string`

#### Returns

`void`
