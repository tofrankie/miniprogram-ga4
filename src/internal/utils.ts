import type { MiniprogramAPI } from '@/core/types'
import { GA_RESERVED_EVENT, GA_RESERVED_PREFIX, STORAGE_KEY } from '@/core/constants'

export const isStr = (value: unknown): value is string => typeof value === 'string'

export function isObj(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]'
}

/**
 * 判断是否为预留事件或预留前缀（{@link https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#reserved_names | 更多}）
 * @param eventName
 */
export function isReserved(eventName: string): boolean {
  return Boolean(
    eventName &&
    (GA_RESERVED_EVENT.includes(eventName as (typeof GA_RESERVED_EVENT)[number]) ||
      GA_RESERVED_PREFIX.some(prefix => eventName.startsWith(prefix)))
  )
}

/**
 * 生成 Web 版 GA 格式相同的 GA Cookie 用于区分用户
 */
function genGaCookie(): string {
  const now = Math.floor(Date.now() / 1000)
  const randomStr = Math.random().toFixed(10).slice(2)
  // 格式：`版本号.网域层级.10位随机数.时间戳`，比如：`GA1.1.1959271138.1764522292`
  return `GA1.1.${randomStr}.${now}`
}

/**
 * 获取 Client ID
 * @param api
 */
export function getClientId(api: MiniprogramAPI): string {
  const key = STORAGE_KEY.GA
  let gaCookie = api.getStorageSync(key)

  if (!gaCookie) {
    gaCookie = genGaCookie()
    api.setStorageSync(key, gaCookie)
  }

  // `_ga` 最后两段（随机数.时间戳）即 Client ID
  return gaCookie.split('.').splice(-2).join('.')
}

/**
 * 获取小程序当前路径
 */
export function getMiniprogramCurrentPath(): string {
  const pages = getCurrentPages()
  if (!Array.isArray(pages) || pages.length === 0) return ''
  const currentPage = pages.at(-1)
  return currentPage?.route || ''
}

/**
 * 格式化小程序路径：`pages/index/index` → `https://miniprogram.com/pages/index/index`
 *
 * 原因及解决方案：
 *  1. 小程序路径不同于网页 URL，直接上报到 GA 会被判断无效地址，这样网页位置维度将为空。
 *  2. 在小程序路径前统一添加 `https://miniprogram.com`（取包名组合而来，可能是不存在的域名）是为了让系统自动划分并填充网页位置、网页路径维度。
 *
 * 相关链接：
 *  - https://support.google.com/analytics/answer/9234069
 *  - https://support.google.com/analytics/answer/9143382#page-screen
 * @param route 小程序路径
 */
export function formatMiniprogramPath(route: string): string {
  if (!route || !isStr(route)) return route

  let normalizedPath = route
  const reg = /^https?:\/\//
  const prefix = 'https://miniprogram.com/'
  if (!reg.test(normalizedPath)) {
    normalizedPath = prefix + normalizedPath.replace(/^\//, '')
  }

  // page_location/page_referrer 最多 420 字符
  return normalizedPath.substring(0, 419)
}
/**
 * 获取 Session ID（{@link https://support.google.com/analytics/answer/9191807 GA4 会话简介}）
 * @param sessionId
 * @param timestamp
 */
export function getSessionId(sessionId: string, timestamp: number): [string, number] {
  const now = Math.floor(Date.now() / 1000)
  const newSessionId = Math.random().toString(36).slice(2)

  if (!sessionId) return [newSessionId, now]

  // GA 默认设定：超过 30min 不活跃视为会话结束
  const thirtyMinutes = 30 * 60 // 单位秒
  if (thirtyMinutes > now - timestamp) return [sessionId, now]

  return [newSessionId, now]
}

export function throttle<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  wait: number
): (...args: TArgs) => void {
  let prev = 0
  let timerId: ReturnType<typeof setTimeout> | undefined

  return function (this: unknown, ...args: TArgs) {
    const now = Date.now()
    if (timerId) clearTimeout(timerId)

    if (prev && now >= prev + wait) {
      prev = now
      fn.apply(this, args)
    } else {
      timerId = setTimeout(() => {
        prev = now
        fn.apply(this, args)
      }, wait)
    }
  }
}
