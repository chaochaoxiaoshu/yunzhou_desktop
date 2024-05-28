import { useState, useMemo, useCallback } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { Dialog, DialogHeader, DialogTitle, DialogContent } from './ui/dialog'
import Spacer from './spacer'
import { Tabs, TabsList, TabsContent, TabsTrigger } from './ui/tabs'
import { Button } from './ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { useToast } from './ui/use-toast'
import { useUserInfoStore } from '@renderer/store/user-info'
import { SendEmailCaptchaAPIResData, sendEmailCaptchaAPI } from '@renderer/api/sendEmailCaptcha'
import { SendCaptchaAPIResData, sendCaptchaAPI } from '@renderer/api/sendCaptcha'
import { AxiosResponse, AxiosError } from 'axios'
import { resetPasswordAPI } from '@renderer/api/resetPassword'
import CountdownButton from './countdown-button'

interface ResetPasswordDialogProps {
  open: boolean
  onOpenChange: (val: boolean) => void
}

export default function ResetPasswordDialog(props: ResetPasswordDialogProps): JSX.Element {
  const [selection, setSelection] = useState<'email' | 'mobile'>('email')
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="w-96 bg-white border-none">
        <DialogHeader>
          <DialogTitle>重设密码</DialogTitle>
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
                邮箱账号
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
                手机号
              </TabsTrigger>
            </TabsList>
            <Spacer height={12} />
            <TabsContent value="email">
              <ResetPasswordForm type="email" onClose={() => props.onOpenChange(false)} />
            </TabsContent>
            <TabsContent value="mobile">
              <ResetPasswordForm type="mobile" onClose={() => props.onOpenChange(false)} />
            </TabsContent>
          </Tabs>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

interface ResetPasswordFormProps {
  type: 'email' | 'mobile'
  onClose: () => void
}

function ResetPasswordForm(props: ResetPasswordFormProps): JSX.Element {
  const { type } = props

  const { toast } = useToast()
  const userInfoStore = useUserInfoStore()

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
    return true
  }, [form, toast, type])

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>): Promise<void> => {
      try {
        await resetPasswordAPI({
          mobile: values.account,
          newPassword: values.password,
          code: values.captcha
        })
        props.onClose()
      } catch (error) {
        toast({
          title: '错误',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          description: ((error as AxiosError).response?.data as any).message as string
        })
      }
    },
    [resetPasswordAPI, toast, userInfoStore]
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
        >
          确认
        </Button>
        <Spacer height={8} />
      </form>
    </Form>
  )
}
