import dayjs from "dayjs"
import { removeConfigLayout } from "@/utils/cache/local-storage"

/** Format time */
export const formatDateTime = (time: string | number | Date) => {
  return time ? dayjs(new Date(time)).format("YYYY-MM-DD HH:mm:ss") : "N/A"
}

/** Use JS to get global css variables */
export const getCssVariableValue = (cssVariableName: string) => {
  let cssVariableValue = ""
  try {
    // When no value is obtained, an empty string will be returned
    cssVariableValue = getComputedStyle(document.documentElement).getPropertyValue(cssVariableName)
  } catch (error) {
    console.error(error)
  }
  return cssVariableValue
}

/** Set global CSS variables using JS */
export const setCssVariableValue = (cssVariableName: string, cssVariableValue: string) => {
  try {
    document.documentElement.style.setProperty(cssVariableName, cssVariableValue)
  } catch (error) {
    console.error(error)
  }
}

/** Reset project configuration */
export const resetConfigLayout = () => {
  removeConfigLayout()
  location.reload()
}
