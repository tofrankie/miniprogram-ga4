[**@tofrankie/miniprogram-ga4**](../README.md)

***

[@tofrankie/miniprogram-ga4](../globals.md) / MiniprogramAPI

# Interface: MiniprogramAPI

Defined in: [core/types.ts:18](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L18)

## Properties

### getAppBaseInfo?

> `optional` **getAppBaseInfo?**: () => `AppBaseInfo`

Defined in: [core/types.ts:28](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L28)

获取小程序基础信息（如 language、version），微信 2.20.1+

#### Returns

`AppBaseInfo`

***

### getDeviceInfo?

> `optional` **getDeviceInfo?**: () => `DeviceInfo`

Defined in: [core/types.ts:32](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L32)

获取设备信息（如 brand、model、system），微信 2.20.1+

#### Returns

`DeviceInfo`

***

### getStorageSync

> **getStorageSync**: (`key`) => `string`

Defined in: [core/types.ts:20](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L20)

读取本地存储

#### Parameters

##### key

`string`

#### Returns

`string`

***

### getWindowInfo?

> `optional` **getWindowInfo?**: () => `WindowInfo`

Defined in: [core/types.ts:30](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L30)

获取窗口信息（如 screenWidth、screenHeight），微信 2.20.1+

#### Returns

`WindowInfo`

***

### onAppShow

> **onAppShow**: (`callback`) => `void`

Defined in: [core/types.ts:24](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L24)

监听小程序切前台

#### Parameters

##### callback

() => `void`

#### Returns

`void`

***

### request

> **request**: (`options`) => `void`

Defined in: [core/types.ts:26](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L26)

发起网络请求

#### Parameters

##### options

[`MiniprogramRequestOptions`](MiniprogramRequestOptions.md)

#### Returns

`void`

***

### setStorageSync

> **setStorageSync**: (`key`, `value`) => `void`

Defined in: [core/types.ts:22](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L22)

写入本地存储

#### Parameters

##### key

`string`

##### value

`string`

#### Returns

`void`
