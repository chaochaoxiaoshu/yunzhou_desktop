import ProfileItem from '@renderer/components/profile-item'
import Spacer from '@renderer/components/spacer'
import Titlebar from '@renderer/components/titlebar'
import { Button } from '@renderer/components/ui/button'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Gift } from 'lucide-react'
import couponBanner from '@renderer/assets/images/coupon_banner.png'
import myCouponIcon from '@renderer/assets/images/my_coupon.png'
import downloadsIcon from '@renderer/assets/images/downloads.png'
import aboutIcon from '@renderer/assets/images/about.png'

export const Route = createLazyFileRoute('/profile/')({
  component: Profile
})

function Profile(): JSX.Element {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-none">
        <Titlebar />
      </div>
      <div className="flex-auto">
        <div className="flex flex-col">
          {/* 邀请码奖励按钮 */}
          <div className="flex items-center justify-end p-4">
            <Button className="px-4 py-2 bg-gradient-to-r from-[#6A85F4] to-[#42FBF5] rounded-md">
              <Gift size={20} className="text-black" />
              <Spacer width={8} />
              <div className="text-black">邀请码奖励</div>
            </Button>
          </div>
          <Spacer height={8} />
          <div className="flex flex-col w-[42.125rem] mx-auto">
            <div className="flex justify-between items-center">
              <ProfileItem />
              <img className="w-[21.125rem] h-20" src={couponBanner} />
            </div>
            <Spacer height={48} />
            <div className="flex items-center">
              <ProfileActionItem icon={myCouponIcon} title="我的优惠券" />
              <Spacer width={16} />
              <ProfileActionItem icon={downloadsIcon} title="多终端下载" />
              <Spacer width={16} />
              <ProfileActionItem icon={aboutIcon} title="关于云舟" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ProfileActionItemProps {
  icon: string
  title: string
}

function ProfileActionItem(props: ProfileActionItemProps): JSX.Element {
  return (
    <div className="flex flex-col items-center py-12 flex-auto cursor-pointer bg-[#0B1327] hover:bg-[#141e35] rounded-lg">
      <img src={props.icon} className="w-20 h-20" />
      <Spacer height={48} />
      <div className="text-[1.125rem] leading-[1.125rem]">{props.title}</div>
    </div>
  )
}
