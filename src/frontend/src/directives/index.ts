import { type App } from "vue"
import { permission } from "./permission"

/** Mount custom instructions */
export function loadDirectives(app: App) {
  app.directive("permission", permission)
}
