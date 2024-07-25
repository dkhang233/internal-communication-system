export interface LoginRequestData {
  /** admin or editor */
  email: string
  /** password */
  password: string
  /** Verification code */
  code: string
}

export type LoginCodeResponseData = ApiResponseData<string>

export type LoginResponseData = ApiResponseData<{ token: string }>
