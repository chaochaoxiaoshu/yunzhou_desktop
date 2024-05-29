import { httpInstance } from '@renderer/utils/request'
import { AxiosResponse } from 'axios'

export enum ConnectStatus {
  上线 = 1,
  下线 = 2
}

interface ToggleConnectStatusAPIData {
  uuid: string
  type: ConnectStatus
}

export function toggleConnectStatusAPI(
  data: ToggleConnectStatusAPIData
): Promise<AxiosResponse<null>> {
  return httpInstance.post('/api/member/v1/guest/logout', data)
}
