import { xtBaseHttpInstance } from '@renderer/utils/request'
import { AxiosResponse } from 'axios'

export interface SendCaptchaAPIParams {
  mobile: string
}

export interface SendCaptchaAPIResData {
  errcode: number
  errmsg: string
  requestId: string
  result: {
    captchaId: string
    picPath: string
  }
}

export const sendCaptchaAPI = (
  params: SendCaptchaAPIParams
): Promise<AxiosResponse<SendCaptchaAPIResData>> => {
  return xtBaseHttpInstance.get('/api/base/v1/public/captcha/sms', { params })
}
