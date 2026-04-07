import { describe, expect, it } from 'vitest'
import { validateEventName, validateEventParamNames, validateEventParams } from '@/internal/validate'

const DOC_URL = 'https://support.google.com/analytics/answer/13316687'

describe('validateEventName', () => {
  it('rejects empty or non-string', () => {
    expect(validateEventName('')).toBe('eventName 必须是非空字符串。')
    expect(validateEventName(null)).toBe('eventName 必须是非空字符串。')
    expect(validateEventName(1)).toBe('eventName 必须是非空字符串。')
  })

  it('rejects reserved names and prefixes', () => {
    expect(validateEventName('screen_view')).toContain('预留名称')
    expect(validateEventName('ga_custom')).toContain('预留名称')
  })

  it('rejects invalid format: must start with letter, max 40 chars, no spaces', () => {
    expect(validateEventName('123abc')).toContain('必须以字母开头')
    expect(validateEventName('ab cd')).toContain('不能包含空格')
    expect(validateEventName('a'.repeat(41))).toContain('必须以字母开头')
    expect(validateEventName('a'.repeat(41))).toContain(DOC_URL)
  })

  it('accepts valid event names', () => {
    expect(validateEventName('my_event')).toBe(null)
    expect(validateEventName('Search')).toBe(null)
    expect(validateEventName('a'.repeat(40))).toBe(null)
  })
})

describe('validateEventParamNames', () => {
  it('rejects reserved param names (case-insensitive)', () => {
    const err1 = validateEventParamNames({ session_id: 'x' })
    expect(err1).toContain("'session_id' 为预留名称")
    expect(err1).toContain(DOC_URL)

    expect(validateEventParamNames({ uid: 1 })).toContain("'uid' 为预留名称")
    expect(validateEventParamNames({ USER_ID: 'a' })).toContain("'USER_ID' 为预留名称")
  })

  it('rejects param names starting with forbidden prefixes', () => {
    expect(validateEventParamNames({ _private: 1 })).toContain('不能以下列内容开头')
    expect(validateEventParamNames({ ga_custom: 1 })).toContain('不能以下列内容开头')
    expect(validateEventParamNames({ google_foo: 1 })).toContain('不能以下列内容开头')
    expect(validateEventParamNames({ firebase_xxx: 1 })).toContain('不能以下列内容开头')
    expect(validateEventParamNames({ 'gtag.whatever': 1 })).toContain('不能以下列内容开头')
    expect(validateEventParamNames({ 'gtag.whatever': 1 })).toContain(DOC_URL)
  })

  it('accepts valid param names', () => {
    expect(validateEventParamNames({})).toBe(null)
    expect(validateEventParamNames({ page_title: 'Home' })).toBe(null)
    expect(validateEventParamNames({ custom_dimension_1: 'a' })).toBe(null)
  })
})

describe('validateEventParams', () => {
  it('rejects non-object', () => {
    expect(validateEventParams(null)).toBe('eventParams 必须是对象类型。')
    expect(validateEventParams('')).toBe('eventParams 必须是对象类型。')
    expect(validateEventParams([])).toBe('eventParams 必须是对象类型。')
  })

  it('rejects more than 25 keys', () => {
    const many: Record<string, number> = {}
    for (let i = 0; i < 26; i++) many[`key_${i}`] = i
    expect(validateEventParams(many)).toBe('事件参数数量不能超过 25 个。')
  })

  it('accepts valid object with up to 25 keys', () => {
    expect(validateEventParams({})).toBe(null)
    const many: Record<string, number> = {}
    for (let i = 0; i < 25; i++) many[`key_${i}`] = i
    expect(validateEventParams(many)).toBe(null)
  })
})
