import { create } from 'zustand'
import sg from '@renderer/assets/images/sg.png'
import { ConnectStatus, toggleConnectStatusAPI } from '@renderer/api/toggleConnectStatus'
import { useUserInfoStore } from './user-info'

export const allRoutes: AccelerationRoute[] = [
  {
    icon: sg,
    from: '亚太',
    to: '中国大陆',
    description: '专为东南亚用户优化',
    // 子线路总数
    subRoutesCount: 2,
    // 每条子线路对应的配置名称
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
  // 当前连接状态
  status: AccelerationStatus.disconnected,
  // 当前选择的线路
  route: allRoutes[0],
  // 当前选择的子线路
  subRouteIndex: 0,
  // 当前选择的加速模式
  mode: AccelerationMode.global,
  // 启动，根据指定配置名称，启动 Xray 进程，向服务器发送上线请求，并切换 UI 状态
  start: (configName: string): void => {
    set(() => ({ status: AccelerationStatus.connecting }))
    window.electron.ipcRenderer.invoke('startXray', configName)
    toggleConnectStatusAPI({
      uuid: useUserInfoStore.getState().uuid,
      type: ConnectStatus.上线
    })
    setTimeout(() => {
      set(() => ({ status: AccelerationStatus.connected }))
    }, 1000)
  },
  // 停止，杀死 Xray 进程，向服务器发送下线请求，并切换 UI 状态
  end: (): void => {
    window.electron.ipcRenderer.invoke('endXray')
    toggleConnectStatusAPI({
      uuid: useUserInfoStore.getState().uuid,
      type: ConnectStatus.下线
    })
    set(() => ({ status: AccelerationStatus.disconnected }))
  },
  // 更新线路选择
  updateRoute: (route: AccelerationRoute, subRouteIndex: number): void => {
    set(() => ({ route, subRouteIndex }))
  },
  // 更新模式选择
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

/**
 * 获取给定模式的用于显示的标题
 *
 * @param mode 加速模式
 * @returns 标题
 */
export function getAccelerationModeTitle(mode: AccelerationMode): string {
  const titles = {
    [AccelerationMode.smart]: '应用智能模式（推荐）',
    [AccelerationMode.auto]: '应用自动加速模式',
    [AccelerationMode.manual]: '应用手动模式',
    [AccelerationMode.global]: '全局模式'
  }
  return titles[mode]
}

/**
 * 获取给定模式的用于显示的介绍
 *
 * @param mode 加速模式
 * @returns 介绍
 */
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
