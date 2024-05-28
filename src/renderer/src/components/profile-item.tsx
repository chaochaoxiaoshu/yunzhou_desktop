import { Avatar, AvatarFallback } from '@renderer/components/ui/avatar'
import Spacer from './spacer'
// import { Sparkles } from 'lucide-react'
import { useUserInfoStore } from '@renderer/store/user-info'
import { Button } from './ui/button'
import { useLoginFormVisibility } from '@renderer/routes/__root'
import { useCallback } from 'react'

export default function ProfileItem(): JSX.Element {
  const { setIsOpenLoginFormDialog } = useLoginFormVisibility()
  const userInfoStore = useUserInfoStore()
  const isLogged = userInfoStore.token.length > 0

  const handleClick = useCallback((): void => {
    if (isLogged) return
    setIsOpenLoginFormDialog(true)
  }, [isLogged, setIsOpenLoginFormDialog])

  const handleLogout = useCallback((): void => {
    userInfoStore.reset()
  }, [userInfoStore])

  return (
    <div className="flex items-center cursor-pointer" onClick={handleClick}>
      <Avatar>
        <AvatarFallback className="bg-gray-800">U</AvatarFallback>
      </Avatar>
      <Spacer width={16} />
      <div className="flex flex-col">
        <div>{isLogged ? `云舟ID：${userInfoStore.memberId}` : '请登录'}</div>
        <Spacer height={4} />
        {/* {isLogged && (
          <div className="flex items-center text-[#D5C087]">
            <Sparkles size={20} />
            <Spacer width={8} />
            <div>会员到期：2024-04-29</div>
          </div>
        )} */}
        {isLogged && (
          <Button className="px-4 py-3 bg-gray-800 rounded-full" onClick={handleLogout}>
            退出登录
          </Button>
        )}
      </div>
    </div>
  )
}
