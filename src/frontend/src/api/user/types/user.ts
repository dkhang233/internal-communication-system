export interface ContactRequestData {
  ownerId: string
  contactId: string
  contactTime: Date
}

export interface UserInfo {
  username: string
  email: string
  roles: string[]
  avatar: string
  status: number
}

export type UserInfoResponseData = ApiResponseData<UserInfo>

export type ContactResponseData = ApiResponseData<
  {
    owner: string
    contactId: string
    contactUsername: string
    status: number
    avatar: string
    contactTime: Date
  }[]
>

export type SearchUserResponseData = ApiResponseData<UserInfo[]>
