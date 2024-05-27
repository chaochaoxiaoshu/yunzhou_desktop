import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import { app } from 'electron'
import path from 'path'

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

  startXray(configName: string): void {
    if (process.platform === 'darwin') {
      this.startXrayOnMacOS(configName)
    } else if (process.platform === 'win32') {
      this.startXrayOnWindows(configName)
    }
  }

  private startXrayOnMacOS(configName: string): void {
    spawn('/usr/sbin/networksetup', ['-setwebproxy', 'WI-FI', '127.0.0.1', '24511'])
    spawn('/usr/sbin/networksetup', ['-setsecurewebproxy', 'WI-FI', '127.0.0.1', '24511'])
    spawn('/usr/sbin/networksetup', ['-setsocksfirewallproxy', 'WI-FI', '127.0.0.1', '24512'])

    const bat = spawn(this.getXrayPath(), ['-c', this.getConfigPath(configName)])

    bat.stdout.on('data', (data) => {
      console.log(data)
    })

    bat.stdout.on('error', (err) => {
      console.log(err)
    })

    bat.on('exit', (code) => {
      console.log(code)
    })

    this.childProcess = bat
  }

  private startXrayOnWindows(configName: string): void {
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

    bat.stdout.on('data', (data) => {
      console.log(data)
    })

    bat.stdout.on('error', (err) => {
      console.log(err)
    })

    bat.on('exit', (code) => {
      console.log(code)
    })

    this.childProcess = bat
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
  }

  private endXrayOnWindows(): void {
    spawn('powershell', [
      'Set-ItemProperty -Path',
      '"HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings"',
      '-Name ProxyEnable -Value 0'
    ])
    if (!this.childProcess) return
    this.childProcess.kill()
  }
}
