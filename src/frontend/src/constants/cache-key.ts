const SYSTEM_NAME = "v3-admin-vite"

/** Key used when caching data */
class CacheKey {
  static readonly TOKEN = `${SYSTEM_NAME}-token-key`
  static readonly MEET_TOKEN = `${SYSTEM_NAME}-meet-token-key`
  static readonly CONFIG_LAYOUT = `${SYSTEM_NAME}-config-layout-key`
  static readonly SIDEBAR_STATUS = `${SYSTEM_NAME}-sidebar-status-key`
  static readonly ACTIVE_THEME_NAME = `${SYSTEM_NAME}-active-theme-name-key`
  static readonly VISITED_VIEWS = `${SYSTEM_NAME}-visited-views-key`
  static readonly CACHED_VIEWS = `${SYSTEM_NAME}-cached-views-key`
  static readonly CURRENT_MEET = `${SYSTEM_NAME}-current-meet`
  static readonly EMAIL = `${SYSTEM_NAME}-email`
}

export default CacheKey
