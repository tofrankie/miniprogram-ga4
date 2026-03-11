[**@tofrankie/miniprogram-ga4**](../README.md)

***

[@tofrankie/miniprogram-ga4](../globals.md) / CommonEventParams

# Interface: CommonEventParams

Defined in: [core/types.ts:89](https://github.com/tofrankie/miniprogram-ga4/blob/e6b628077df4ffb5f4b4f952d3a4e0884e716f0c/src/core/types.ts#L89)

通用 `event` 事件参数

## Extends

- [`EventParams`](../type-aliases/EventParams.md)

## Indexable

\[`key`: `string`\]: `unknown`

## Properties

### action

> **action**: `string`

Defined in: [core/types.ts:93](https://github.com/tofrankie/miniprogram-ga4/blob/e6b628077df4ffb5f4b4f952d3a4e0884e716f0c/src/core/types.ts#L93)

事件操作，常以事件目标 + 操作组成

***

### category

> **category**: `string`

Defined in: [core/types.ts:91](https://github.com/tofrankie/miniprogram-ga4/blob/e6b628077df4ffb5f4b4f952d3a4e0884e716f0c/src/core/types.ts#L91)

事件类别，常以页面为单位

***

### label?

> `optional` **label**: `string`

Defined in: [core/types.ts:95](https://github.com/tofrankie/miniprogram-ga4/blob/e6b628077df4ffb5f4b4f952d3a4e0884e716f0c/src/core/types.ts#L95)

事件标签，通常用于更具体地描述事件目标

***

### value?

> `optional` **value**: `number`

Defined in: [core/types.ts:97](https://github.com/tofrankie/miniprogram-ga4/blob/e6b628077df4ffb5f4b4f952d3a4e0884e716f0c/src/core/types.ts#L97)

事件值，可用于时长、数量等
