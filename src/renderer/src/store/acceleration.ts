import { create } from 'zustand'
import sg from '@renderer/assets/images/sg.png'

export const allRoutes: AccelerationRoute[] = [
  {
    icon: sg,
    from: '亚太',
    to: '中国大陆',
    description: '专为东南亚用户优化',
    subRoutesCount: 2,
    configNames: ['hk-fu_client', 'vless_usa']
  }
]

interface AccelerationStore {
  status: AccelerationStatus
  route: AccelerationRoute
  subRouteIndex: number
  mode: AccelerationMode
  start: (configName: string) => void
  end: () => void
  updateRoute: (route: AccelerationRoute, subRouteIndex: number) => void
  updateMode: (mode: AccelerationMode) => void
}

export const useAccelerationStore = create<AccelerationStore>((set) => ({
  status: AccelerationStatus.disconnected,
  route: allRoutes[0],
  subRouteIndex: 0,
  mode: AccelerationMode.global,
  start: (configName: string): void => {
    set(() => ({ status: AccelerationStatus.connecting }))
    window.electron.ipcRenderer.invoke('startXray', configName)
    setTimeout(() => {
      set(() => ({ status: AccelerationStatus.connected }))
    }, 1000)
  },
  end: (): void => {
    window.electron.ipcRenderer.invoke('endXray')
    set(() => ({ status: AccelerationStatus.disconnected }))
  },
  updateRoute: (route: AccelerationRoute, subRouteIndex: number): void => {
    set(() => ({ route, subRouteIndex }))
  },
  updateMode: (mode: AccelerationMode): void => {
    set(() => ({ mode }))
  }
}))

export enum AccelerationStatus {
  disconnected,
  connecting,
  connected
}

export enum AccelerationMode {
  smart,
  auto,
  manual,
  global
}

export function getAccelerationModeTitle(mode: AccelerationMode): string {
  const titles = {
    [AccelerationMode.smart]: '应用智能模式（推荐）',
    [AccelerationMode.auto]: '应用自动加速模式',
    [AccelerationMode.manual]: '应用手动模式',
    [AccelerationMode.global]: '全局模式'
  }
  return titles[mode]
}

export function getAccelerationModeDesc(mode: AccelerationMode): string {
  const descs = {
    [AccelerationMode.smart]: '自动对国内APP及网页加速到中国线路使用',
    [AccelerationMode.auto]: '应用启动后将自动加速到中国线路使用',
    [AccelerationMode.manual]: '应用启动后将自动加速到中国线路使用',
    [AccelerationMode.global]: '所有网络数据都将加速到中国线路使用(Facebook及Google除外)'
  }
  return descs[mode]
}

export interface AccelerationRoute {
  icon: string
  title?: string
  from?: string
  to?: string
  description: string
  subRoutesCount: number
  configNames: string[]
}
