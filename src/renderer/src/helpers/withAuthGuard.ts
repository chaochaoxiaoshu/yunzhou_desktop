import { useLoginFormVisibility } from '@renderer/components/with-login-form'
import { useUserInfoStore } from '@renderer/store/user-info'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withAuthGuard(fn: (...args: any[]) => any): () => void {
  const userInfoStore = useUserInfoStore()
  const { setIsOpenLoginFormDialog } = useLoginFormVisibility()

  return () => {
    if (userInfoStore.token.length === 0) {
      setIsOpenLoginFormDialog(true)
    } else {
      fn()
    }
  }
}
