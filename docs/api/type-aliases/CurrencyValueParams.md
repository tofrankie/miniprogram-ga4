[**@tofrankie/miniprogram-ga4**](../README.md)

***

[@tofrankie/miniprogram-ga4](../globals.md) / CurrencyValueParams

# Type Alias: CurrencyValueParams

> **CurrencyValueParams** = \{ `currency`: `string`; `value`: `number`; \} \| \{ `currency?`: `string`; `value?`: `undefined`; \}

Defined in: [core/types.ts:109](https://github.com/tofrankie/miniprogram-ga4/blob/e79503b17c884cdf60d1be624a91bd63b2c39c4c/src/core/types.ts#L109)

货币字段约束：当设置 `value` 时，必须同时提供 `currency`（ISO 4217）

## Union Members

### Type Literal

\{ `currency`: `string`; `value`: `number`; \}

#### currency

> **currency**: `string`

货币代码（ISO 4217），如 `CNY`、`USD`

#### value

> **value**: `number`

与事件相关的货币价值

***

### Type Literal

\{ `currency?`: `string`; `value?`: `undefined`; \}

#### currency?

> `optional` **currency?**: `string`

不上报 value 时可省略

#### value?

> `optional` **value?**: `undefined`

不上报 value 时可省略
