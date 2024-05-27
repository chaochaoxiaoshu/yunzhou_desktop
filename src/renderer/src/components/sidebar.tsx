import clsx from 'clsx'
import { Link, useRouter } from '@tanstack/react-router'

import Spacer from './spacer'

import Logo from './icons/logo'
import AccelerationIcon from '@renderer/components/icons/sidebar-acceleration'
import VipIcon from '@renderer/components/icons/sidebar-vip'
import ProfileIcon from '@renderer/components/icons/sidebar-profile'

export default function Sidebar(): JSX.Element {
  return (
    <div className="flex flex-col justify-between items-center w-[6.25rem] h-full py-8 bg-[#0B1327]">
      {/* Logo */}
      <div className="flex flex-col items-center">
        <Logo size={32} />
        <Spacer height={10} />
        <div className="text-white text-[0.875rme] leading-[0.875rem]">云舟加速器</div>
      </div>
      {/* Items */}
      <div className="flex flex-col">
        <SidebarItem to="/" checked={true} icon={<AccelerationIcon />} title="加速" />
        <SidebarItem to="/purchase" checked={true} icon={<VipIcon />} title="会员" />
        <SidebarItem to="/profile" checked={true} icon={<ProfileIcon />} title="我的" />
      </div>
      {/* 版本号 */}
      <div className="flex flex-col items-center text-white text-opacity-40">
        <div>版本号</div>
        <div>v1.1.0</div>
      </div>
    </div>
  )
}

interface SidebarItemProps {
  to: string
  checked: boolean
  icon: React.ReactNode
  title: string
}

function SidebarItem(props: SidebarItemProps): JSX.Element {
  const { to, icon, title } = props
  const router = useRouter()
  const checked = router.state.location.pathname === to
  return (
    <Link
      to={to}
      replace={true}
      className="flex flex-col items-center p-6 rounded-xl hover:bg-white hover:bg-opacity-10 cursor-pointer"
    >
      <div className={checked ? 'text-[#42FBF5]' : 'text-white text-opacity-40'}>{icon}</div>
      <Spacer height={16} />
      <div
        className={clsx(
          'text-white text-[0.875rme] leading-[0.875rem]',
          checked ? 'text-opacity-100' : 'text-opacity-40'
        )}
      >
        {title}
      </div>
    </Link>
  )
}
