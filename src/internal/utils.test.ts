import type { MiniprogramAPI } from '@/core/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  formatMiniprogramPath,
  getClientId,
  getMiniprogramCurrentPath,
  getSessionId,
  isObj,
  isReserved,
  isStr,
  throttle,
} from '@/internal/utils'

function createApiMock(): MiniprogramAPI {
  const storage = new Map<string, string>()
  return {
    getStorageSync: vi.fn((key: string) => storage.get(key) || ''),
    setStorageSync: vi.fn((key: string, value: string) => {
      storage.set(key, value)
    }),
    onAppShow: vi.fn(),
    request: vi.fn(),
  }
}

describe('internal/utils', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('isStr / isObj works', () => {
    expect(isStr('a')).toBe(true)
    expect(isStr(1)).toBe(false)
    expect(isObj({ a: 1 })).toBe(true)
    expect(isObj([])).toBe(false)
  })

  it('isReserved works', () => {
    expect(isReserved('screen_view')).toBe(true)
    expect(isReserved('ga_custom_event')).toBe(true)
    expect(isReserved('custom_event')).toBe(false)
  })

  it('formatMiniprogramPath works', () => {
    expect(formatMiniprogramPath('pages/home/index')).toBe('https://miniprogram.com/pages/home/index')
    expect(formatMiniprogramPath('/pages/home/index')).toBe('https://miniprogram.com/pages/home/index')
    expect(formatMiniprogramPath('https://example.com/p')).toBe('https://example.com/p')
    expect(formatMiniprogramPath('a'.repeat(600)).length).toBe(419)
  })

  it('getSessionId creates/keeps session by timeout', () => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    const [firstSession, firstTs] = getSessionId('', 0)
    expect(firstSession).toBeTruthy()

    vi.setSystemTime(new Date('2026-01-01T00:10:00Z'))
    const [sameSession, secondTs] = getSessionId(firstSession, firstTs)
    expect(sameSession).toBe(firstSession)
    expect(secondTs).toBeGreaterThan(firstTs)

    vi.setSystemTime(new Date('2026-01-01T01:00:00Z'))
    const [newSession] = getSessionId(firstSession, secondTs)
    expect(newSession).not.toBe(firstSession)
  })

  it('throttle runs trailing and throttled calls', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const wrapped = throttle(fn, 200)

    wrapped('a')
    wrapped('b')
    expect(fn).toHaveBeenCalledTimes(0)
    vi.advanceTimersByTime(200)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenLastCalledWith('b')

    wrapped('c')
    vi.advanceTimersByTime(200)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith('c')
  })

  it('getClientId reads and writes storage', () => {
    const api = createApiMock()
    const id = getClientId(api)
    expect(id).toMatch(/^\d+\.\d+$/)
    expect(api.setStorageSync).toHaveBeenCalledTimes(1)

    const idAgain = getClientId(api)
    expect(idAgain).toBe(id)
    expect(api.setStorageSync).toHaveBeenCalledTimes(1)
  })

  it('getMiniprogramCurrentPath handles page stacks', () => {
    vi.stubGlobal('getCurrentPages', () => [])
    expect(getMiniprogramCurrentPath()).toBe('')

    vi.stubGlobal('getCurrentPages', () => [{ route: 'pages/single/index' }])
    expect(getMiniprogramCurrentPath()).toBe('pages/single/index')

    vi.stubGlobal('getCurrentPages', () => [{ route: 'pages/a/index' }, { route: 'pages/b/index' }])
    expect(getMiniprogramCurrentPath()).toBe('pages/b/index')
  })
})
