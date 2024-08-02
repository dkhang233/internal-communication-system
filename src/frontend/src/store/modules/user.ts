import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { useTagsViewStore } from "./tags-view"
import { useSettingsStore } from "./settings"
import { getToken, removeToken, setEmail, setToken } from "@/utils/cache/cookies"
import { resetRouter } from "@/router"
import { loginApi } from "@/api/login"
import { type LoginRequestData } from "@/api/login/types/login"
import { connectWS, disconnectWS } from "@/utils/websocket"
import { UserInfo } from "@/api/user/types/user"
import { getUserInfoApi, searchUserApi } from "@/api/user"

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "")
  const roles = ref<string[]>([])
  const username = ref<string>("")
  const email = ref<string>("")
  const searchUserData = ref<Map<string, UserInfo>>(new Map())

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
    // Verify whether the returned roles is a non-empty array, otherwise insert a default role that has no effect to prevent the routing guard logic from entering an infinite loop.
    switch (data.roles[0]) {
      case "ADMIN":
        roles.value.push("ADMIN")
      case "MANAGER":
        roles.value.push("MANAGER")
      case "EMPLOYEE":
        roles.value.push("EMPLOYEE")
        break
      default:
        break
    }
  }
  /** Simulate character changes */
  const changeRoles = async (role: string) => {
    const newToken = "token-" + role
    token.value = newToken
    setToken(newToken)
    // Refresh the page instead of logging in again
    window.location.reload()
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

  const searchUser = async (keyword: string): Promise<UserInfo[]> => {
    keyword = keyword.trim()
    if (keyword === "") return []

    let reg = new RegExp(keyword)
    let searchUserResult: UserInfo[] = []
    searchUserData.value.forEach((v) => {
      if (reg.test(v.email) || reg.test(v.username)) {
        searchUserResult.push(v)
      }
    })
    if (searchUserResult.length < 6) {
      searchUserResult = []
      const { data } = await searchUserApi(keyword)
      data.forEach((u) => {
        if (!searchUserData.value.has(u.email)) searchUserData.value.set(u.email, u)
        if (reg.test(u.email) || reg.test(u.username)) {
          searchUserResult.push(u)
        }
      })
    }
    return searchUserResult
  }

  return { token, roles, username, email, login, getInfo, changeRoles, logout, resetToken, searchUser }
})

/** Used outside setup */
export function useUserStoreHook() {
  return useUserStore(store)
}
