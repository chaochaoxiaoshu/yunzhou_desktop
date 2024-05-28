import { xtBaseHttpInstance } from '@renderer/utils/request'
import { AxiosResponse } from 'axios'

export interface SendEmailCaptchaAPIParams {
  email: string
}

export interface SendEmailCaptchaAPIResData {
  errcode: number
  errmsg: string
  requestId: string
  result: {
    captchaId: string
    picPath: string
  }
}

export const sendEmailCaptchaAPI = (
  params: SendEmailCaptchaAPIParams
): Promise<AxiosResponse<SendEmailCaptchaAPIResData>> => {
  return xtBaseHttpInstance.get('/api/base/v1/public/captcha', { params })
}
