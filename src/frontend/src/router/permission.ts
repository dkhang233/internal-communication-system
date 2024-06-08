import router from "@/router"
import { useUserStoreHook } from "@/store/modules/user"
import { usePermissionStoreHook } from "@/store/modules/permission"
import { ElMessage } from "element-plus"
import { setRouteChange } from "@/hooks/useRouteListener"
import { useTitle } from "@/hooks/useTitle"
import { getToken } from "@/utils/cache/cookies"
import routeSettings from "@/config/route"
import isWhiteList from "@/config/white-list"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

const { setTitle } = useTitle()
NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  const userStore = useUserStoreHook()
  const permissionStore = usePermissionStoreHook()
  const token = getToken()

  // If not logged in
  if (!token) {
    // If it is in the login-free whitelist, enter directly
    if (isWhiteList(to)) return next()
    // Other pages without access rights will be redirected to the login page
    return next("/login")
  }

  // If you have logged in and are ready to enter the login page, redirect to the home page
  if (to.path === "/login") {
    return next({ path: "/" })
  }

  // If the user has obtained its permission role
  if (userStore.roles.length !== 0) return next()

  if (_from.path === "/join-meet") return false

  // Otherwise, re-acquire the permission role
  try {
    await userStore.getInfo()
    // Note: role must be an array! For example: ["admin"] or ["developer", "editor"]
    const roles = userStore.roles
    // Generate accessible Routes
    routeSettings.dynamic ? permissionStore.setRoutes(roles) : permissionStore.setAllRoutes()
    // Add "dynamic routing with access permissions" to Router
    permissionStore.addRoutes.forEach((route) => router.addRoute(route))
    // Make sure adding the route is complete
    // Set replace: true, so navigation will not leave a history
    next({ ...to, replace: true })
  } catch (err: any) {
    // If any error occurs during the process, the Token will be reset directly and redirected to the login page.
    userStore.resetToken()
    ElMessage.error(err.message || "An error occurred during the route guard process")
    next("/login")
  }
})

router.afterEach((to) => {
  setRouteChange(to)
  setTitle(to.meta.title)
  NProgress.done()
})
