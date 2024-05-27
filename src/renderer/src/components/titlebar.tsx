import { Button } from './ui/button'
import Spacer from './spacer'
import { useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import contactIcon from '@renderer/assets/images/icon_contact.png'
import emailIcon from '@renderer/assets/images/icon_email.png'
import settingsIcon from '@renderer/assets/images/icon_settings.png'

interface TitlebarProps {
  showBackButton?: boolean
  title?: string
  titleView?: React.ReactNode
}

export default function Titlebar(props: TitlebarProps): JSX.Element {
  const router = useRouter()

  const titleView = (): React.ReactNode => {
    if (props.titleView) return props.titleView
    return props.title ? <div className="text-white">{props.title}</div> : <div></div>
  }

  return (
    <div className="flex items-center justify-between h-14 px-4">
      <div className="flex items-center">
        {props.showBackButton && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 hover:text-white hover:bg-opacity-20 rounded-lg"
              onClick={() => router.navigate({ to: '/', replace: true })}
            >
              <ArrowLeft size={22} />
            </Button>
            <Spacer width={20} />
          </>
        )}
        {titleView()}
      </div>
      <div className="flex items-center space-x-4">
        <TitlebarButton icon={contactIcon} />
        <TitlebarButton icon={emailIcon} />
        <TitlebarButton icon={settingsIcon} />
      </div>
    </div>
  )
}

interface TitlebarButtonProps {
  icon: string
}

function TitlebarButton(props: TitlebarButtonProps): JSX.Element {
  return (
    <Button variant="ghost" size="icon" className="w-6 h-6 hover:bg-opacity-20">
      <img className="w-6 h-6" src={props.icon} />
    </Button>
  )
}
