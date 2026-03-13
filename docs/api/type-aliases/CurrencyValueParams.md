[**@tofrankie/miniprogram-ga4**](../README.md)

***

[@tofrankie/miniprogram-ga4](../globals.md) / CurrencyValueParams

# Type Alias: CurrencyValueParams

> **CurrencyValueParams** = \{ `currency`: `string`; `value`: `number`; \} \| \{ `currency?`: `string`; `value?`: `undefined`; \}

Defined in: [core/types.ts:101](https://github.com/tofrankie/miniprogram-ga4/blob/23e7d8e09b772eda133dae5d976405a019e58f8a/src/core/types.ts#L101)

货币字段约束：当设置 `value` 时，必须同时提供 `currency`（ISO 4217）

## Type Declaration

\{ `currency`: `string`; `value`: `number`; \}

### currency

> **currency**: `string`

货币代码（ISO 4217），如 `CNY`、`USD`

### value

> **value**: `number`

与事件相关的货币价值

\{ `currency?`: `string`; `value?`: `undefined`; \}

### currency?

> `optional` **currency**: `string`

不上报 value 时可省略

### value?

> `optional` **value**: `undefined`

不上报 value 时可省略
