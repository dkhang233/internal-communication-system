import { type RouteLocationNormalized } from "vue-router"

/** Login-free whitelist (matching routing path) */
const whiteListByPath: string[] = ["/login"]

/** Login-free whitelist (matching route name) */
const whiteListByName: string[] = []

/** Determine whether it is in the whitelist */
const isWhiteList = (to: RouteLocationNormalized) => {
  // Either path or name can match
  return whiteListByPath.indexOf(to.path) !== -1 || whiteListByName.indexOf(to.name as any) !== -1
}

export default isWhiteList
