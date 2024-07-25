import { request } from "@/utils/service"
import { ContactResponseData, SearchUserResponseData, UserInfoResponseData } from "./types/user"

/** Get user details */
export function getUserInfoApi() {
  return request<UserInfoResponseData>({
    url: "users/info",
    method: "get"
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

/** Get specific user's contact */
export function getContactData(contactId: string) {
  return request<ContactResponseData>({
    url: "users/contact",
    method: "get",
    params: { contactId }
  })
}

/** Get all user's contacts */
export function getAllContactData() {
  return request<ContactResponseData>({
    url: "users/contacts",
    method: "get"
  })
}
