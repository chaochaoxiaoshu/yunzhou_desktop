import Logo from '@renderer/components/icons/logo'
import Spacer from '@renderer/components/spacer'
import Titlebar from '@renderer/components/titlebar'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/profile/about')({
  component: About
})

function About(): JSX.Element {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-none">
        <Titlebar title="关于云舟" showBackButton />
      </div>
      <div className="flex-auto">
        <div className="flex flex-col items-center justify-center h-full">
          <Logo size={58} />
          <Spacer height={18} />
          <div className="text-[1.5rem] leading-[1.5rem] font-medium">v1.1.0</div>
          <Spacer height={48} />
          <div>
            云舟官方网站：
            <a href="http://www.whsdgjzs.com" target="__blank" className="underline">
              http://www.whsdgjzs.com
            </a>
          </div>
          <Spacer height={48} />
          <div className="flex items-center text-[#42FBF5] text-[1.125rem] leading-[1.125rem]">
            <a href="http://www.whsdgjzs.com/html/隐私政策.html" target="__blank">
              《隐私政策》
            </a>
            <Spacer width={48} />
            <a href="http://www.whsdgjzs.com/html/服务条款.html" target="__blank">
              《服务协议》
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
