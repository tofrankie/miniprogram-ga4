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
})
