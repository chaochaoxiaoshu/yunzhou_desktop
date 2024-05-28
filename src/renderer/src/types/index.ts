export interface ClientInfo {
  client_type: number
  device_fingerprint: string
  cpu_architecture: string
  ips: string
  kernel_type: string
  kernel_vision: string
  product_name: string
  user_home_directory: string
}

export interface UserInfo {
  uuid: string
  user_id: string
  memberId: string
  mail: string
  mobile: string
  username: string
  avatar: string
  invite: string
  invite_user: string
  invite_code: string
  is_vip: string
  vip_level: string
  vip_expires_in: string
  balance: string
  balance_expires_in: string
  line: string
  created_at: string
  corp_id: string
  google_id: string
  wechat_id: string
  enabled: string
  account_status: string
  used_time: string
  total_time: string
  total_traffic: string
  used_traffic: string
}
