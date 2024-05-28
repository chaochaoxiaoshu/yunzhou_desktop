import { httpInstance } from '@renderer/utils/request'
import { AxiosResponse } from 'axios'
import { ClientInfo, UserInfo } from '@renderer/types'

export interface RegisterAPIData {
  account: string
  password: string
  username: string
  invite?: string
  captcha?: string
  captcha_id?: string
  client_info?: Partial<ClientInfo>
}

export interface RegisterAPIResData {
  token: string
  data: Partial<UserInfo>
}

export const registerAPI = (data: RegisterAPIData): Promise<AxiosResponse<RegisterAPIResData>> => {
  return httpInstance.post<RegisterAPIResData>('/api/member/v1/register', data)
}
