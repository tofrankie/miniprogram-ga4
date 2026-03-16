export const LOG_LEVEL = {
  LOG: 'log',
  WARN: 'warn',
  ERROR: 'error',
} as const

export type LogLevel = (typeof LOG_LEVEL)[keyof typeof LOG_LEVEL]

export const STORAGE_KEY = {
  /** GA Cookie 用于区分用户，https://developers.google.com/analytics/devguides/collection/gtagjs/cookie-usage */
  GA: '_ga',
} as const

/** 默认数据上报域名（非欧盟） */
export const DEFAULT_TRANSPORT_URL = 'https://www.google-analytics.com'

/** 欧盟境内数据上报域名 */
export const EU_TRANSPORT_URL = 'https://region1.google-analytics.com' // https://developers.google.com/analytics/devguides/collection/protocol/ga4/validating-events?hl=zh-cn&client_type=gtag#send_events_for_validation

/** GA4 预留事件前缀 */
export const GA_RESERVED_PREFIX = ['google_', 'ga_', 'firebase_'] as const

/** GA4 预留事件名称 */
export const GA_RESERVED_EVENT = [
  'ad_activeview',
  'ad_click',
  'ad_exposure',
  'ad_impression',
  'ad_query',
  'adunit_exposure',
  'app_clear_data',
  'app_install',
  'app_update',
  'app_remove',
  'error',
  'first_open',
  'first_visit',
  'in_app_purchase',
  'notification_dismiss',
  'notification_foreground',
  'notification_open',
  'notification_receive',
  'os_update',
  'screen_view',
  'session_start',
  'user_engagement',
] as const

/** 预留的事件参数名称（不能作为自定义维度/指标使用），详见 https://support.google.com/analytics/answer/13316687 */
export const RESERVED_EVENT_PARAMS = [
  'cid',
  'currency',
  'customer_id',
  'customerid',
  'dclid',
  'gclid',
  'session_id',
  'sessionid',
  'sfmc_id',
  'sid',
  'srsltid',
  'uid',
  'user_id',
  'userid',
] as const

/** 参数名称不能以下列内容开头，详见 https://support.google.com/analytics/answer/13316687 */
export const RESERVED_PARAM_PREFIXES = ['_', 'firebase_', 'ga_', 'google_', 'gtag.'] as const

/* 内置事件 */
export const EVENT_NAME = {
  EVENT: 'event',
  PAGE_VIEW: 'page_view',
  EXCEPTION: 'exception',
  SEARCH: 'search',
  VIEW_ITEM_LIST: 'view_item_list',
  VIEW_CART: 'view_cart',
  VIEW_PROMOTION: 'view_promotion',
  SELECT_PROMOTION: 'select_promotion',
  SELECT_ITEM: 'select_item',
  VIEW_ITEM: 'view_item',
  SHARE: 'share',
  ADD_TO_WISHLIST: 'add_to_wishlist',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  BEGIN_CHECKOUT: 'begin_checkout',
  ADD_PAYMENT_INFO: 'add_payment_info',
  ADD_SHIPPING_INFO: 'add_shipping_info',
  PURCHASE: 'purchase',
  REFUND: 'refund',
} as const
