import {
  type Router,
  type RouteRecordNormalized,
  type RouteRecordRaw,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from "vue-router"
import { cloneDeep, omit } from "lodash-es"

/** Routing mode */
export const history =
  import.meta.env.VITE_ROUTER_HISTORY === "hash"
    ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
    : createWebHistory(import.meta.env.VITE_PUBLIC_PATH)

/** Route downgrade (convert level three and above routes into level two routes) */
export const flatMultiLevelRoutes = (routes: RouteRecordRaw[]) => {
  const routesMirror = cloneDeep(routes)
  routesMirror.forEach((route) => {
    // If the route is level three or above, downgrade it.
    isMultipleRoute(route) && promoteRouteLevel(route)
  })
  return routesMirror
}

/** Determine whether the routing level is greater than 2 */
const isMultipleRoute = (route: RouteRecordRaw) => {
  const children = route.children
  if (children?.length) {
    // As long as the length of children of a sub-route is greater than 0, it means that it is a third-level and above route.
    return children.some((child) => child.children?.length)
  }
  return false
}

/** Generate secondary route */
const promoteRouteLevel = (route: RouteRecordRaw) => {
  // Create a router instance to obtain all routing information of the currently passed in route
  let router: Router | null = createRouter({
    history,
    routes: [route]
  })
  const routes = router.getRoutes()
  // Use the routing information obtained above in the addToChildren function to update the children of route
  addToChildren(routes, route.children || [], route)
  router = null
  // After converting to secondary routing, remove children from all sub-routes
  route.children = route.children?.map((item) => omit(item, "children") as RouteRecordRaw)
}

/** Add the given sub-route to the specified routing module */
const addToChildren = (routes: RouteRecordNormalized[], children: RouteRecordRaw[], routeModule: RouteRecordRaw) => {
  children.forEach((child) => {
    const route = routes.find((item) => item.name === child.name)
    if (route) {
      //Initialize the children of routeModule
      routeModule.children = routeModule.children || []
      // If the route is not included in the children attribute of routeModule, add it
      if (!routeModule.children.includes(route)) {
        routeModule.children.push(route)
      }
      // If the sub-route has its own sub-route, call this function recursively to add them too.
      if (child.children?.length) {
        addToChildren(routes, child.children, routeModule)
      }
    }
  })
}
