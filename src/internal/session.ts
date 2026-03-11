import type { MiniprogramAPI } from '@/core/types'
import { getSessionId } from '@/internal/utils'

export interface SessionManager {
  currentSessionId: () => string
}

export function createSessionManager(api: MiniprogramAPI): SessionManager {
  // 会话 ID
  let sessionId = ''
  // 时间戳，用于判断会话是否结束
  let timestamp = Math.floor(Date.now() / 1000)

  const refreshSession = (): void => {
    const [newSessionId, newTimestamp] = getSessionId(sessionId, timestamp)
    sessionId = newSessionId
    timestamp = newTimestamp
  }

  refreshSession()
  // 小程序切前台时刷新会话，尽量贴近 GA 会话生命周期。
  api.onAppShow(refreshSession)

  return {
    currentSessionId: () => {
      refreshSession()
      return sessionId
    },
  }
}
