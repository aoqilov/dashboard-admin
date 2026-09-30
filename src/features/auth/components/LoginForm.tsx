import { useState, type FormEvent } from 'react'
import { isAxiosError } from 'axios'
import { User } from 'lucide-react'
import { getErrorMessage } from '@/api/api-config/apiError'
import { CusAlert } from '@/components/ui/alert/CusAlert'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusInput } from '@/components/ui/inputs/CusInput'
import { CusPasswordInput } from '@/components/ui/inputs/CusPasswordInput'
import { toaster } from '@/components/ui/toaster/toaster'
import { navigate } from '@/utils/navigate'
import { useLogin } from '../api-hooks/useLogin'

function validate(login: string, password: string) {
  return {
    login: login.trim() ? undefined : 'Loginni kiriting',
    password: password ? undefined : 'Parolni kiriting',
  }
}

/** 400/401 — login yoki parol xato; qolganlari — server xabari */
function getLoginErrorMessage(error: unknown) {
  const status = isAxiosError(error) ? error.response?.status : undefined
  if (status === 400 || status === 401) return "Login yoki parol noto'g'ri"
  return getErrorMessage(error)
}

export function LoginForm() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const loginMutation = useLogin()

  // Maydon xatolari faqat birinchi "Kirish" bosilgandan keyin ko'rsatiladi
  const errors: Partial<ReturnType<typeof validate>> = submitted ? validate(login, password) : {}

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    const result = validate(login, password)
    if (result.login || result.password) return

    loginMutation.mutate(
      { login: login.trim(), password },
      {
        onSuccess: () => {
          toaster.create({ title: 'Xush kelibsiz!', type: 'success' })
          navigate('/')
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {loginMutation.isError && (
        <CusAlert status="error" variant="subtle" title={getLoginErrorMessage(loginMutation.error)} />
      )}

      <CusInput
        label="Login"
        placeholder="Loginingizni kiriting"
        autoComplete="username"
        autoFocus
        leftIcon={<User />}
        value={login}
        onChange={(event) => setLogin(event.target.value)}
        error={errors.login}
      />

      <CusPasswordInput
        label="Parol"
        placeholder="Parolingizni kiriting"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        errorText={errors.password}
      />

      <CusButton type="submit" size="lg" fullWidth isLoading={loginMutation.isPending}>
        Kirish
      </CusButton>
    </form>
  )
}
