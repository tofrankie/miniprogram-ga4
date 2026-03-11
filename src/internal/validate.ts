import { isObj, isReserved, isStr } from '@/internal/utils'

// 事件名称限制：以字母开头，40 个字符以内，只能是字母、数字、下划线
const EVENT_NAME_REG = /^[a-z]\w{0,39}$/i

export function validateEventName(eventName: unknown): string | null {
  if (!eventName || !isStr(eventName)) return 'eventName 必须是非空字符串。'

  if (isReserved(eventName)) {
    return `事件名称 '${eventName}' 为预留名称，或使用了预留前缀，不能用于自定义上报。详见：https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#reserved_names`
  }

  if (!EVENT_NAME_REG.test(eventName)) {
    return '事件名称必须以字母开头，且仅可包含字母、数字、下划线，不能包含空格。详见：https://support.google.com/analytics/answer/13316687'
  }

  return null
}

export function validateEventParams(eventParams: unknown): string | null {
  if (!isObj(eventParams)) return 'eventParams 必须是对象类型。'

  const eventParamCount = Object.keys(eventParams).length
  // 每个事件的事件参数数量不能超过 25 个
  if (eventParamCount > 25) return '事件参数数量不能超过 25 个。'

  return null
}
