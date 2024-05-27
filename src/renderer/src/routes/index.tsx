import {
  AccelerationStatus,
  getAccelerationModeTitle,
  useAccelerationStore
} from '@renderer/store/acceleration'
import Spacer from '@renderer/components/spacer'
import Titlebar from '@renderer/components/titlebar'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { MoveRight } from 'lucide-react'
import { Toaster } from '@renderer/components/ui/toaster'
import { useToast } from '@renderer/components/ui/use-toast'

import dashedF from '@renderer/assets/images/dashed_circle_f.png'
import dashedI from '@renderer/assets/images/dashed_circle_f.png'
import airplaneIcon from '@renderer/assets/images/icon_airplane.png'
import autoIcon from '@renderer/assets/images/icon_auto_h.png'

export const Route = createFileRoute('/')({
  component: Index
})

export function Index(): JSX.Element {
  const accelerationStore = useAccelerationStore()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSelectRoute = (): void => {
    if (accelerationStore.status === AccelerationStatus.connected) {
      toast({
        title: '提示',
        description: '切换线路之前请先停止加速'
      })
      return
    }
    navigate({ to: '/route-selection' })
  }
  const handleSelectMode = (): void => {
    // navigate({ to: '/mode-selection' })
  }
  return (
    <div className="flex flex-col h-full">
      <div className="flex-none">
        <Titlebar />
      </div>
      <div className="flex-auto">
        <div className="flex flex-col justify-center items-center py-[3.125rem]">
          <AccelerationButton />
          <Spacer height={44} />
          <div className="flex justify-center items-center">
            <ActionButton icon={airplaneIcon} title="当前线路" onClick={handleSelectRoute}>
              <div className="flex items-center">
                <div>{accelerationStore.route.from}</div>
                <Spacer width={12} />
                <MoveRight size={16} />
                <Spacer width={12} />
                <div>{accelerationStore.route.to}</div>
              </div>
            </ActionButton>
            <Spacer width={128} />
            <ActionButton icon={autoIcon} title="加速模式" onClick={handleSelectMode}>
              {getAccelerationModeTitle(accelerationStore.mode)}
            </ActionButton>
          </div>
          <Spacer height={44} />
        </div>
      </div>
      <Toaster />
    </div>
  )
}

/**
 * 大圈套小圈按钮
 */
function AccelerationButton(): JSX.Element {
  const acceletaionStore = useAccelerationStore()

  const handleSwitch = (): void => {
    if (acceletaionStore.status === AccelerationStatus.connecting) return
    if (acceletaionStore.status === AccelerationStatus.disconnected) {
      acceletaionStore.start(acceletaionStore.route.configNames[acceletaionStore.subRouteIndex])
    } else {
      acceletaionStore.end()
    }
  }

  const buttonLabel = (): string => {
    const labels = {
      [AccelerationStatus.disconnected]: '启动',
      [AccelerationStatus.connecting]: '正在连接',
      [AccelerationStatus.connected]: '断开连接'
    }
    return labels[acceletaionStore.status]
  }

  return (
    <div className="relative cursor-pointer" onClick={handleSwitch}>
      <img className="w-[18.75rem] h-[18.75rem]" src={dashedF} />
      <img
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[13.1875rem] h-[13.1875rem]"
        src={dashedI}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#42FBF5] text-[1.125rem] leading-[1.125rem]">
        {buttonLabel()}
      </div>
    </div>
  )
}

interface ActionButtonProps {
  icon: string
  title: string
  children: React.ReactNode
  onClick?: () => void
}

/**
 * 底部行动按钮
 */
function ActionButton(props: ActionButtonProps): JSX.Element {
  const { icon, title, children, onClick } = props
  return (
    <div
      className="flex flex-col px-6 py-4 min-w-60 bg-[#0B1327] hover:bg-[#141e35] rounded-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center">
        <img src={icon} className="w-[1.125rem] h-[1.125rem]" />
        <Spacer width={8} />
        <div className="text-[1.125rem] leading-[1.125rem]">{title}</div>
      </div>
      <Spacer height={16} />
      <div className="text-white text-opacity-40">{children}</div>
    </div>
  )
}
