import { useEffect, useState } from 'react'
import TabBar from '@renderer/components/tab-bar'
import Titlebar from '@renderer/components/titlebar'
import { Checkbox } from '@renderer/components/ui/checkbox'
import { createLazyFileRoute } from '@tanstack/react-router'
import Spacer from '@renderer/components/spacer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@renderer/components/ui/accordion'
import { AccelerationRoute, allRoutes, useAccelerationStore } from '@renderer/store/acceleration'
import { Loader2, MoveRight } from 'lucide-react'
import crownIcon from '@renderer/assets/images/crown.png'

export const Route = createLazyFileRoute('/route-selection/')({
  component: RouteSelection
})

function RouteSelection(): JSX.Element {
  const [selection, setSelection] = useState(0)
  const accelerationStore = useAccelerationStore()

  const [latency, setLatency] = useState<Record<number, number[]>>([])

  const testLatency = async (): Promise<Record<number, number[]>> => {
    const configNames: Record<number, string[]> = {}
    allRoutes.forEach((route) => (configNames[route.id] = route.configNames))
    const result = await window.electron.ipcRenderer.invoke('testLatency', configNames)
    return result as Record<number, number[]>
  }

  useEffect(() => {
    testLatency().then((res) => {
      console.log(res)
      setLatency(res)
    })
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* 标题栏 */}
      <div className="flex-none">
        <Titlebar showBackButton={true} title="线路选择" />
      </div>
      {/* 内容 */}
      <div className="flex-auto">
        <div className="flex flex-col px-4 pb-4 h-full">
          {/* 标签栏 */}
          <div className="flex-none flex justify-between items-center">
            <TabBar
              items={['VIP专区', '普通专区']}
              currentIndex={selection}
              onChange={(index) => setSelection(index)}
            />
            <div className="flex items-center">
              <Checkbox id="autoSelect" className="border-white rounded-full" />
              <Spacer width={8} />
              <label htmlFor="autoSelect">自动选择</label>
            </div>
          </div>
          <Spacer height={16} />
          {/* 列表 */}
          <div className="flex-auto bg-[#0B1327] rounded-lg overflow-y-scroll">
            <Accordion
              defaultValue={accelerationStore.route.description}
              type="single"
              collapsible
              className="w-full"
            >
              {allRoutes.map((route, index) => {
                return (
                  <RouteItem
                    key={index}
                    route={route}
                    latencyList={latency[route.id]}
                    onSelect={(route, index) => accelerationStore.updateRoute(route, index)}
                  />
                )
              })}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  )
}

interface RouteItemProps {
  route: AccelerationRoute
  latencyList: number[]
  onSelect?: (route: AccelerationRoute, subRouteIndex: number) => void
}

function RouteItem(props: RouteItemProps): JSX.Element {
  const { route, latencyList, onSelect } = props
  const accelerationStore = useAccelerationStore()
  return (
    <AccordionItem value={route.description} className="border-b-transparent">
      <AccordionTrigger className="px-4 h-[4.75rem] hover:no-underline hover:bg-opacity-10 hover:bg-white">
        <div className="flex items-center">
          <img src={route.icon} className="w-6 h-6 rounded-full overflow-hidden" />
          <Spacer width={16} />
          <div className="flex flex-col items-start">
            <div className="flex items-center">
              {route.from}
              <Spacer width={12} />
              <MoveRight />
              <Spacer width={12} />
              {route.to}
            </div>
            <Spacer height={8} />
            <div className="text-[0.75rem] leading-[0.75rem] text-white text-opacity-40">
              {route.description}
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {Array(route.subRoutesCount)
          .fill(0)
          .map((_, index) => {
            return (
              <div
                key={index}
                className="flex items-center p-4 cursor-pointer hover:bg-opacity-10 hover:bg-white"
                onClick={() => (onSelect ? onSelect(route, index) : null)}
              >
                <img src={crownIcon} className="w-4 h-4" />
                <Spacer width={12} />
                <div>{route.from}</div>
                <Spacer width={12} />
                <MoveRight />
                <Spacer width={12} />
                <div>{route.to}</div>
                <Spacer width={8} />
                <div>专线 {index + 1}</div>
                <div className="flex-auto" />
                {latencyList ? (
                  <div className="text-emerald-500">{latencyList[index]}ms</div>
                ) : (
                  <Loader2 size={16} className="animate-spin" />
                )}
                <Spacer width={12} />
                <Checkbox
                  checked={accelerationStore.subRouteIndex === index}
                  className="w-5 h-5 rounded-full border-white border-[2px] font-bold"
                  onClick={(e) => e.preventDefault()}
                />
              </div>
            )
          })}
      </AccordionContent>
    </AccordionItem>
  )
}
