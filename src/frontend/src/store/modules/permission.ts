import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { type RouteRecordRaw } from "vue-router"
import { constantRoutes, dynamicRoutes } from "@/router"
import { flatMultiLevelRoutes } from "@/router/helper"
import routeSettings from "@/config/route"
import { Role } from "@/api/user/types/user"

const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  const routeRoles = route.meta?.roles
  return routeRoles ? roles.some((role) => routeRoles.includes(role)) : true
}

const filterDynamicRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
  const res: RouteRecordRaw[] = []
  routes.forEach((route) => {
    const tempRoute = { ...route }
    if (hasPermission(roles, tempRoute)) {
      if (tempRoute.children) {
        tempRoute.children = filterDynamicRoutes(tempRoute.children, roles)
      }
      res.push(tempRoute)
    }
  })
  return res
}

export const usePermissionStore = defineStore("permission", () => {
  /** Accessible routes */
  const routes = ref<RouteRecordRaw[]>([])
  /** Dynamic routing with access rights */
  const addRoutes = ref<RouteRecordRaw[]>([])

  /** Generate accessible Routes based on roles (accessible routes = resident routes + dynamic routes with access rights) */
  const setRoutes = (roles: string[]) => {
    const accessedRoutes = filterDynamicRoutes(dynamicRoutes, roles)
    _set(accessedRoutes)
  }

  /** All routes = all resident routes + all dynamic routes */
  const setAllRoutes = () => {
    _set(dynamicRoutes)
  }

  const _set = (accessedRoutes: RouteRecordRaw[]) => {
    routes.value = constantRoutes.concat(accessedRoutes)
    addRoutes.value = routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(accessedRoutes) : accessedRoutes
  }

  return { routes, addRoutes, setRoutes, setAllRoutes }
})

/** Used outside setup */
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
