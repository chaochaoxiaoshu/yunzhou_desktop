import { ClientInfo, UserInfo } from '@renderer/types'
import { httpInstance } from '@renderer/utils/request'
import { AxiosResponse } from 'axios'

export interface LoginAPIData {
  account: string
  password: string
  client_info?: Partial<ClientInfo>
}

export interface LoginAPIResData {
  token: string
  data: Partial<UserInfo>
}

export const loginAPI = (data: LoginAPIData): Promise<AxiosResponse<LoginAPIResData>> => {
  return httpInstance.post('/api/member/v1/login', data)
}
