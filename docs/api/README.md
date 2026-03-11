**@tofrankie/miniprogram-ga4**

***

# @tofrankie/miniprogram-ga4

适用于微信小程序的 Google Analytics 4。

> 理论上支持其他小程序平台，但未经测试验证。

## 快速开始

### 引入

使用 npm 构建

```bash
$ pnpm add @tofrankie/miniprogram-ga4
```

使用文件版

1. 克隆仓库：`git clone https://github.com/tofrankie/miniprogram-ga4.git`
2. 安装依赖：`pnpm install`
3. 构建产物：`pnpm build`
4. 从 `dist` 目录下获取对应产物文件
5. 将产物文件添加至项目中

### 使用

前往 Google Analytics 后台[创建媒体资源](https://support.google.com/analytics/answer/9304153#property)，接着拿到 [Measurement ID](https://support.google.com/analytics/answer/12270356) 和 [Sceret](https://support.google.com/analytics/answer/9814495)。

```js
const ga = require('@tofrankie/miniprogram-ga4')
// const ga = require('path/to/your-ga-sdk.js') // 文件版

// 在 app.js 初始化
ga.config('your_measurement_id', 'your_api_sceret', {
  // 用于数据转发，转发至 `https://www.google-analytics.com` 域名
  // 参考：https://github.com/rchunping/wxapp-google-analytics/issues/4
  transportUrl: 'https://analytics.example.com',

  // 开启调试日志
  debug: true,

  // 默认支持微信小程序，通过此选项支持更多小程序（如支付宝、抖音等，但未经测试）
  // api: my,
})

// 上报页面浏览事件（体现在 GA 后台的网页和屏幕）
ga.pageView('首页', 'pages/index/index')

// 上报通用的 event 事件
ga.event('your_category', 'your_action', 'your_label', 'your_value')

// 上报任意事件
ga.event('your_event_name', {
  your_event_param1: 'xxx',
  your_event_param2: 'xxx',
  // ...
})
```

## 关于事件

### 简介

用户与网站产生的每一个交互，都可以成为事件，它由事件名称、事件参数组成。在 GA4 中[事件类型](https://support.google.com/analytics/answer/9322688?hl=zh-Hans&ref_topic=13367566)有：自动收集的事件、增强型衡量事件、推荐事件、自定义事件，其中前两者接入 [gtag.js](https://support.google.com/analytics/answer/9304153#add-tag) 后自动收集，后两者需要手动上报。

鉴于小程序特殊性，需要基于 Measurement Protocol 借助网络请求进行数据上报，**本 SDK 仅实现了部分事件**。

### 固执己见的 event 事件

出于实际情况考虑，事件埋点通常是随着业务变化而变化的。多数小程序迭代频率非常高，非常容易产生“过时/废弃”的事件，**因此本 SDK 主张将绝大部分事件归入名为 `event` 的通用事件**。它是一个 opinionated 的事件设计，如果它不满足你的需求，仍然可以通过不同参数形式上报任意事件名称的事件。

```js
// 形式（事件名称为 `event`）
ga.event('category', 'action', 'label', 'value')

// 示例
ga.event('首页', '点击-个人中心')
ga.event('设置页', '点击-切换开关', '开/关')
ga.event('设备列表页', '点击-设备详情', '设备名称')
```

- `category`: 事件的类型，常以页面为单位
- `action`: 事件的操作，常以事件目标+操作组成
- `label`: 事件的标签，通常是事件目标更具体的描述
- `value`: 事件的值，不作限制，可以是时间、数量等

你仍然可以通过 `ga.event()` 上报任意事件名称的事件。

```js
ga.event('any_event_name', {
  event_param_1: 'param_value_1',
  event_param_2: 'param_value_2',
  event_param_3: 'param_value_3',
  // ...
})

// 上述通用的 event 事件相当于：
// ga.event('event', { category, action, label, value })
```

## 页面浏览事件 page_view

由于小程序路径不同于标准的 Web 页面，为了让 GA 后台可以正确识别，SDK 内部会将小程序路径 `pages/index/index` 转换为标准的 URL 形式：`https://miniprogram.com/pages/index/index` 的形式。

这样做的目的是让 GA 统计数据时可以正确识别我们的小程序路径（体现在 GA 后台的网页和屏幕），仅此而已。其中 `https://miniprogram.com/` 只是 SDK 内部固定前缀，理论上任意域名均可。

```js
// 形式
ga.pageView('page title', 'to', 'from')

// 示例
ga.pageView('首页', 'pages/index/index')
ga.pageView('设置页', 'pages/setting/setting', 'pages/mine/mine')
```

### 异常事件

```js
// 形式
ga.exception('描述', 'true/false')

// 示例
ga.exception('这是一个普通错误')
ga.exception('这是一个严重错误', true)
```

### 其他事件

基于 GA [推荐事件](https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag)的电子商务类事件进行梳理，具体看下文 APIs。

![](_media/ecommerce-events.svg)

## APIs

目前 SDK 提供了以下方法，可覆盖常用场景，并提供良好的代码提示以方便使用。

初始化：

- `ga.config()`

常规事件：

- `ga.event()`
- `ga.pageView()`
- `ga.exception()`

电子商务事件：

- `ga.search()`
- `ga.viewItemList()`
- `ga.viewCart()`
- `ga.viewPromotion()`
- `ga.selectPromotion()`
- `ga.selectItem()`
- `ga.viewItem()`
- `ga.share()`
- `ga.addToWishlist()`
- `ga.addToCart()`
- `ga.removeFromCart()`
- `ga.beginCheckout()`
- `ga.addPaymentInfo()`
- `ga.addShippingInfo()`
- `ga.purchase()`
- `ga.refund()`

### ga.config()

初始化配置。通常在小程序入口进行配置。

```js
ga.config(measurementId, apiSecret, options)
```

| 参数                 | 类型    | 必填 | 默认值                             | 描述                                                                                         |
| :------------------- | :------ | :--- | :--------------------------------- | :------------------------------------------------------------------------------------------- |
| measurementId        | string  | 是   | 无                                 | Measurement ID（[更多](https://support.google.com/analytics/answer/12270356)）               |
| apiSecret            | string  | 是   | 无                                 | Measurement Protocol API 密钥（[更多](https://support.google.com/analytics/answer/9814495)） |
| options.transportUrl | string  | 否   | `https://www.google-analytics.com` | 数据转发服务器 URL                                                                           |
| options.debug        | boolean | 否   | `false`                            | 开启调试日志                                                                                 |
| options.api          | object  | 否   | `wx`                               | 小程序 API 命名空间对象；理论上支持 `my`（支付宝小程序）、`tt`（抖音小程序）等               |

说明：

1. `measurementId` 使用的是 GA4 的 Measurement ID（`G-` 开头），不是 UA 的 Tracking ID（`UA-` 开头）。
2. 由于 `https://www.google-analytics.com` 域名未备案，因此无法添加到小程序的 request 合法域名中，加上用户可能无法访问此域名，因此需要你准备一个已备案的域名做数据转发。参考 [rchunping/wxapp-google-analytics#4](https://github.com/rchunping/wxapp-google-analytics/issues/4)
3. 理论上 SDK 支持各平台小程序（内部使用到的 API 是通用的），可以在 `options.api` 传入如 `my`（支付宝小程序）、`tt`（抖音小程序）等，**但未经测试验证**。

### ga.pageView()

发送 `page_view` 事件。

```js
ga.pageView(pageTitle, pageLocation, pageReferrer)
```

| 参数         | 类型   | 必填 | 默认值 | 描述                        |
| :----------- | :----- | :--- | :----- | :-------------------------- |
| pageTitle    | string | 是   | 无     | 网页标题，不超过 100 个字符 |
| pageLocation | string | 否   | 无     | 网页网址，不超过 420 个字符 |
| pageReferrer | string | 否   | 无     | 网页来源，不超过 420 个字符 |

说明：

- 当 `pageLocation` 不传参时，将通过 `getCurrentPages()` 获取当前页面路径进行填充。
- 为了使得网页位置、网页路径维度自动填充，本 SDK 在上报该事件之前，会将 `pageLocation`、`pageReferrer` 的小程序路径前添加上 `https://miniprogram.com/`（取包名组合而来，不存在的域名），使其成为一个格式正确的网站 URL，让系统自动划分并填充网页位置、网页路径。 即 `pages/index/index` → `https://miniprogram.com/pages/index/index`

### ga.event()

该方法有两种用法：一是发送 `event` 事件；二是发送任意事件。

```js
ga.event(categoryOrEventName, actionOrEventParams, label, value)
```

| 参数                | 类型          | 必填 | 默认值 | 描述                                                  |
| :------------------ | :------------ | :--- | :----- | :---------------------------------------------------- |
| categoryOrEventName | string        | 是   | 无     | event 事件的类型，常以页面为单位（或事件名称）        |
| actionOrEventParams | string/object | 是   | 无     | event 事件的操作，常以事件目标+操作组成（或事件参数） |
| label               | string        | 否   | 无     | event 事件的标签，通常是事件目标更具体的描述          |
| value               | number        | 否   | 无     | event 事件的值，不作限制，可以是时间、数量等          |

简单示例：

```js
// 1️⃣ 发送 event 事件
event('category', 'action', 'label', 'value')

// 2️⃣ 发送任意事件
event('any_event_name', {
  event_param_1: 'param_value_1',
  event_param_2: 'param_value_2',
  event_param_3: 'param_value_3',
})
```

两者传参类型稍有不同，你可以认为 1️⃣ 就是 2️⃣ 的简单封装而已，可兼容原有 UA 的写法。

其中 `event` 事件参数如下：

| 事件参数名称 | 类型   | 必填 | 默认值 | 描述                             | 示例             |
| :----------- | :----- | :--- | :----- | :------------------------------- | :--------------- |
| category     | string | 是   | 无     | 类型，常以页面为单位             | 首页、个人中心页 |
| action       | string | 是   | 无     | 操作，常以事件目标+操作组成      | 参与活动-点击    |
| label        | string | 否   | 无     | 标签，事件目标更具体的描述       | 按钮文案等       |
| value        | number | 否   | 无     | 值，不作限制，可以是时长、数量等 | 1                |

### ga.exception()

发送 `exception` 事件。当网页发生了崩溃、错误等，我们就可以上报此事件。

```js
ga.exception(description, fatal)
```

| 参数        | 类型    | 必填 | 默认值  | 描述                            |
| :---------- | :------ | :--- | :------ | :------------------------------ |
| description | string  | 是   | 无      | 异常描述                        |
| fatal       | boolean | 否   | `false` | 如果异常很严重，则设为 `true`。 |

### ga.search()

发送 `search` 事件。

```js
ga.search(eventParams)
```

| 参数                    | 类型   | 必填 | 默认值 | 描述       |
| :---------------------- | :----- | :--- | :----- | :--------- |
| eventParams.search_term | string | 是   | 无     | 搜索的字词 |

### ga.viewItemList()

发送 `view_item_list` 事件。当用户查看了商品列表，可上报此事件。

```js
ga.viewItemList(eventParams)
```

| 参数                       | 类型   | 必填 | 默认值 | 描述             |
| :------------------------- | :----- | :--- | :----- | :--------------- |
| eventParams.items          | Item[] | 是   | 无     | 与事件相关的商品 |
| eventParams.item_list_id   | string | 否   | 无     | 所在商品列表 ID  |
| eventParams.item_list_name | string | 否   | 无     | 所在商品列表名称 |

Item 参数（商品属性，下同）：

| 参数                | 类型   | 必填 | 默认值 | 描述                                                             |
| :------------------ | :----- | :--- | :----- | :--------------------------------------------------------------- |
| Item.item_id        | string | 是   | 无     | 商品 ID                                                          |
| Item.item_name      | string | 是   | 无     | 商品名称                                                         |
| Item.affiliation    | string | 否   | 无     | 用于指定供应公司或实体店面的商品关联商户                         |
| Item.coupon         | string | 否   | 无     | 与商品相关的优惠券名称/代码                                      |
| Item.creative_name  | string | 否   | 无     | 促销广告素材的名称                                               |
| Item.creative_slot  | string | 否   | 无     | 与商品相关的促销广告素材投放到的广告位的名称                     |
| Item.discount       | number | 否   | 无     | 与商品相关的折扣货币价值                                         |
| Item.index          | number | 否   | 无     | 列表中商品的索引/商品在列表中的位置                              |
| Item.item_brand     | string | 否   | 无     | 商品所属品牌                                                     |
| Item.item_category  | string | 否   | 无     | 商品所属类别。如果将其用作类别层级或类目的一部分，则为第一个类别 |
| Item.item_category2 | string | 否   | 无     | 商品的第二个类别层级或其他类目                                   |
| Item.item_category3 | string | 否   | 无     | 商品的第三个类别层级或其他类目                                   |
| Item.item_category4 | string | 否   | 无     | 商品的第四个类别层级或其他类目                                   |
| Item.item_category5 | string | 否   | 无     | 商品的第五个类别层级或其他类目                                   |
| Item.item_list_id   | string | 否   | 无     | 商品向用户展示时所在列表的 ID                                    |
| Item.item_list_name | string | 否   | 无     | 商品向用户展示时所在列表的名称                                   |
| Item.item_variant   | string | 否   | 无     | 用于提供其他商品详情/选项的商品款式/规格、唯一代码或说明         |
| Item.location_id    | string | 否   | 无     | 与商品关联的实际位置（例如实体店）                               |
| Item.price          | number | 否   | 无     | 商品的货币价格（以指定的 currency 参数为单位）                   |
| Item.promotion_id   | string | 否   | 无     | 与商品相关的促销活动的 ID                                        |
| Item.promotion_name | string | 否   | 无     | 与商品相关的促销活动的名称                                       |
| Item.quantity       | number | 否   | 无     | 商品数量                                                         |

### ga.viewCart()

发送 `view_cart` 事件。当用户查看了购物车，可上报此事件。

```js
ga.viewCart(eventParams)
```

| 参数                       | 类型   | 必填 | 默认值 | 描述             |
| :------------------------- | :----- | :--- | :----- | :--------------- |
| eventParams.items          | Item[] | 是   | 无     | 与事件相关的商品 |
| eventParams.item_list_id   | string | 否   | 无     | 所在商品列表 ID  |
| eventParams.item_list_name | string | 否   | 无     | 所在商品列表名称 |

### ga.viewPromotion()

发送 `view_promotion` 事件。当用户查看了推广活动，可上报此事件。

```js
ga.viewPromotion(eventParams)
```

| 参数                       | 类型   | 必填 | 默认值 | 描述                                         |
| :------------------------- | :----- | :--- | :----- | :------------------------------------------- |
| eventParams.items          | Item[] | 是   | 无     | 与事件相关的商品                             |
| eventParams.creative_name  | string | 否   | 无     | 促销广告素材的名称                           |
| eventParams.creative_slot  | string | 否   | 无     | 与事件相关的促销广告素材投放到的广告位的名称 |
| eventParams.promotion_id   | string | 否   | 无     | 与事件相关的促销活动的 ID                    |
| eventParams.promotion_name | string | 否   | 无     | 与事件相关的促销活动的名称                   |

### ga.selectPromotion()

发送 `select_promotion` 事件。当用户从列表中选择了推广活动，可上报此事件。

```js
ga.selectPromotion(eventParams)
```

| 参数                       | 类型   | 必填 | 默认值 | 描述                                         |
| :------------------------- | :----- | :--- | :----- | :------------------------------------------- |
| eventParams.items          | Item[] | 是   | 无     | 与事件相关的商品                             |
| eventParams.creative_name  | string | 否   | 无     | 促销广告素材的名称                           |
| eventParams.creative_slot  | string | 否   | 无     | 与事件相关的促销广告素材投放到的广告位的名称 |
| eventParams.promotion_id   | string | 否   | 无     | 与事件相关的促销活动的 ID                    |
| eventParams.promotion_name | string | 否   | 无     | 与事件相关的促销活动的名称                   |

### ga.selectItem()

发送 `select_item` 事件。当用户从列表中选择了商品，可上报此事件。

```js
ga.selectItem(eventParams)
```

| 参数                       | 类型   | 必填 | 默认值 | 描述             |
| :------------------------- | :----- | :--- | :----- | :--------------- |
| eventParams.items          | Item[] | 是   | 无     | 与事件相关的商品 |
| eventParams.item_list_id   | string | 否   | 无     | 所在商品列表 ID  |
| eventParams.item_list_name | string | 否   | 无     | 所在商品列表名称 |

### ga.viewItem()

发送 `view_item` 事件。当用户查看了某些商品，可上报此事件。

```js
ga.viewItem(eventParams)
```

| 参数                 | 类型   | 必填  | 默认值 | 描述                                                                                                                                                                                                          |
| :------------------- | :----- | :---- | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| eventParams.items    | Item[] | 是    | 无     | 与事件相关的商品                                                                                                                                                                                              |
| eventParams.currency | string | 否 \* | 无     | 与事件相关的商品所用的币种（使用 [ISO 4217](https://www.wikiwand.com/en/ISO_4217#List_of_ISO_4217_currency_codes) 格式，比如人民币为 `CNY`）。如果设置 value，则必须提供 currency，这样才能准确计算收入指标。 |
| eventParams.value    | number | 否 \* | 无     | 与事件相关的货币价值。如果设置 value，则必须提供 currency。如果设置 value，则必须提供 currency。                                                                                                              |

### ga.share()

发送 `share` 事件。当用户分享了商品，可上报此事件。

```js
ga.share(eventParams)
```

| 参数                     | 类型   | 必填 | 默认值 | 描述                         |
| :----------------------- | :----- | :--- | :----- | :--------------------------- |
| eventParams.method       | string | 是   | 无     | 共享内容的方法，比如 Twitter |
| eventParams.content_type | string | 否   | 无     | 共享内容的类型               |
| eventParams.item_id      | string | 否   | 无     | 共享内容的 ID                |

### ga.addToWishlist()

发送 `add_to_wishlist` 事件。当用户查看了某些商品，可上报此事件。

```js
ga.addToWishlist(eventParams)
```

| 参数                 | 类型   | 必填  | 默认值 | 描述                                                                                                                                                                                                          |
| :------------------- | :----- | :---- | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| eventParams.items    | Item[] | 是    | 无     | 与事件相关的商品                                                                                                                                                                                              |
| eventParams.currency | string | 否 \* | 无     | 与事件相关的商品所用的币种（使用 [ISO 4217](https://www.wikiwand.com/en/ISO_4217#List_of_ISO_4217_currency_codes) 格式，比如人民币为 `CNY`）。如果设置 value，则必须提供 currency，这样才能准确计算收入指标。 |
| eventParams.value    | number | 否 \* | 无     | 与事件相关的货币价值。如果设置 value，则必须提供 currency。如果设置 value，则必须提供 currency。                                                                                                              |

### ga.addToCart()

发送 `add_to_cart` 事件。当用户将商品添加到购物车，可上报此事件。

```js
ga.addToCart(eventParams)
```

| 参数                 | 类型   | 必填  | 默认值 | 描述                                                                                                                                                                                                          |
| :------------------- | :----- | :---- | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| eventParams.items    | Item[] | 是    | 无     | 与事件相关的商品                                                                                                                                                                                              |
| eventParams.currency | string | 否 \* | 无     | 与事件相关的商品所用的币种（使用 [ISO 4217](https://www.wikiwand.com/en/ISO_4217#List_of_ISO_4217_currency_codes) 格式，比如人民币为 `CNY`）。如果设置 value，则必须提供 currency，这样才能准确计算收入指标。 |
| eventParams.value    | number | 否 \* | 无     | 与事件相关的货币价值。如果设置 value，则必须提供 currency。如果设置 value，则必须提供 currency。                                                                                                              |

### ga.removeFromCart()

发送 `remove_from_cart` 事件。当用户将商品从购物车中移除，可上报此事件。

```js
ga.removeFromCart(eventParams)
```

| 参数                 | 类型   | 必填  | 默认值 | 描述                                                                                                                                                                                                          |
| :------------------- | :----- | :---- | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| eventParams.items    | Item[] | 是    | 无     | 与事件相关的商品                                                                                                                                                                                              |
| eventParams.currency | string | 否 \* | 无     | 与事件相关的商品所用的币种（使用 [ISO 4217](https://www.wikiwand.com/en/ISO_4217#List_of_ISO_4217_currency_codes) 格式，比如人民币为 `CNY`）。如果设置 value，则必须提供 currency，这样才能准确计算收入指标。 |
| eventParams.value    | number | 否 \* | 无     | 与事件相关的货币价值。如果设置 value，则必须提供 currency。如果设置 value，则必须提供 currency。                                                                                                              |

### ga.beginCheckout()

发送 `begin_checkout` 事件。当用户已开始结账流程，可上报此事件。

```js
ga.beginCheckout(eventParams)
```

| 参数                 | 类型   | 必填  | 默认值 | 描述                                                                                                                                                                                                          |
| :------------------- | :----- | :---- | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| eventParams.items    | Item[] | 是    | 无     | 与事件相关的商品                                                                                                                                                                                              |
| eventParams.currency | string | 否 \* | 无     | 与事件相关的商品所用的币种（使用 [ISO 4217](https://www.wikiwand.com/en/ISO_4217#List_of_ISO_4217_currency_codes) 格式，比如人民币为 `CNY`）。如果设置 value，则必须提供 currency，这样才能准确计算收入指标。 |
| eventParams.value    | number | 否 \* | 无     | 与事件相关的货币价值。如果设置 value，则必须提供 currency。如果设置 value，则必须提供 currency。                                                                                                              |
| eventParams.coupon   | string | 否    | 无     | 与事件相关的优惠券名称/代码                                                                                                                                                                                   |

### ga.addPaymentInfo()

发送 `add_payment_info` 事件。当用户已提交其付款信息，可上报此事件。

```js
ga.addPaymentInfo(eventParams)
```

| 参数                     | 类型   | 必填  | 默认值 | 描述                                                                                                                                                                                                          |
| :----------------------- | :----- | :---- | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| eventParams.items        | Item[] | 是    | 无     | 与事件相关的商品                                                                                                                                                                                              |
| eventParams.currency     | string | 否 \* | 无     | 与事件相关的商品所用的币种（使用 [ISO 4217](https://www.wikiwand.com/en/ISO_4217#List_of_ISO_4217_currency_codes) 格式，比如人民币为 `CNY`）。如果设置 value，则必须提供 currency，这样才能准确计算收入指标。 |
| eventParams.value        | number | 否 \* | 无     | 与事件相关的货币价值。如果设置 value，则必须提供 currency。如果设置 value，则必须提供 currency。                                                                                                              |
| eventParams.coupon       | string | 否    | 无     | 与事件相关的优惠券名称/代码                                                                                                                                                                                   |
| eventParams.payment_type | string | 否    | 无     | 选定的付款方式                                                                                                                                                                                                |

### ga.addShipping()

发送 `add_shipping_info` 事件。当用户已提交其配送信息，可上报此事件。

```js
ga.addShipping(eventParams)
```

| 参数                      | 类型   | 必填  | 默认值 | 描述                                                                                                                                                                                                          |
| :------------------------ | :----- | :---- | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| eventParams.items         | Item[] | 是    | 无     | 与事件相关的商品                                                                                                                                                                                              |
| eventParams.currency      | string | 否 \* | 无     | 与事件相关的商品所用的币种（使用 [ISO 4217](https://www.wikiwand.com/en/ISO_4217#List_of_ISO_4217_currency_codes) 格式，比如人民币为 `CNY`）。如果设置 value，则必须提供 currency，这样才能准确计算收入指标。 |
| eventParams.value         | number | 否 \* | 无     | 与事件相关的货币价值。如果设置 value，则必须提供 currency。如果设置 value，则必须提供 currency。                                                                                                              |
| eventParams.coupon        | string | 否    | 无     | 与事件相关的优惠券名称/代码                                                                                                                                                                                   |
| eventParams.shipping_tier | string | 否    | 无     | 用户为所购商品选择的配送级别（例如 Ground、Air 和 Next-day）                                                                                                                                                  |
| eventParams.payment_type  | string | 否    | 无     | 选定的付款方式                                                                                                                                                                                                |

### ga.purchase()

发送 `purchase` 事件。当用户已购买一件或多件商品，可上报此事件。

```js
ga.purchase(eventParams)
```

| 参数                       | 类型   | 必填  | 默认值 | 描述                                                                                                                                                                                                          |
| :------------------------- | :----- | :---- | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| eventParams.items          | Item[] | 是    | 无     | 与事件相关的商品                                                                                                                                                                                              |
| eventParams.transaction_id | string | 是    | 无     | 交易的唯一标识符                                                                                                                                                                                              |
| eventParams.currency       | string | 否 \* | 无     | 与事件相关的商品所用的币种（使用 [ISO 4217](https://www.wikiwand.com/en/ISO_4217#List_of_ISO_4217_currency_codes) 格式，比如人民币为 `CNY`）。如果设置 value，则必须提供 currency，这样才能准确计算收入指标。 |
| eventParams.value          | number | 否 \* | 无     | 与事件相关的货币价值。如果设置 value，则必须提供 currency。如果设置 value，则必须提供 currency。                                                                                                              |
| eventParams.coupon         | string | 否    | 无     | 与事件相关的优惠券名称/代码                                                                                                                                                                                   |
| eventParams.shipping       | number | 否    | 无     | 与交易相关的运费                                                                                                                                                                                              |
| eventParams.tax            | number | 否    | 无     | 与交易相关的税费                                                                                                                                                                                              |

### ga.refund()

发送 `refund` 事件。当用户退回一件或多件商品，可上报此事件。

```js
ga.refund(eventParams)
```

| 参数                       | 类型   | 必填  | 默认值 | 描述                                                                                                                                                                                                          |
| :------------------------- | :----- | :---- | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| eventParams.items          | Item[] | 是    | 无     | 与事件相关的商品                                                                                                                                                                                              |
| eventParams.transaction_id | string | 是    | 无     | 交易的唯一标识符                                                                                                                                                                                              |
| eventParams.currency       | string | 否 \* | 无     | 与事件相关的商品所用的币种（使用 [ISO 4217](https://www.wikiwand.com/en/ISO_4217#List_of_ISO_4217_currency_codes) 格式，比如人民币为 `CNY`）。如果设置 value，则必须提供 currency，这样才能准确计算收入指标。 |
| eventParams.value          | number | 否 \* | 无     | 与事件相关的货币价值。如果设置 value，则必须提供 currency。如果设置 value，则必须提供 currency。                                                                                                              |
| eventParams.coupon         | string | 否    | 无     | 与事件相关的优惠券名称/代码                                                                                                                                                                                   |
| eventParams.shipping       | number | 否    | 无     | 与交易相关的运费                                                                                                                                                                                              |
| eventParams.tax            | number | 否    | 无     | 与交易相关的税费                                                                                                                                                                                              |
