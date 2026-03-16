import type { MiniprogramAPI } from '@/core/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GA } from '@/core/ga'

function createApiMock(): MiniprogramAPI {
  return {
    getStorageSync: vi.fn(() => ''),
    setStorageSync: vi.fn(),
    onAppShow: vi.fn(),
    request: vi.fn(),
  }
}

describe('GA config api contract', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('throws when api contract is invalid', () => {
    const ga = new GA()
    expect(() =>
      ga.config('G-TEST', 'secret', {
        api: {
          getStorageSync: () => '',
          setStorageSync: () => {},
          onAppShow: () => {},
          request: undefined as unknown as MiniprogramAPI['request'],
        },
      })
    ).toThrowError('无效的小程序 API：缺少 request() 方法。')
  })

  it('supports wx/my/tt aliases with same contract', () => {
    vi.useFakeTimers()
    vi.stubGlobal('getCurrentPages', () => [{ route: 'pages/index/index' }])

    const wx = createApiMock()
    const my = createApiMock()
    const tt = createApiMock()

    const gaWx = new GA()
    gaWx.config('G-WX', 'secret', { api: wx })
    gaWx.pageView('wx')
    vi.advanceTimersByTime(500)
    expect(wx.request).toHaveBeenCalledTimes(1)

    const gaMy = new GA()
    gaMy.config('G-MY', 'secret', { api: my })
    gaMy.pageView('my')
    vi.advanceTimersByTime(500)
    expect(my.request).toHaveBeenCalledTimes(1)

    const gaTt = new GA()
    gaTt.config('G-TT', 'secret', { api: tt })
    gaTt.pageView('tt')
    vi.advanceTimersByTime(500)
    expect(tt.request).toHaveBeenCalledTimes(1)
  })

  it('when debug is true, rejects reserved event param and does not send request', () => {
    vi.useFakeTimers()
    vi.stubGlobal('getCurrentPages', () => [{ route: 'pages/index/index' }])

    const api = createApiMock()
    const ga = new GA()
    ga.config('G-DEBUG', 'secret', { api, debug: true })

    ga.event('custom_event', { uid: 'should_be_blocked' })
    vi.advanceTimersByTime(500)

    expect(api.request).not.toHaveBeenCalled()
  })
})

describe('GA #emit guards and validation', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('does not send request when config was never called', () => {
    vi.useFakeTimers()
    vi.stubGlobal('getCurrentPages', () => [{ route: 'pages/index/index' }])
    const api = createApiMock()
    vi.stubGlobal('wx', api)

    const ga = new GA()
    ga.pageView('page title')
    vi.advanceTimersByTime(500)

    expect(api.request).not.toHaveBeenCalled()
  })

  it('does not init or send when measurementId is UA- (legacy)', () => {
    vi.useFakeTimers()
    vi.stubGlobal('getCurrentPages', () => [{ route: 'pages/index/index' }])

    const api = createApiMock()
    const ga = new GA()
    ga.config('UA-123-1', 'secret', { api })
    ga.pageView('p')
    vi.advanceTimersByTime(500)

    expect(api.request).not.toHaveBeenCalled()
  })

  it('does not send when eventParams is not an object', () => {
    vi.useFakeTimers()
    vi.stubGlobal('getCurrentPages', () => [{ route: 'pages/index/index' }])

    const api = createApiMock()
    const ga = new GA()
    ga.config('G-X', 'secret', { api })
    ga.search(123 as never)
    vi.advanceTimersByTime(500)

    expect(api.request).not.toHaveBeenCalled()
  })

  it('does not send when event name is reserved (e.g. screen_view)', () => {
    vi.useFakeTimers()
    vi.stubGlobal('getCurrentPages', () => [{ route: 'pages/index/index' }])

    const api = createApiMock()
    const ga = new GA()
    ga.config('G-X', 'secret', { api })
    ga.event('screen_view', { page_title: 'x' })
    vi.advanceTimersByTime(500)

    expect(api.request).not.toHaveBeenCalled()
  })

  it('when debug is false, sends request even if user passes reserved param name', () => {
    vi.useFakeTimers()
    vi.stubGlobal('getCurrentPages', () => [{ route: 'pages/index/index' }])

    const api = createApiMock()
    const ga = new GA()
    ga.config('G-X', 'secret', { api, debug: false })
    ga.event('my_event', { uid: 'allowed_when_not_debug' })
    vi.advanceTimersByTime(500)

    expect(api.request).toHaveBeenCalledTimes(1)
    const payload = JSON.parse(vi.mocked(api.request).mock.calls[0]?.[0]?.data ?? '{}')
    expect(payload.events).toHaveLength(1)
    expect(payload.events[0].params).toMatchObject({ uid: 'allowed_when_not_debug' })
  })
})
