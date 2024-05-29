import { useState, createContext, useContext, Dispatch, SetStateAction } from 'react'
import LoginFormDialog from '@renderer/components/login-form-dialog'

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

interface WithLoginFormProps {
  children: React.ReactNode
}

export default function WithLoginForm(props: WithLoginFormProps): JSX.Element {
  const [isOpenLoginFormDialog, setIsOpenLoginFormDialog] = useState(false)
  return (
    <LoginFormVisibilityContext.Provider
      value={{ isOpenLoginFormDialog, setIsOpenLoginFormDialog }}
    >
      {props.children}
      <LoginFormDialog open={isOpenLoginFormDialog} onOpenChange={setIsOpenLoginFormDialog} />
    </LoginFormVisibilityContext.Provider>
  )
}
