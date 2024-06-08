import { type Ref, ref, watch } from "vue"
import { defineStore } from "pinia"
import { type LayoutSettings, layoutSettings } from "@/config/layouts"
import { setConfigLayout } from "@/utils/cache/local-storage"

type SettingsStore = {
  // Use the mapping type to iterate over the keys of the layoutSettings object
  [Key in keyof LayoutSettings]: Ref<LayoutSettings[Key]>
}

type SettingsStoreKey = keyof SettingsStore

export const useSettingsStore = defineStore("settings", () => {
  /** Status object */
  const state = {} as SettingsStore
  // Traverse the key-value pairs of the layoutSettings object
  for (const [key, value] of Object.entries(layoutSettings)) {
    // Use type assertions to specify the type of key, wrap the value in the ref function, and create a reactive variable
    const refValue = ref(value)
    // @ts-ignore
    state[key as SettingsStoreKey] = refValue
    //Listen to each reactive variable
    watch(refValue, () => {
      // cache
      const settings = _getCacheData()
      setConfigLayout(settings)
    })
  }
  /** Get the data to be cached: convert the state object into a settings object */
  const _getCacheData = () => {
    const settings = {} as LayoutSettings
    for (const [key, value] of Object.entries(state)) {
      // @ts-ignore
      settings[key as SettingsStoreKey] = value.value
    }
    return settings
  }

  return state
})
