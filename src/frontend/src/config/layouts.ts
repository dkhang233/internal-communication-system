import { getConfigLayout } from "@/utils/cache/local-storage"
import { LayoutModeEnum } from "@/constants/app-key"

/** Project configuration type */
export interface LayoutSettings {
  /** Whether to display Settings Panel */
  showSettings: boolean
  /** Layout mode */
  layoutMode: LayoutModeEnum
  /** Whether to display the tab bar */
  showTagsView: boolean
  /** Whether to display the Logo */
  showLogo: boolean
  /** Whether to fix the Header */
  fixedHeader: boolean
  /** Whether to display the footer */
  showFooter: boolean
  /** Whether to display message notifications */
  showNotify: boolean
  /** Whether to display the switch theme button */
  showThemeSwitch: boolean
  /** Whether to display the full screen button */
  showScreenfull: boolean
  /** Whether to display the search button */
  showSearchMenu: boolean
  /** Whether to cache the tab bar */
  cacheTagsView: boolean
  /** Enable system watermark */
  showWatermark: boolean
  /** Whether to display gray mode */
  showGreyMode: boolean
  /** Whether to display color weak mode */
  showColorWeakness: boolean
}

/** Default allocation */
const defaultSettings: LayoutSettings = {
  layoutMode: LayoutModeEnum.Left,
  showSettings: false,
  showTagsView: true,
  fixedHeader: true,
  showFooter: false,
  showLogo: true,
  showNotify: true,
  showThemeSwitch: true,
  showScreenfull: true,
  showSearchMenu: true,
  cacheTagsView: false,
  showWatermark: false,
  showGreyMode: false,
  showColorWeakness: false
}

/** Project configuration */
export const layoutSettings: LayoutSettings = { ...defaultSettings, ...getConfigLayout() }
