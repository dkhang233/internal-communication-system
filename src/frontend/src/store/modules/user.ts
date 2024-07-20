import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { useTagsViewStore } from "./tags-view"
import { useSettingsStore } from "./settings"
import { getToken, removeToken, setEmail, setToken } from "@/utils/cache/cookies"
import { resetRouter } from "@/router"
import { loginApi, getUserInfoApi } from "@/api/login"
import { type LoginRequestData } from "@/api/login/types/login"
import routeSettings from "@/config/route"
import Roles from "@/constants/roles"
import { connectWS, disconnectWS } from "@/utils/websocket"

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "")
  const roles = ref<string[]>([])
  const username = ref<string>("")
  const email = ref<string>("")

  const tagsViewStore = useTagsViewStore()
  const settingsStore = useSettingsStore()

  /** Log in */
  const login = async ({ email, password, code }: LoginRequestData) => {
    const { data } = await loginApi({ email, password, code })
    setToken(data.token)
    token.value = data.token

    // Init websocket connection
    connectWS()
  }
  /** Get user details */
  const getInfo = async () => {
    const { data } = await getUserInfoApi()
    email.value = data.email
    setEmail(email.value)
    username.value = data.username
    console.log(username.value)
    // Verify whether the returned roles is a non-empty array, otherwise insert a default role that has no effect to prevent the routing guard logic from entering an infinite loop.
    roles.value = data.roles?.length > 0 ? convertRoles(data.roles) : routeSettings.defaultRoles
  }
  /** Simulate character changes */
  const changeRoles = async (role: string) => {
    const newToken = "token-" + role
    token.value = newToken
    setToken(newToken)
    // Refresh the page instead of logging in again
    window.location.reload()
  }

  /** Convert roles */
  const convertRoles = (input: number[]): string[] => {
    let roles = []
    for (let i = 0; i < input.length; i++) {
      if (input[i] === 1) {
        roles.push(Roles.ADMIN)
      } else if (input[i] === 2) {
        roles.push(Roles.MANAGER)
      } else if (input[i] === 2) {
        roles.push(Roles.EMPLOYEE)
      }
    }
    return roles
  }

  /** Log out */
  const logout = () => {
    removeToken()
    token.value = ""
    roles.value = []
    resetRouter()
    _resetTagsView()
    disconnectWS()
  }
  /** Reset Token */
  const resetToken = () => {
    removeToken()
    token.value = ""
    roles.value = []
  }
  /** Reset Visited Views and Cached Views */
  const _resetTagsView = () => {
    if (!settingsStore.cacheTagsView) {
      tagsViewStore.delAllVisitedViews()
      tagsViewStore.delAllCachedViews()
    }
  }

  return { token, roles, username, email, login, getInfo, changeRoles, logout, resetToken }
})

/** Used outside setup */
export function useUserStoreHook() {
  return useUserStore(store)
}
