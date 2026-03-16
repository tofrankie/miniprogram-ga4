import type { MiniprogramAPI } from '@/core/types'

/** 设备类别枚举（与 GA4 device.category 对齐） */
export const DEVICE_CATEGORY = ['mobile', 'desktop', 'devtools'] as const
export type DeviceCategory = (typeof DEVICE_CATEGORY)[number]

/** 微信 platform 到设备类别的映射 */
const PLATFORM_TO_CATEGORY: Record<DeviceCategory, readonly string[]> = {
  mobile: ['ios', 'android', 'ohos'],
  desktop: ['windows', 'mac', 'ohos_pc'],
  devtools: ['devtools'],
}

const DEFAULT_DEVICE_CATEGORY: DeviceCategory = 'mobile'

export interface DeviceInfo {
  /** 设备类型，如 `mobile`, `desktop`, `tablet`, `devtools` 等 */
  category: DeviceCategory
  /** 语言 [ISO 639-1](https://www.wikiwand.com/en/ISO_639-1) 代码，如 `en`, `zh` */
  language: string
  /** 屏幕分辨率，如 `1280x2856` */
  screen_resolution: string
  /** 操作系统，如 `Android`, `iOS`, `Windows`, `macOS`, `Linux` */
  operating_system: string
  /** 操作系统版本，如 `14` */
  operating_system_version: string
  /** 设备型号，如 `Pixel 9 Pro` */
  model: string
  /** 设备品牌，如 `Google`, `Apple` */
  brand: string
  /** 浏览器，如 `Chrome`, `Safari`, `WeChat` */
  browser: string
  /** 浏览器版本，如 `136.0.7103.60` */
  browser_version: string
}

// https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?hl=zh-cn&client_type=gtag#payload_device_info
// const exampleDeviceInfo: DeviceInfo = {
//   category: 'mobile',
//   language: 'en',
//   screen_resolution: '1280x2856',
//   operating_system: 'Android',
//   operating_system_version: '14',
//   model: 'Pixel 9 Pro',
//   brand: 'Google',
//   browser: 'Chrome',
//   browser_version: '136.0.7103.60',
// }

export function getDeviceInfo(api: MiniprogramAPI): DeviceInfo | undefined {
  if (!api) return undefined

  const rawInfo = getRawInfo(api)
  if (!rawInfo) return undefined

  const { appBaseInfo, windowInfo, deviceInfo } = rawInfo
  const category = platform2category(deviceInfo.platform)
  const [osName, osVersion] = parseOperatingSystemInfo(deviceInfo.system)

  return {
    category,
    language: appBaseInfo?.language ?? '', // 微信设置的语言
    screen_resolution: `${windowInfo?.screenWidth}x${windowInfo?.screenHeight}`,
    operating_system: osName,
    operating_system_version: osVersion,
    model: deviceInfo?.model ?? '',
    brand: deviceInfo?.brand ?? '',
    browser: 'Miniprogram', // TODO: 暂无意义
    browser_version: appBaseInfo?.SDKVersion ?? '', // 记录基础库版本
  }
}

function getRawInfo(api?: MiniprogramAPI):
  | {
      appBaseInfo: WechatMiniprogram.AppBaseInfo
      windowInfo: WechatMiniprogram.WindowInfo
      deviceInfo: WechatMiniprogram.DeviceInfo
    }
  | undefined {
  // TODO: 暂时只支持微信小程序
  // 基础库 2.20.1+
  if (
    !api ||
    typeof api.getAppBaseInfo !== 'function' ||
    typeof api.getWindowInfo !== 'function' ||
    typeof api.getDeviceInfo !== 'function'
  ) {
    return undefined
  }

  return {
    appBaseInfo: api.getAppBaseInfo(),
    windowInfo: api.getWindowInfo(),
    deviceInfo: api.getDeviceInfo(),
  }
}

/**
 * 根据微信 platform 判断设备类别
 * @param platform
 */
function platform2category(platform: WechatMiniprogram.DeviceInfo['platform']): DeviceCategory {
  if (!platform) return DEFAULT_DEVICE_CATEGORY
  const p = platform.toLowerCase()

  for (const category of DEVICE_CATEGORY) {
    if (PLATFORM_TO_CATEGORY[category].includes(p)) {
      return category
    }
  }

  return DEFAULT_DEVICE_CATEGORY
}

/**
 * 从微信 system 字符串解析出系统名与版本，如 "Android 10" -> ["Android", "10"]
 * @param system
 */
function parseOperatingSystemInfo(system: string | undefined): [string, string] {
  if (!system) return ['', '']

  const [name, version] = system.split(' ')
  return [name, version]
}
