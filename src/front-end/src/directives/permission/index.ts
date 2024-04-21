import { type Directive } from "vue"
import { useUserStoreHook } from "@/store/modules/user"

/** Permission command, similar to the permission judgment function: checkPermission */
export const permission: Directive = {
  mounted(el, binding) {
    const { value: permissionRoles } = binding
    const { roles } = useUserStoreHook()
    if (Array.isArray(permissionRoles) && permissionRoles.length > 0) {
      const hasPermission = roles.some((role) => permissionRoles.includes(role))
      // hasPermission || (el.style.display = "none") // hide
      hasPermission || el.parentNode?.removeChild(el) // destroy
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  }
}
