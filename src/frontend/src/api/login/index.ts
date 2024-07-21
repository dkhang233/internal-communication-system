import { request } from "@/utils/service"
import type * as Login from "./types/login"
import { SearchUserResponseData } from "./types/login"

/** Get login verification code */
export function getLoginCodeApi() {
  return request<Login.LoginCodeResponseData>({
    url: "users/code",
    method: "get"
  })
}

/** Log in and return Token */
export function loginApi(data: Login.LoginRequestData) {
  return request<Login.LoginResponseData>({
    url: "users/login",
    method: "post",
    data
  })
}

/** Get user details */
export function getUserInfoApi() {
  return request<Login.UserInfoResponseData>({
    url: "users/info",
    method: "get"
  })
}

/** Get all user's contacts */
export function getAllContactData() {
  return request<Login.ContactResponseData>({
    url: "users/contacts",
    method: "get"
  })
}

// export function addContactData(contact: ContactRequestData) {
//   return request<Login.ContactResponseData>({
//     url: "users/contacts",
//     method: "post",
//     data: contact
//   })
// }

/** Get specific user's contact */
export function getContactData(contactId: string) {
  return request<Login.ContactResponseData>({
    url: "users/contacts",
    method: "get",
    params: { contactId }
  })
}

/** Search user */
export function searchUserApi(keyword: string) {
  return request<SearchUserResponseData>({
    url: "users/search",
    method: "get",
    params: {
      keyword
    }
  })
}
