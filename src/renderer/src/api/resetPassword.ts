import { xtBaseHttpInstance } from '@renderer/utils/request'
import { AxiosResponse } from 'axios'

interface ResetPasswordAPIData {
  mobile: string
  code?: string
  oldPassword?: string
  newPassword: string
}

type ResetPasswordAPIResData = null

export const resetPasswordAPI = (
  data: ResetPasswordAPIData
): Promise<AxiosResponse<ResetPasswordAPIResData>> => {
  return xtBaseHttpInstance.post('/api/base/v1/admin/set/password', data)
}
