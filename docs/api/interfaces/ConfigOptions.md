[**@tofrankie/miniprogram-ga4**](../README.md)

***

[@tofrankie/miniprogram-ga4](../globals.md) / ConfigOptions

# Interface: ConfigOptions

Defined in: [core/types.ts:35](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L35)

## Properties

### api?

> `optional` **api?**: [`MiniprogramAPI`](MiniprogramAPI.md)

Defined in: [core/types.ts:43](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L43)

当前端小程序 API 命名空间（默认微信小程序的 `wx`）

***

### debug?

> `optional` **debug?**: `boolean`

Defined in: [core/types.ts:41](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L41)

开启调试日志

***

### eu?

> `optional` **eu?**: `boolean`

Defined in: [core/types.ts:39](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L39)

是否在欧盟境内收集数据；为 true 时默认使用 region1 域名

***

### transportUrl?

> `optional` **transportUrl?**: `string`

Defined in: [core/types.ts:37](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L37)

数据上报域名；未指定时由 `eu` 决定：`eu: true` 为 `https://region1.google-analytics.com`，否则为 `https://www.google-analytics.com`
