import { httpInstance } from '@renderer/utils/request'
import { ClientInfo } from '@renderer/types'
import { AxiosResponse } from 'axios'

export interface CheckGuestAPIData {
  data: Partial<ClientInfo>
}

export interface CheckGuestAPIResData {
  msg: string
  id: string
  code: string
}

export const checkGuestAPI = (
  data: CheckGuestAPIData
): Promise<AxiosResponse<CheckGuestAPIResData>> => {
  return httpInstance.post('/api/member/v1/guest/check', data)
}
