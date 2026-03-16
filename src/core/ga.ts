import type { LogLevel } from '@/core/constants'
import type {
  AddPaymentInfoEventParams,
  AddShippingInfoEventParams,
  AddToCartEventParams,
  AddToWishlistEventParams,
  BeginCheckoutEventParams,
  ConfigOptions,
  EventParams,
  MiniprogramAPI,
  PromotionEventParams,
  PurchaseEventParams,
  RefundEventParams,
  RemoveFromCartEventParams,
  SearchEventParams,
  SelectItemEventParams,
  ShareEventParams,
  ViewCartEventParams,
  ViewItemEventParams,
  ViewItemListEventParams,
} from '@/core/types'
import type { DeviceInfo } from '@/internal/device'
import type { EventSender } from '@/internal/sender'
import type { SessionManager } from '@/internal/session'
import { DEFAULT_TRANSPORT_URL, EU_TRANSPORT_URL, EVENT_NAME, LOG_LEVEL } from '@/core/constants'
import { getDeviceInfo } from '@/internal/device'
import { createSender } from '@/internal/sender'
import { createSessionManager } from '@/internal/session'
import {
  formatMiniprogramPath,
  getClientId,
  getMiniprogramCurrentPath,
  isObj,
  isStr,
} from '@/internal/utils'
import { validateEventName, validateEventParams } from '@/internal/validate'

const REQUIRED_API_METHODS: Array<keyof MiniprogramAPI> = [
  'getStorageSync',
  'setStorageSync',
  'onAppShow',
  'request',
]

function getDefaultApi(): MiniprogramAPI | undefined {
  if (typeof wx === 'object' && wx != null) return wx as unknown as MiniprogramAPI
  return undefined
}

function assertApi(api: MiniprogramAPI | undefined): MiniprogramAPI {
  if (!api) throw new Error('无效的小程序 API：缺少 api 对象。')

  for (const methodName of REQUIRED_API_METHODS) {
    if (typeof api[methodName] !== 'function') {
      throw new TypeError(`无效的小程序 API：缺少 ${String(methodName)}() 方法。`)
    }
  }

  return api
}

/**
 * Google Analytics 4 for miniprogram
 */
export class GA {
  #measurementId = ''
  #apiSecret = ''
  #transportUrl = ''
  #debugEnable = false
  #api?: MiniprogramAPI
  #session?: SessionManager
  #sender?: EventSender
  #deviceInfo?: DeviceInfo
  /**
   * 初始化
   * @param measurementId Measurement ID
   * @param apiSecret Measurement Protocol API Secret
   * @param options 可选配置项
   */
  config(measurementId: string, apiSecret: string, options?: ConfigOptions): void {
    this.#debugEnable = options?.debug ?? false
    if (this.#measurementId) return

    if (!measurementId || !apiSecret) {
      this.#log('measurementId 和 apiSecret 为必填项。', LOG_LEVEL.ERROR, true)
      return
    }

    if (measurementId.startsWith('UA-')) {
      this.#log(
        `${measurementId} 是 UA 的 Tracking ID，不是 GA4 的 Measurement ID。`,
        LOG_LEVEL.ERROR,
        true
      )
      return
    }

    const api = assertApi(options?.api ?? getDefaultApi())
    this.#measurementId = measurementId
    this.#apiSecret = apiSecret
    const defaultTransportUrl = options?.eu ? EU_TRANSPORT_URL : DEFAULT_TRANSPORT_URL
    this.#transportUrl = options?.transportUrl ?? defaultTransportUrl
    this.#api = api
    this.#session = createSessionManager(api)
    this.#deviceInfo = getDeviceInfo(api)
    this.#sender = createSender({
      api,
      measurementId: this.#measurementId,
      apiSecret: this.#apiSecret,
      transportUrl: this.#transportUrl,
      getClientId: () => getClientId(api),
      deviceInfo: this.#deviceInfo,
      log: message => this.#log(message),
    })

    this.#log('初始化完成')
  }

  /**
   * 上报 event 事件，或直接上报任意自定义事件
   * @param categoryOrEventName event 事件的类型，或自定义事件名称
   * @param actionOrEventParams event 事件的操作，或自定义事件参数
   * @param label event 事件的标签（仅 event 用法）
   * @param value event 事件的值（仅 event 用法）
   */
  event(category: string, action: string, label?: string, value?: number): void
  event(eventName: string, eventParams: EventParams): void
  event(
    categoryOrEventName: string,
    actionOrEventParams: string | EventParams,
    label?: string,
    value?: number
  ): void {
    if (!categoryOrEventName || !actionOrEventParams) {
      this.#log('categoryOrEventName 和 actionOrEventParams 为必填项。')
      return
    }

    if (isStr(categoryOrEventName) && isStr(actionOrEventParams)) {
      this.#emit(EVENT_NAME.EVENT, {
        category: categoryOrEventName,
        action: actionOrEventParams,
        label,
        value,
      })
      return
    }

    if (isObj(actionOrEventParams)) {
      this.#emit(categoryOrEventName, actionOrEventParams)
      return
    }

    this.#log('actionOrEventParams 必须是字符串或对象。')
  }

  /**
   * 页面浏览（{@link https://developers.google.com/analytics/devguides/collection/ga4/views?client_type=gtag 更多}）
   * @param pageTitle 页面标题
   * @param pageLocation 页面地址，不传则自动取当前小程序页面路径
   * @param pageReferrer 页面来源
   */
  pageView(pageTitle: string, pageLocation = '', pageReferrer = ''): void {
    if (!pageTitle || !isStr(pageTitle)) {
      this.#log('pageTitle 必须是非空字符串。')
      return
    }

    let newPageLocation = pageLocation
    let newPageReferrer = pageReferrer

    if (!newPageLocation) newPageLocation = getMiniprogramCurrentPath()

    newPageLocation = formatMiniprogramPath(newPageLocation)
    newPageReferrer = formatMiniprogramPath(newPageReferrer)

    this.#emit(EVENT_NAME.PAGE_VIEW, {
      page_title: pageTitle,
      page_location: newPageLocation,
      page_referrer: newPageReferrer,
    })
  }

  /**
   * 异常事件（{@link https://developers.google.com/analytics/devguides/collection/ga4/exceptions 更多}）
   * @param description 异常描述
   * @param fatal 若是严重异常则为 `true`（默认为 `false`）
   */
  exception(description: string, fatal = false): void {
    if (!description || !isStr(description)) {
      this.#log('description 必须是非空字符串。')
      return
    }

    this.#emit(EVENT_NAME.EXCEPTION, {
      description: description.substring(0, 99),
      fatal,
    })
  }

  /**
   * 搜索（{@link https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#search 更多}）
   * @param eventParams
   */
  search(eventParams: SearchEventParams): void {
    this.#emit(EVENT_NAME.SEARCH, eventParams)
  }

  /**
   * 查看商品列表（{@link https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#view_item_list 更多}）
   * @param eventParams
   */
  viewItemList(eventParams: ViewItemListEventParams): void {
    this.#emit(EVENT_NAME.VIEW_ITEM_LIST, eventParams)
  }

  /**
   * 查看购物车（{@link https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#view_cart 更多}）
   * @param eventParams
   */
  viewCart(eventParams: ViewCartEventParams): void {
    this.#emit(EVENT_NAME.VIEW_CART, eventParams)
  }

  /**
   * 查看推广活动（{@link https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#view_promotion 更多}）
   * @param eventParams
   */
  viewPromotion(eventParams: PromotionEventParams): void {
    this.#emit(EVENT_NAME.VIEW_PROMOTION, eventParams)
  }

  /**
   * 从列表中选择推广活动（{@link https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#select_promotion 更多}）
   * @param eventParams
   */
  selectPromotion(eventParams: PromotionEventParams): void {
    this.#emit(EVENT_NAME.SELECT_PROMOTION, eventParams)
  }

  /**
   * 从列表中选择商品（{@link https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#select_item 更多}）
   * @param eventParams
   */
  selectItem(eventParams: SelectItemEventParams): void {
    this.#emit(EVENT_NAME.SELECT_ITEM, eventParams)
  }

  /**
   * 用户查看商品（{@link https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#view_item 更多}）
   * @param eventParams
   */
  viewItem(eventParams: ViewItemEventParams): void {
    this.#emit(EVENT_NAME.VIEW_ITEM, eventParams)
  }

  /**
   * 用户分享商品（{@link https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#share 更多}）
   * @param eventParams
   */
  share(eventParams: ShareEventParams): void {
    this.#emit(EVENT_NAME.SHARE, eventParams)
  }

  /**
   * 商品已添加到心愿单（{@link https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#add_to_wishlist 更多}）
   * @param eventParams
   */
  addToWishlist(eventParams: AddToWishlistEventParams): void {
    this.#emit(EVENT_NAME.ADD_TO_WISHLIST, eventParams)
  }

  /**
   * 商品已添加到购物车（{@link https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#add_to_cart 更多}）
   * @param eventParams
   */
  addToCart(eventParams: AddToCartEventParams): void {
    this.#emit(EVENT_NAME.ADD_TO_CART, eventParams)
  }

  /**
   * 商品已从购物车中移除（{@link https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#remove_from_cart 更多}）
   * @param eventParams
   */
  removeFromCart(eventParams: RemoveFromCartEventParams): void {
    this.#emit(EVENT_NAME.REMOVE_FROM_CART, eventParams)
  }

  /**
   * 用户已开始结账流程（{@link https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#begin_checkout 更多}）
   * @param eventParams
   */
  beginCheckout(eventParams: BeginCheckoutEventParams): void {
    this.#emit(EVENT_NAME.BEGIN_CHECKOUT, eventParams)
  }

  /**
   * 用户已提交付款信息（{@link https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#add_payment_info 更多}）
   * @param eventParams
   */
  addPaymentInfo(eventParams: AddPaymentInfoEventParams): void {
    this.#emit(EVENT_NAME.ADD_PAYMENT_INFO, eventParams)
  }

  /**
   * 用户已提交配送信息（{@link https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#add_shipping_info 更多}）
   * @param eventParams
   */
  addShippingInfo(eventParams: AddShippingInfoEventParams): void {
    this.#emit(EVENT_NAME.ADD_SHIPPING_INFO, eventParams)
  }

  /**
   * 用户已购买商品（{@link https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#purchase 更多}）
   * @param eventParams
   */
  purchase(eventParams: PurchaseEventParams): void {
    this.#emit(EVENT_NAME.PURCHASE, eventParams)
  }

  /**
   * 用户已退回商品（{@link https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#refund 更多}）
   * @param eventParams
   */
  refund(eventParams: RefundEventParams): void {
    this.#emit(EVENT_NAME.REFUND, eventParams)
  }

  #emit(eventName: string, eventParams: EventParams = {}): void {
    try {
      if (!this.#measurementId || !this.#api || !this.#sender || !this.#session) {
        this.#log('调用事件上报前，请使用 config() 完成初始化。', LOG_LEVEL.WARN, true)
        return
      }

      const eventNameError = validateEventName(eventName)
      if (eventNameError) {
        const isReserved = eventNameError.includes('预留名称')
        this.#log(eventNameError, isReserved ? LOG_LEVEL.WARN : LOG_LEVEL.WARN, isReserved)
        return
      }

      if (!isObj(eventParams)) {
        this.#log('eventParams 必须是对象类型。')
        return
      }

      // 必须添加 engagement_time_msec 和 session_id 参数，才能在实时等报告中显示用户活动。https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?hl=zh-cn&client_type=gtag#common_params
      const mergedEventParams: EventParams = {
        engagement_time_msec: 1000, // 若不传，可能会导致分配到 not set 中
        session_id: this.#session.currentSessionId(),
        ...eventParams,
      }

      const eventParamsError = validateEventParams(mergedEventParams)
      if (eventParamsError) {
        this.#log(eventParamsError)
        return
      }

      this.#log(
        `事件 '${eventName}' 已加入发送队列：\n${JSON.stringify(mergedEventParams, null, 2)}`
      )
      this.#sender.enqueue(eventName, mergedEventParams)
    } catch (error) {
      // 避免影响业务逻辑
      console.error(error)
    }
  }

  #log(message: string, level: LogLevel = LOG_LEVEL.LOG, force = false): void {
    if (!message) return
    if (!force && !this.#debugEnable) return

    let prefix = '[miniprogram-ga]'
    if (level === LOG_LEVEL.WARN) prefix = `${prefix} [Warning]`
    if (level === LOG_LEVEL.ERROR) prefix = `${prefix} [Error]`

    console.log(`%c${prefix}`, 'font-weight:bold', message)
  }
}
