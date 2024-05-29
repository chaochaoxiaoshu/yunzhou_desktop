import os, { networkInterfaces } from 'os'
import crypto from 'crypto'

interface ClientInfo {
  client_type: number
  device_fingerprint: string
  cpu_architecture: string
  ips: string
  kernel_type: string
  kernel_version: string
  product_name: string
  user_home_directory: string
}

export function getClientInfo(): ClientInfo {
  const client_type = 1
  const cpu_architecture = os.arch()
  const ips = getIps()
  const kernel_type = os.type()
  const kernel_version = os.release()
  const product_name = ((): string => {
    if (process.platform === 'win32') {
      return 'windows'
    } else if (process.platform === 'darwin') {
      return 'macos'
    }
    return 'unknown'
  })()
  const user_home_directory = os.homedir()

  const raw_device_fingerprint = `${cpu_architecture}-${ips}-${kernel_type}-${kernel_version}-${product_name}-${user_home_directory}`
  const hash = crypto.createHash('sha256')
  hash.update(raw_device_fingerprint)
  const device_fingerprint = hash.digest('hex')

  return {
    client_type,
    device_fingerprint,
    cpu_architecture,
    ips,
    kernel_type,
    kernel_version,
    product_name,
    user_home_directory
  }
}

function getIps(): string {
  const interfaces = networkInterfaces()
  const ips: string[] = []
  for (const interfaceName in interfaces) {
    interfaces[interfaceName]?.forEach(function (details) {
      if (details.family === 'IPv4' && !details.internal) {
        ips.push(details.address)
      }
    })
  }
  return ips.join(', ')
}
