import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import { app } from 'electron'
import path from 'path'
import axios from 'axios'

export class XrayManager {
  private static instance: XrayManager

  private constructor() {
    return
  }

  public static get shared(): XrayManager {
    if (!XrayManager.instance) {
      XrayManager.instance = new XrayManager()
    }
    return this.instance
  }

  childProcess?: ChildProcessWithoutNullStreams

  private getXrayPath(): string {
    const basePath =
      process.env.NODE_ENV === 'development'
        ? path.resolve(__dirname, '../../resources/bin')
        : path.resolve(app.getAppPath(), 'resources/bin').replace('app.asar', 'app.asar.unpacked')

    return process.platform === 'darwin'
      ? path.join(basePath, 'xray_macos', 'xray')
      : path.join(basePath, 'xray_windows', 'xray')
  }

  private getConfigPath(configName: string): string {
    const basePath =
      process.env.NODE_ENV === 'development'
        ? path.resolve(__dirname, '../../resources/bin')
        : path.resolve(app.getAppPath(), 'resources/bin').replace('app.asar', 'app.asar.unpacked')

    return process.platform === 'darwin'
      ? path.join(basePath, 'xray_macos', `${configName}.json`)
      : path.join(basePath, 'xray_windows', `${configName}.json`)
  }

  async startXray(configName: string): Promise<void> {
    if (process.platform === 'darwin') {
      await this.startXrayOnMacOS(configName)
    } else if (process.platform === 'win32') {
      await this.startXrayOnWindows(configName)
    }
  }

  private startXrayOnMacOS(configName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      spawn('/usr/sbin/networksetup', ['-setwebproxy', 'WI-FI', '127.0.0.1', '24511'])
      spawn('/usr/sbin/networksetup', ['-setsecurewebproxy', 'WI-FI', '127.0.0.1', '24511'])
      spawn('/usr/sbin/networksetup', ['-setsocksfirewallproxy', 'WI-FI', '127.0.0.1', '24512'])

      const bat = spawn(this.getXrayPath(), ['-c', this.getConfigPath(configName)])

      this.childProcess = bat

      bat.stdout.on('data', (data) => {
        console.log(data)
        resolve()
      })
      bat.stdout.on('error', () => {
        reject(`Failed to start Xray with config ${configName}`)
      })
    })
  }

  private startXrayOnWindows(configName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      spawn('powershell', [
        'Set-ItemProperty -Path',
        '"HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings"',
        '-Name ProxyServer -Value 127.0.0.1:24511'
      ])
      spawn('powershell', [
        'Set-ItemProperty -Path',
        '"HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings"',
        '-Name ProxyOverride -Value '
      ])
      spawn('powershell', [
        'Set-ItemProperty -Path',
        '"HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings"',
        '-Name ProxyEnable -Value 1'
      ])

      const bat = spawn(this.getXrayPath(), ['-c', this.getConfigPath(configName)])

      this.childProcess = bat

      bat.stdout.on('data', (data) => {
        console.log(data)
        resolve()
      })
      bat.stdout.on('error', () => {
        reject(`Failed to start Xray with config ${configName}`)
      })
    })
  }

  endXray(): void {
    if (process.platform === 'darwin') {
      this.endXrayOnMacOS()
    } else if (process.platform === 'win32') {
      this.endXrayOnWindows()
    }
  }

  private endXrayOnMacOS(): void {
    spawn('/usr/sbin/networksetup', ['-setwebproxystate', 'WI-FI', 'off'])
    spawn('/usr/sbin/networksetup', ['-setsecurewebproxystate', 'WI-FI', 'off'])
    spawn('/usr/sbin/networksetup', ['-setsocksfirewallproxystate', 'WI-FI', 'off'])
    if (!this.childProcess) return
    this.childProcess.kill()
    this.childProcess = undefined
  }

  private endXrayOnWindows(): void {
    spawn('powershell', [
      'Set-ItemProperty -Path',
      '"HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings"',
      '-Name ProxyEnable -Value 0'
    ])
    if (!this.childProcess) return
    this.childProcess.kill()
    this.childProcess = undefined
  }

  /**
   * 根据给定的配置，测算延迟
   *
   * @example
   * const configNames = {
   *   0: ['vless_usa', 'vless_sg'],
   *   1: ['vless_k', 'vless_v']
   * }
   * const result = await XrayManager.shared.testLatency(configNames)
   * // { 0: [123, 110], 1: [89, 105] }
   *
   * @param configNames key 为线路 id，value 为子线路列表对应的配置名称数组
   * @returns key 为线路 id，value 为子线路列表对应的延迟
   */
  async testLatency(configNames: Record<number, string[]>): Promise<Record<number, number[]>> {
    const result: Record<number, number[]> = []
    for (const key in configNames) {
      const numKey = Number(key)
      const configNameList = configNames[numKey]
      for (const configName of configNameList) {
        await this.startXray(configName)
        const start = Date.now()
        await axios.get('https://www.baidu.com')
        const latency = Date.now() - start
        if (result[numKey]) {
          result[numKey].push(latency)
        } else {
          result[numKey] = [latency]
        }
        this.endXray()
      }
    }
    return result
  }
}
