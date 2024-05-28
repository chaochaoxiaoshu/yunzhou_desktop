import { useState, useEffect, useCallback } from 'react'
import { Button } from '@renderer/components/ui/button'
import { Loader2 } from 'lucide-react'

interface CountdownButtonProps {
  onClick: () => Promise<boolean>
}

export default function CountdownButton(props: CountdownButtonProps): JSX.Element {
  const [countdown, setCountdown] = useState(60)
  const [isCounting, setIsCounting] = useState(false)
  const [loading, setLoading] = useState(false)

  const buttonLabel = ((): string => {
    if (isCounting) return `重新发送(${countdown})`
    if (loading) return '发送中'
    return '发送'
  })()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isCounting && countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000)
    } else if (countdown === 0) {
      setIsCounting(false)
    }
    return () => clearTimeout(timer)
  }, [isCounting, countdown])

  const handleClick = useCallback(async () => {
    if (!isCounting) {
      try {
        setLoading(true)
        const result = await props.onClick()
        setLoading(false)
        if (result) {
          setIsCounting(true)
          setCountdown(60 - 1)
        }
      } catch (error) {
        console.error('Error sending captcha:', error)
      }
    }
  }, [isCounting, props.onClick])

  return (
    <Button
      type="button"
      variant="ghost"
      className="hover:bg-transparent"
      disabled={isCounting || loading}
      onClick={handleClick}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {buttonLabel}
    </Button>
  )
}
