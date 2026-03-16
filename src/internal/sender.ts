import type { MiniprogramAPI } from '@/core/types'
import type { DeviceInfo } from '@/internal/device'
import { throttle } from '@/internal/utils'

type QueuedEvent = [eventName: string, eventParams: Record<string, unknown>]

interface CreateSenderOptions {
  api: MiniprogramAPI
  measurementId: string
  apiSecret: string
  transportUrl: string
  getClientId: () => string
  deviceInfo?: DeviceInfo
  log: (message: string, force?: boolean) => void
}

export interface EventSender {
  enqueue: (eventName: string, eventParams: Record<string, unknown>) => void
}

export interface EventPayload {
  client_id: string
  device?: DeviceInfo
  events: Array<{ name: string; params: Record<string, unknown> }>
}

// 事件上报频率
const EVENT_REPORT_FREQUENCY = 500 // 0.5s

export function createSender(options: CreateSenderOptions): EventSender {
  const eventQueue: QueuedEvent[] = []
  let sending = false

  const flush = throttle(() => {
    if (sending) return

    if (!eventQueue.length) {
      sending = false
      return
    }

    const payload: EventPayload = {
      client_id: options.getClientId(),
      device: options.deviceInfo,
      events: [],
    }

    while (eventQueue.length > 0) {
      // 每次不能超过 25 个事件
      if (payload.events.length >= 25) break
      const current = eventQueue[0]
      if (!current) break
      const [eventName, eventParams] = current
      payload.events.push({ name: eventName, params: eventParams })
      eventQueue.shift()
    }

    options.log(`即将发送的事件列表：\n${JSON.stringify(payload.events, null, 2)}`)

    sending = true
    options.api.request({
      // 事件验证：https://developers.google.com/analytics/devguides/collection/protocol/ga4/validating-events?hl=zh-cn&client_type=gtag#send_events_for_validation
      // url: `${options.transportUrl}/debug/mp/collect?measurement_id=${options.measurementId}&api_secret=${options.apiSecret}`
      url: `${options.transportUrl}/mp/collect?measurement_id=${options.measurementId}&api_secret=${options.apiSecret}`,
      header: { 'content-type': 'application/json' },
      method: 'POST',
      data: JSON.stringify(payload),
      success: () => {
        options.log(`事件上报成功（共 ${payload.events.length} 个）`)
      },
      fail: err => {
        options.log(`事件上报失败：\n${JSON.stringify(err, null, 2)}`)
      },
      complete: () => {
        sending = false
        setTimeout(() => {
          flush()
        }, 0)
      },
    })
  }, EVENT_REPORT_FREQUENCY)

  return {
    enqueue: (eventName: string, eventParams: Record<string, unknown>) => {
      eventQueue.push([eventName, eventParams])
      flush()
    },
  }
}
