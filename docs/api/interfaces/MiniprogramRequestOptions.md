[**@tofrankie/miniprogram-ga4**](../README.md)

***

[@tofrankie/miniprogram-ga4](../globals.md) / MiniprogramRequestOptions

# Interface: MiniprogramRequestOptions

Defined in: [core/types.ts:1](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L1)

## Properties

### complete?

> `optional` **complete?**: () => `void`

Defined in: [core/types.ts:15](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L15)

请求完成回调

#### Returns

`void`

***

### data?

> `optional` **data?**: `string`

Defined in: [core/types.ts:7](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L7)

序列化后的请求体

***

### fail?

> `optional` **fail?**: (`err`) => `void`

Defined in: [core/types.ts:13](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L13)

请求失败回调

#### Parameters

##### err

`unknown`

#### Returns

`void`

***

### header?

> `optional` **header?**: `Record`\<`string`, `string`\>

Defined in: [core/types.ts:9](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L9)

请求头

***

### method

> **method**: `string`

Defined in: [core/types.ts:5](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L5)

HTTP 方法，当前库固定为 POST

***

### success?

> `optional` **success?**: () => `void`

Defined in: [core/types.ts:11](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L11)

请求成功回调

#### Returns

`void`

***

### url

> **url**: `string`

Defined in: [core/types.ts:3](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L3)

请求地址
