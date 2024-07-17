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

export type UserInfoResponseData = ApiResponseData<{ username: string; email: string; roles: number[] }>

export type ContactResponseData = ApiResponseData<
  {
    owner: string
    contactId: string
    contactUsername: string
    status: number
    contactTime: Date
  }[]
>
