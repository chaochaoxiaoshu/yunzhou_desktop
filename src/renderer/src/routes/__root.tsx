import { useState, createContext, useContext, Dispatch, SetStateAction } from 'react'
import Sidebar from '@renderer/components/sidebar'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Index } from '.'
import LoginFormDialog from '@renderer/components/login-form-dialog'

/**
 * 登录弹窗在此注入，这个根布局组件负责维护登录弹窗的显示与隐藏状态，
 * 并将该状态使用 Context 注入到组件树中，以便在所有页面中都能便捷地使用这个状态。
 */
// Login Form Context START
interface LoginFormVisibilityContextType {
  isOpenLoginFormDialog: boolean
  setIsOpenLoginFormDialog: Dispatch<SetStateAction<boolean>>
}

const LoginFormVisibilityContext = createContext<LoginFormVisibilityContextType | undefined>(
  undefined
)

export const useLoginFormVisibility = (): LoginFormVisibilityContextType => {
  const context = useContext(LoginFormVisibilityContext)
  if (!context) {
    throw new Error(
      'useLoginFormVisibility must be used within a LoginFormVisibilityContext.Provider'
    )
  }
  return context
}
// Login Form Context END

/**
 * 根布局将 Sidebar 永远固定在界面左侧，并在此注入了登录弹窗组件和它的状态
 */
export const Route = createRootRoute({
  component: () => {
    const [isOpenLoginFormDialog, setIsOpenLoginFormDialog] = useState(false)

    return (
      <LoginFormVisibilityContext.Provider
        value={{ isOpenLoginFormDialog, setIsOpenLoginFormDialog }}
      >
        <div className="flex h-screen overflow-hidden text-white bg-[#050913]">
          <div className="flex-none">
            <Sidebar />
          </div>
          <div className="flex-auto">
            <Outlet />
          </div>
        </div>
        <LoginFormDialog open={isOpenLoginFormDialog} onOpenChange={setIsOpenLoginFormDialog} />
      </LoginFormVisibilityContext.Provider>
    )
  },
  notFoundComponent: Index
})
