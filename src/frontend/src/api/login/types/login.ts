export interface LoginRequestData {
  /** admin or editor */
  email: string
  /** password */
  password: string
  /** Verification code */
  code: string
}

export interface ContactRequestData {
  ownerId: string
  contactId: string
  contactTime: Date
}

export interface UserInfo {
  username: string
  email: string
  roles: number[]
  avatar: string
  status: boolean
}

export type LoginCodeResponseData = ApiResponseData<string>

export type LoginResponseData = ApiResponseData<{ token: string }>

export type UserInfoResponseData = ApiResponseData<UserInfo>

export type ContactResponseData = ApiResponseData<
  {
    owner: string
    contactId: string
    contactUsername: string
    status: number
    contactTime: Date
  }[]
>

export type SearchUserResponseData = ApiResponseData<UserInfo[]>
