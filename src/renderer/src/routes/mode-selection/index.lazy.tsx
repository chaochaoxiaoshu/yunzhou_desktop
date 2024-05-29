import Spacer from '@renderer/components/spacer'
import Titlebar from '@renderer/components/titlebar'
import { Checkbox } from '@renderer/components/ui/checkbox'
import {
  AccelerationMode,
  getAccelerationModeTitle,
  useAccelerationStore
} from '@renderer/store/acceleration'
import { createLazyFileRoute } from '@tanstack/react-router'
import clsx from 'clsx'

import smartModeIcon from '@renderer/assets/images/smart_mode.png'
import autoModeIcon from '@renderer/assets/images/auto_mode.png'
import manualModeIcon from '@renderer/assets/images/manual_mode.png'
import globalModeIcon from '@renderer/assets/images/global_mode.png'

export const Route = createLazyFileRoute('/mode-selection/')({
  component: ModeSelection
})

function ModeSelection(): JSX.Element {
  const accelerationStore = useAccelerationStore()
  return (
    <div className="flex flex-col h-full">
      <div className="flex-none">
        <Titlebar showBackButton={true} title="线路选择" />
      </div>
      <div className="flex-auto">
        <div className="flex flex-col px-4">
          <Spacer height={16} />
          <div className="text-base">
            当前选择：
            <span className="text-[#42FBF5]">
              {getAccelerationModeTitle(accelerationStore.mode)}
            </span>
          </div>
          <Spacer height={16} />
          <div className="flex items-center">
            <ModeCard
              checked={accelerationStore.mode === AccelerationMode.smart}
              icon={smartModeIcon}
              title={getAccelerationModeTitle(AccelerationMode.smart)}
              onClick={() => accelerationStore.updateMode(AccelerationMode.smart)}
            />
            <Spacer width={12} />
            <ModeCard
              checked={accelerationStore.mode === AccelerationMode.auto}
              icon={autoModeIcon}
              title={getAccelerationModeTitle(AccelerationMode.auto)}
              onClick={() => accelerationStore.updateMode(AccelerationMode.auto)}
            />
            <Spacer width={12} />
            <ModeCard
              checked={accelerationStore.mode === AccelerationMode.manual}
              icon={manualModeIcon}
              title={getAccelerationModeTitle(AccelerationMode.manual)}
              onClick={() => accelerationStore.updateMode(AccelerationMode.manual)}
            />
            <Spacer width={12} />
            <ModeCard
              checked={accelerationStore.mode === AccelerationMode.global}
              icon={globalModeIcon}
              title={getAccelerationModeTitle(AccelerationMode.global)}
              onClick={() => accelerationStore.updateMode(AccelerationMode.global)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

interface ModeCardProps {
  checked: boolean
  icon: string
  title: string
  onClick?: () => void
}

function ModeCard(props: ModeCardProps): JSX.Element {
  const { checked, icon, title, onClick } = props
  return (
    <div className="relative flex-1 cursor-pointer" onClick={onClick}>
      <div
        className={clsx(
          'flex flex-col items-center py-4 border-solid border rounded-lg bg-[#0B1327] hover:bg-[#141e35]',
          checked ? 'border-[#42FBF5]' : 'border-transparent'
        )}
      >
        <img src={icon} className="w-8 h-8" />
        <Spacer height={16} />
        <div className={clsx('text-base', checked ? 'text-[#42FBF5]' : 'text-white')}>{title}</div>
      </div>
      {checked && <Checkbox checked={true} className="bg-[#42FBF5] absolute right-2 top-2" />}
    </div>
  )
}
