import { useCallback, useMemo, useState } from 'react'
import Spacer from './spacer'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Tabs, TabsList, TabsContent, TabsTrigger } from './ui/tabs'
import { Button } from './ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Checkbox } from './ui/checkbox'
import { Toaster } from './ui/toaster'
import { useToast } from './ui/use-toast'
import { Loader2 } from 'lucide-react'
import ResetPasswordDialog from './reset-password-dialog'
import { SendCaptchaAPIResData, sendCaptchaAPI } from '@renderer/api/sendCaptcha'
import { SendEmailCaptchaAPIResData, sendEmailCaptchaAPI } from '@renderer/api/sendEmailCaptcha'
import { AxiosResponse, AxiosError } from 'axios'
import { registerAPI } from '@renderer/api/register'
import { loginAPI } from '@renderer/api/login'
import { useUserInfoStore } from '@renderer/store/user-info'
import { useLoginFormVisibility } from '@renderer/components/with-login-form'
import CountdownButton from './countdown-button'
import { ClientInfo } from '@renderer/types'

interface LoginFormDialogProps {
  open: boolean
  onOpenChange: (val: boolean) => void
}

export default function LoginFormDialog(props: LoginFormDialogProps): JSX.Element {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  const tipText = mode === 'login' ? '没有账号？立即注册' : '已有账号？立即登录'

  const handleToggleMode = (): void => {
    mode === 'login' ? setMode('register') : setMode('login')
  }
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="w-96 bg-white border-none">
        {/* 表单内容 */}
        {mode === 'login' ? <LoginContent /> : <RegisterContent />}
        {/* 底部提示按钮 */}
        <div className="flex justify-center items-center">
          <div
            className="text-transparent font-medium bg-clip-text bg-gradient-to-r from-[#6A85F4] to-[#42FBF5] cursor-pointer"
            onClick={handleToggleMode}
          >
            {tipText}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function LoginContent(): JSX.Element {
  const [selection, setSelection] = useState<'email' | 'mobile'>('email')
  return (
    <DialogHeader>
      <DialogTitle>登录</DialogTitle>
      <Spacer height={10} />
      <div className="border-b"></div>
      <Tabs value={selection} onValueChange={(val) => setSelection(val as 'email' | 'mobile')}>
        <TabsList className="p-0 space-x-8">
          <TabsTrigger
            value="email"
            className={clsx(
              'text-base px-0 py-1 shadow-opacity-0 border-b-[3px] border-solid',
              selection === 'email'
                ? 'text-black border-[#42FBF5]'
                : 'text-[#999999] border-transparent'
            )}
          >
            邮箱登录
          </TabsTrigger>
          <TabsTrigger
            value="mobile"
            className={clsx(
              'text-base px-0 py-1 shadow-opacity-0 border-b-[3px] border-solid',
              selection === 'mobile'
                ? 'text-black border-[#42FBF5]'
                : 'text-[#999999] border-transparent'
            )}
          >
            手机号登录
          </TabsTrigger>
        </TabsList>
        <Spacer height={12} />
        <TabsContent value="email">
          <LoginForm type="email" />
        </TabsContent>
        <TabsContent value="mobile">
          <LoginForm type="mobile" />
        </TabsContent>
      </Tabs>
    </DialogHeader>
  )
}

interface LoginFormProps {
  type: 'email' | 'mobile'
}

function LoginForm(props: LoginFormProps): JSX.Element {
  const { type } = props
  const { toast } = useToast()
  const { setIsOpenLoginFormDialog } = useLoginFormVisibility()
  const userInfoStore = useUserInfoStore()
  const [rememberPassword, setRememberPassword] = useState(false)
  const [isOpenResetPasswordDialog, setIsOpenResetPasswordDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const formSchema = useMemo(() => {
    return z.object({
      account:
        type === 'email'
          ? z.string().email('请输入正确的邮箱账号')
          : z.string().length(11, '请输入正确的手机号'),
      password: z.string().min(1, '请输入密码')
    })
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account: '',
      password: ''
    }
  })

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>): Promise<void> => {
      try {
        setLoading(true)
        const clientInfo = (await window.electron.ipcRenderer.invoke('getClientInfo')) as ClientInfo
        const res = await loginAPI({
          account: values.account,
          password: values.password,
          client_info: clientInfo
        })
        userInfoStore.updateToken(res.data.token)
        userInfoStore.updateMemberId(res.data.data.memberId!)
        userInfoStore.updateUuid(res.data.data.uuid!)
        setLoading(false)
        setIsOpenLoginFormDialog(false)
      } catch (error) {
        setLoading(false)
        toast({
          title: '错误',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          description: ((error as AxiosError).response?.data as any).message as string
        })
      }
    },
    [setIsOpenLoginFormDialog, toast, userInfoStore]
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="account"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder={type === 'email' ? '请输入邮箱' : '请输入手机号'}
                  {...field}
                  className="border-none h-12 bg-[#EEEEEE] text-base placeholder:text-[#BBBBBB] placeholder:text-base rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Spacer height={8} />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="请输入密码"
                  {...field}
                  className="border-none h-12 bg-[#EEEEEE] text-base placeholder:text-[#BBBBBB] placeholder:text-base rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Spacer height={20} />
        <div className="flex items-center justify-between">
          <div className="flex items-center cursor-pointer">
            <Checkbox
              id="rememberPassword"
              className={clsx('rounded-full', rememberPassword ? 'bg-[#42FBF5]' : 'bg-white')}
              checked={rememberPassword}
              onClick={() => setRememberPassword(!rememberPassword)}
            />
            <Spacer width={8} />
            <label htmlFor="rememberPassword" className="text-[#999999] text-base font-medium">
              记住密码
            </label>
          </div>
          <div
            className="text-base text-[#0B1327] hover:text-[#6f7686] font-medium cursor-pointer"
            onClick={() => setIsOpenResetPasswordDialog(true)}
          >
            忘记密码？
          </div>
        </div>
        <Spacer height={20} />
        <Button
          type="submit"
          className="w-full h-11 text-base text-black bg-[#42FBF5] hover:bg-[#25ded8]"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          登录
        </Button>
        <Spacer height={8} />
        <Button
          type="submit"
          className="w-full h-11 text-base text-black bg-white hover:bg-gray-100 border"
        >
          使用 Google 登录
        </Button>
        <Spacer height={8} />
      </form>
      <Toaster />
      <ResetPasswordDialog
        open={isOpenResetPasswordDialog}
        onOpenChange={setIsOpenResetPasswordDialog}
      />
    </Form>
  )
}

function RegisterContent(): JSX.Element {
  const [selection, setSelection] = useState<'email' | 'mobile'>('email')
  return (
    <DialogHeader>
      <DialogTitle>注册</DialogTitle>
      <Spacer height={10} />
      <div className="border-b"></div>
      <Tabs value={selection} onValueChange={(val) => setSelection(val as 'email' | 'mobile')}>
        <TabsList className="p-0 space-x-8">
          <TabsTrigger
            value="email"
            className={clsx(
              'text-base px-0 py-1 shadow-opacity-0 border-b-[3px] border-solid',
              selection === 'email'
                ? 'text-black border-[#42FBF5]'
                : 'text-[#999999] border-transparent'
            )}
          >
            邮箱注册
          </TabsTrigger>
          <TabsTrigger
            value="mobile"
            className={clsx(
              'text-base px-0 py-1 shadow-opacity-0 border-b-[3px] border-solid',
              selection === 'mobile'
                ? 'text-black border-[#42FBF5]'
                : 'text-[#999999] border-transparent'
            )}
          >
            手机号注册
          </TabsTrigger>
        </TabsList>
        <Spacer height={12} />
        <TabsContent value="email">
          <RegisterForm type="email" />
        </TabsContent>
        <TabsContent value="mobile">
          <RegisterForm type="mobile" />
        </TabsContent>
      </Tabs>
    </DialogHeader>
  )
}

interface RegisterFormProps {
  type: 'email' | 'mobile'
}

function RegisterForm(props: RegisterFormProps): JSX.Element {
  const { type } = props

  const { toast } = useToast()
  const userInfoStore = useUserInfoStore()
  const { setIsOpenLoginFormDialog } = useLoginFormVisibility()
  const [captchaId, setCaptchaId] = useState('')
  const [loading, setLoading] = useState(false)

  const formSchema = useMemo(() => {
    return z.object({
      account:
        type === 'email'
          ? z.string().email('请输入正确的邮箱账号')
          : z.string().length(11, '请输入正确的手机号'),
      captcha: z.string().length(5, '请输入正确的验证码'),
      password: z.string().min(1, '请输入密码')
    })
  }, [type])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account: '',
      captcha: '',
      password: ''
    }
  })

  const handleSendCaptcha = useCallback(async (): Promise<boolean> => {
    const result = await form.trigger('account')
    if (!result) return false
    let res: AxiosResponse<SendEmailCaptchaAPIResData | SendCaptchaAPIResData>
    if (type === 'email') {
      res = await sendEmailCaptchaAPI({ email: form.getValues('account') })
    } else {
      res = await sendCaptchaAPI({ mobile: form.getValues('account') })
    }
    if (res.data.errcode !== 0) {
      toast({
        title: '错误',
        description: res.data.errmsg
      })
      return false
    }
    toast({
      title: '成功',
      description: '验证码发送成功'
    })
    setCaptchaId(res.data.result.captchaId)
    return true
  }, [form, toast, type])

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>): Promise<void> => {
      try {
        setLoading(true)
        const clientInfo = (await window.electron.ipcRenderer.invoke('getClientInfo')) as ClientInfo
        const res = await registerAPI({
          account: values.account,
          password: values.password,
          username: Date.now().toString(),
          captcha: values.captcha,
          captcha_id: captchaId,
          client_info: clientInfo
        })
        userInfoStore.updateToken(res.data.token)
        userInfoStore.updateMemberId(res.data.data.memberId!)
        userInfoStore.updateUuid(res.data.data.uuid!)
        setLoading(false)
        setIsOpenLoginFormDialog(false)
      } catch (error) {
        setLoading(false)
        toast({
          title: '错误',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          description: ((error as AxiosError).response?.data as any).message as string
        })
      }
    },
    [captchaId, registerAPI, setIsOpenLoginFormDialog, toast, userInfoStore]
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="account"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder={type === 'email' ? '请输入邮箱账号' : '请输入手机号'}
                  {...field}
                  className="border-none h-12 bg-[#EEEEEE] text-base placeholder:text-[#BBBBBB] placeholder:text-base rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Spacer height={8} />
        <FormField
          control={form.control}
          name="captcha"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center bg-[#EEEEEE] rounded-md">
                  <Input
                    placeholder={type === 'email' ? '请输入邮箱验证码' : '请输入手机验证码'}
                    {...field}
                    className="border-none h-12 text-base bg-transparent placeholder:text-[#BBBBBB] placeholder:text-base"
                  />
                  <Spacer width={20} />
                  <CountdownButton onClick={handleSendCaptcha} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Spacer height={8} />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="请输入新密码"
                  {...field}
                  className="border-none h-12 bg-[#EEEEEE] text-base placeholder:text-[#BBBBBB] placeholder:text-base rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Spacer height={20} />
        <Button
          type="submit"
          className="w-full h-11 text-base text-black bg-[#42FBF5] hover:bg-[#25ded8]"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          注册
        </Button>
        <Spacer height={8} />
      </form>
      <Toaster />
    </Form>
  )
}
