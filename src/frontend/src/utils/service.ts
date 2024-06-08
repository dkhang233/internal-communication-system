import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios"
import { useUserStoreHook } from "@/store/modules/user"
import { ElMessage } from "element-plus"
import { get, merge } from "lodash-es"
import { getToken } from "./cache/cookies"

/** Log out and force refresh the page (will redirect to the login page) */
function logout() {
  useUserStoreHook().logout()
  location.reload()
}

/** Create request instance */
function createService() {
  //Create an axios instance named service
  const service = axios.create()
  //Request interception
  service.interceptors.request.use(
    (config) => config,
    // Failed to send
    (error) => Promise.reject(error)
  )
  //Response interception (can be adjusted according to specific business)
  service.interceptors.response.use(
    (response) => {
      // apiData is the data returned by api
      const apiData = response.data
      //Binary data is returned directly
      const responseType = response.request?.responseType
      if (responseType === "blob" || responseType === "arraybuffer") return apiData
      // This code is the business code agreed with the backend
      const code = apiData.code
      // If there is no code, it means this is not an API developed by the project backend.
      if (code === undefined) {
        ElMessage.error("Interfaces other than this system")
        return Promise.reject(new Error("Interfaces other than this system"))
      }
      switch (code) {
        case 0:
          // This system uses code === 0 to indicate no business errors
          return apiData
        case 401:
          // When Token expires
          return logout()
        default:
          // Not the correct code
          ElMessage.error(apiData.message || "Error")
          return Promise.reject(new Error("Error"))
      }
    },
    (error) => {
      // status is the HTTP status code
      const status = get(error, "response.status")
      switch (status) {
        case 400:
          error.message = "Request error"
          break
        case 401:
          // When Token expires
          logout()
          break
        case 403:
          error.message = "Access denied"
          break
        case 404:
          error.message = "Error requesting address"
          break
        case 408:
          error.message = "Request timed out"
          break
        case 500:
          error.message = "Server internal error"
          break
        case 501:
          error.message = "Service not implemented"
          break
        case 502:
          error.message = "Gateway error"
          break
        case 503:
          error.message = "Service is not available"
          break
        case 504:
          error.message = "Gateway timeout"
          break
        case 505:
          error.message = "HTTP version is not supported"
          break
        default:
          break
      }
      ElMessage.error(error.message)
      return Promise.reject(error)
    }
  )
  return service
}

/** Create request method */
function createRequest(service: AxiosInstance) {
  return function <T>(config: AxiosRequestConfig): Promise<T> {
    const token = getToken()
    const defaultConfig = {
      headers: {
        //Carry Token
        Authorization: token ? `Bearer ${token}` : undefined,
        "Content-Type": "application/json"
      },
      timeout: 0,
      baseURL: import.meta.env.VITE_BASE_API,
      data: {}
    }
    // Merge the default configuration defaultConfig and the incoming custom configuration config into mergeConfig
    const mergeConfig = merge(defaultConfig, config)
    return service(mergeConfig)
  }
}

/** Instance used for network requests */
const service = createService()
/** Method used for network requests */
export const request = createRequest(service)
