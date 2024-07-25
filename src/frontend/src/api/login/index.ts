import { request } from "@/utils/service"
import type * as Login from "./types/login"

/** Get login verification code */
export function getLoginCodeApi() {
  return request<Login.LoginCodeResponseData>({
    url: "auth/code",
    method: "get"
  })
}

/** Log in and return Token */
export function loginApi(data: Login.LoginRequestData) {
  return request<Login.LoginResponseData>({
    url: "auth/login",
    method: "post",
    data
  })
}
