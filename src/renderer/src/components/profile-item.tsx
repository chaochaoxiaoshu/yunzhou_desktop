import { Avatar, AvatarFallback } from '@renderer/components/ui/avatar'
import Spacer from './spacer'
import { Sparkles } from 'lucide-react'

export default function ProfileItem(): JSX.Element {
  return (
    <div className="flex items-center">
      <Avatar size="md">
        <AvatarFallback className="bg-gray-800">U</AvatarFallback>
      </Avatar>
      <Spacer width={16} />
      <div className="flex flex-col">
        <div>账号：{'123123123'}</div>
        <Spacer height={4} />
        <div className="flex items-center text-[#D5C087]">
          <Sparkles size={20} />
          <Spacer width={8} />
          <div>会员到期：2024-04-29</div>
        </div>
      </div>
    </div>
  )
}
