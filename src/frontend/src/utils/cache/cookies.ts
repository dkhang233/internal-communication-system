/** Handle Cookies in a unified manner */

import CacheKey from "@/constants/cache-key"
import Cookies from "js-cookie"

export const getToken = () => {
  return Cookies.get(CacheKey.TOKEN)
}
export const setToken = (token: string) => {
  Cookies.set(CacheKey.TOKEN, token)
}
export const removeToken = () => {
  Cookies.remove(CacheKey.TOKEN)
}

export const getCurrentMeet = () => {
  return Cookies.get(CacheKey.CURRENT_MEET)
}
export const setCurrentMeet = (meet: string) => {
  return Cookies.set(CacheKey.CURRENT_MEET, meet)
}
export const removeCurrentMeet = () => {
  Cookies.remove(CacheKey.CURRENT_MEET)
}

export const getMeetToken = () => {
  return Cookies.get(CacheKey.MEET_TOKEN)
}

export const setMeetToken = (token: string) => {
  Cookies.set(CacheKey.MEET_TOKEN, token)
}

export const removeMeetToken = () => {
  Cookies.remove(CacheKey.MEET_TOKEN)
}

export const setEmail = (email: string) => {
  Cookies.set(CacheKey.EMAIL, email)
}

export const getEmail = () => {
  return Cookies.get(CacheKey.EMAIL)
}

export const removeEmail = () => {
  Cookies.remove(CacheKey.EMAIL)
}
