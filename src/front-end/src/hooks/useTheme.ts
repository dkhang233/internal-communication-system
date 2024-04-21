import { ref, watchEffect } from "vue"
import { getActiveThemeName, setActiveThemeName } from "@/utils/cache/local-storage"

const DEFAULT_THEME_NAME = "normal"
type DefaultThemeName = typeof DEFAULT_THEME_NAME

/** Registered theme name, where DefaultThemeName is required */
export type ThemeName = DefaultThemeName | "dark" | "dark-blue"

interface ThemeList {
  title: string
  name: ThemeName
}

/** Topic list */
const themeList: ThemeList[] = [
  {
    title: "Default",
    name: DEFAULT_THEME_NAME
  },
  {
    title: "Dark",
    name: "dark"
  },
  {
    title: "Dark blue",
    name: "dark-blue"
  }
]

/** The name of the theme being applied */
const activeThemeName = ref<ThemeName>(getActiveThemeName() || DEFAULT_THEME_NAME)

/** Set theme */
const setTheme = (value: ThemeName) => {
  activeThemeName.value = value
}

/** Mount the class on the html root element */
const setHtmlRootClassName = (value: ThemeName) => {
  document.documentElement.className = value
}

/** Initialization */
const initTheme = () => {
  // watchEffect to collect side effects
  watchEffect(() => {
    const value = activeThemeName.value
    setHtmlRootClassName(value)
    setActiveThemeName(value)
  })
}

/** Theme hook */
export function useTheme() {
  return { themeList, activeThemeName, initTheme, setTheme }
}
