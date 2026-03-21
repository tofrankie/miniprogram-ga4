[**@tofrankie/miniprogram-ga4**](../README.md)

***

[@tofrankie/miniprogram-ga4](../globals.md) / CommonEventParams

# Interface: CommonEventParams

Defined in: [core/types.ts:97](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L97)

通用 `event` 事件参数

## Extends

- [`EventParams`](../type-aliases/EventParams.md)

## Indexable

> \[`key`: `string`\]: `unknown`

## Properties

### action

> **action**: `string`

Defined in: [core/types.ts:101](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L101)

事件操作，常以事件目标 + 操作组成

***

### category

> **category**: `string`

Defined in: [core/types.ts:99](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L99)

事件类别，常以页面为单位

***

### label?

> `optional` **label?**: `string`

Defined in: [core/types.ts:103](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L103)

事件标签，通常用于更具体地描述事件目标

***

### value?

> `optional` **value?**: `number`

Defined in: [core/types.ts:105](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L105)

事件值，可用于时长、数量等
