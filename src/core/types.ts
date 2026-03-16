export interface MiniprogramRequestOptions {
  /** 请求地址 */
  url: string
  /** HTTP 方法，当前库固定为 POST */
  method: string
  /** 序列化后的请求体 */
  data?: string
  /** 请求头 */
  header?: Record<string, string>
  /** 请求成功回调 */
  success?: () => void
  /** 请求失败回调 */
  fail?: (err: unknown) => void
  /** 请求完成回调 */
  complete?: () => void
}

export interface MiniprogramAPI {
  /** 读取本地存储 */
  getStorageSync: (key: string) => string
  /** 写入本地存储 */
  setStorageSync: (key: string, value: string) => void
  /** 监听小程序切前台 */
  onAppShow: (callback: () => void) => void
  /** 发起网络请求 */
  request: (options: MiniprogramRequestOptions) => void
  /** 获取小程序基础信息（如 language、version），微信 2.20.1+ */
  getAppBaseInfo?: () => WechatMiniprogram.AppBaseInfo
  /** 获取窗口信息（如 screenWidth、screenHeight），微信 2.20.1+ */
  getWindowInfo?: () => WechatMiniprogram.WindowInfo
  /** 获取设备信息（如 brand、model、system），微信 2.20.1+ */
  getDeviceInfo?: () => WechatMiniprogram.DeviceInfo
}

export interface ConfigOptions {
  /** 数据上报域名；未指定时由 `eu` 决定：`eu: true` 为 `https://region1.google-analytics.com`，否则为 `https://www.google-analytics.com` */
  transportUrl?: string
  /** 是否在欧盟境内收集数据；为 true 时默认使用 region1 域名 */
  eu?: boolean
  /** 开启调试日志 */
  debug?: boolean
  /** 当前端小程序 API 命名空间（默认微信小程序的 `wx`） */
  api?: MiniprogramAPI
}

export interface Item {
  /** 商品 ID（必填） */
  item_id: string
  /** 商品名称（必填） */
  item_name: string
  /** 商品关联商户 */
  affiliation?: string
  /** 优惠券名称/代码 */
  coupon?: string
  /** 促销素材名称 */
  creative_name?: string
  /** 促销素材广告位 */
  creative_slot?: string
  /** 折扣金额 */
  discount?: number
  /** 商品在列表中的索引 */
  index?: number
  /** 商品品牌 */
  item_brand?: string
  /** 一级类目 */
  item_category?: string
  /** 二级类目 */
  item_category2?: string
  /** 三级类目 */
  item_category3?: string
  /** 四级类目 */
  item_category4?: string
  /** 五级类目 */
  item_category5?: string
  /** 商品列表 ID */
  item_list_id?: string
  /** 商品列表名称 */
  item_list_name?: string
  /** 商品规格/款式 */
  item_variant?: string
  /** 实体位置 ID */
  location_id?: string
  /** 商品价格 */
  price?: number
  /** 促销活动 ID */
  promotion_id?: string
  /** 促销活动名称 */
  promotion_name?: string
  /** 商品数量 */
  quantity?: number
}

/** 自定义事件参数（`ga.event('custom_event', params)`） */
export type EventParams = Record<string, unknown>

/** 通用 `event` 事件参数 */
export interface CommonEventParams extends EventParams {
  /** 事件类别，常以页面为单位 */
  category: string
  /** 事件操作，常以事件目标 + 操作组成 */
  action: string
  /** 事件标签，通常用于更具体地描述事件目标 */
  label?: string
  /** 事件值，可用于时长、数量等 */
  value?: number
}

/** 货币字段约束：当设置 `value` 时，必须同时提供 `currency`（ISO 4217） */
export type CurrencyValueParams =
  | {
      /** 与事件相关的货币价值 */
      value: number
      /** 货币代码（ISO 4217），如 `CNY`、`USD` */
      currency: string
    }
  | {
      /** 不上报 value 时可省略 */
      value?: undefined
      /** 不上报 value 时可省略 */
      currency?: string
    }

/** `search` 事件参数 */
export interface SearchEventParams extends EventParams {
  /** 用户搜索的字词 */
  search_term: string
}

/** `view_item_list` 事件参数 */
export interface ViewItemListEventParams extends EventParams {
  /** 与事件相关的商品列表 */
  items: Item[]
  /** 商品列表 ID */
  item_list_id?: string
  /** 商品列表名称 */
  item_list_name?: string
}

/** `view_cart` 事件参数 */
export type ViewCartEventParams = ViewItemListEventParams

/** `view_promotion` / `select_promotion` 事件参数 */
export interface PromotionEventParams extends EventParams {
  /** 与事件相关的商品列表 */
  items: Item[]
  /** 促销广告素材名称 */
  creative_name?: string
  /** 促销广告位名称 */
  creative_slot?: string
  /** 促销活动 ID */
  promotion_id?: string
  /** 促销活动名称 */
  promotion_name?: string
}

/** `select_item` 事件参数 */
export type SelectItemEventParams = ViewItemListEventParams

/** `view_item` 事件参数 */
export type ViewItemEventParams = {
  /** 与事件相关的商品列表 */
  items: Item[]
} & CurrencyValueParams &
  EventParams

/** `share` 事件参数 */
export interface ShareEventParams extends EventParams {
  /** 分享方式，如 `Twitter`、`Wechat` */
  method: string
  /** 被分享内容的类型 */
  content_type?: string
  /** 被分享内容的 ID */
  item_id?: string
}

/** `add_to_wishlist` 事件参数 */
export type AddToWishlistEventParams = ViewItemEventParams
/** `add_to_cart` 事件参数 */
export type AddToCartEventParams = ViewItemEventParams
/** `remove_from_cart` 事件参数 */
export type RemoveFromCartEventParams = ViewItemEventParams

/** `begin_checkout` 事件参数 */
export type BeginCheckoutEventParams = ViewItemEventParams & {
  /** 优惠券名称或代码 */
  coupon?: string
}

/** `add_payment_info` 事件参数 */
export type AddPaymentInfoEventParams = ViewItemEventParams & {
  /** 优惠券名称或代码 */
  coupon?: string
  /** 用户选定的付款方式 */
  payment_type?: string
}

/** `add_shipping_info` 事件参数 */
export type AddShippingInfoEventParams = ViewItemEventParams & {
  /** 优惠券名称或代码 */
  coupon?: string
  /** 用户选择的配送级别，如 `Ground`、`Air`、`Next-day` */
  shipping_tier?: string
  /** 用户选定的付款方式 */
  payment_type?: string
}

/** `purchase` 事件参数 */
export type PurchaseEventParams = ViewItemEventParams & {
  /** 交易唯一标识符 */
  transaction_id: string
  /** 优惠券名称或代码 */
  coupon?: string
  /** 运费 */
  shipping?: number
  /** 税费 */
  tax?: number
}

/** `refund` 事件参数 */
export type RefundEventParams = PurchaseEventParams
