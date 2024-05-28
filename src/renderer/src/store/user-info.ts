import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface UserInfoStore {
  token: string
  memberId: string
  uuid: string
  userId: string
  guestId: string
}

interface UserInfoStoreActions {
  updateToken: (token: string) => void
  updateMemberId: (memberId: string) => void
  updateUuid: (uuid: string) => void
  updateUserId: (userId: string) => void
  updateGuestId: (guestId: string) => void
  reset: () => void
}

const initialState: UserInfoStore = {
  token: '',
  memberId: '',
  uuid: '',
  userId: '',
  guestId: ''
}

export const useUserInfoStore = create<UserInfoStore & UserInfoStoreActions>()(
  persist(
    (set) => ({
      ...initialState,
      updateToken: (token: string): void => {
        set(() => ({ token }))
      },
      updateMemberId: (memberId: string): void => {
        set(() => ({ memberId }))
      },
      updateUuid: (uuid: string): void => {
        set(() => ({ uuid }))
      },
      updateUserId: (userId: string): void => {
        set(() => ({ userId }))
      },
      updateGuestId: (guestId: string): void => {
        set(() => ({ guestId }))
      },
      reset: (): void => {
        set(initialState)
      }
    }),
    {
      name: 'user-info',
      storage: createJSONStorage(() => localStorage)
    }
  )
)
