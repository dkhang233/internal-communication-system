/** The response data of all api interfaces should adhere to this format */
interface ApiResponseData<T> {
  code: number
  data: T
  message: string
}
