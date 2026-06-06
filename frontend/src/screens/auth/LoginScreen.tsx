import React from 'react'
import { Box, Button, Card, CardContent, Divider, Link, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'


type FormValues = {
  email: string
  password: string
}

const formatError = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.map(item => formatError(item)).join(', ')
  if (value && typeof value === 'object') {
    const errorObj = value as Record<string, unknown>
    if ('detail' in errorObj) return formatError(errorObj.detail)
    if ('message' in errorObj) return formatError(errorObj.message)
    return JSON.stringify(errorObj)
  }
  return 'Login failed'
}


const apiBase = 'http://localhost:8000'

export function LoginScreen() {
  const { setAuth } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: { email: '', password: '' } })

  const [show, setShow] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const onSubmit = async (values: FormValues) => {
    setError(null)
    const form = new URLSearchParams()
    form.append('username', values.email)
    form.append('password', values.password)

    try {
      const res = await axios.post<{
        access_token: string
        user_id: number
        email: string
        full_name?: string
        phone_number?: string
        role: string
      }>(`${apiBase}/api/v1/auth/login`, form, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })

      setAuth(res.data.access_token, {
        user_id: res.data.user_id,
        email: res.data.email,
        full_name: res.data.full_name ?? null,
        phone_number: res.data.phone_number ?? null,
        role: res.data.role,
      })
      navigate('/')
    } catch (error: any) {
      setError(formatError(error?.response?.data ?? error?.message ?? 'Login failed'))
    }
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '70vh', alignItems: 'center', justifyContent: 'center', px: 2, background: 'linear-gradient(180deg, #f4f7ff 0%, #ffffff 100%)' }}>
      <Card sx={{ width: '100%', maxWidth: 520, boxShadow: 5, overflow: 'hidden' }}>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1.5 }}>
            Welcome back
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Sign in to track expenses and incomes.
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField
              label="Email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />

            <TextField
              label="Password"
              type={show ? 'text' : 'password'}
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
            />

            {error && (
              <Typography sx={{ color: 'error.main', fontWeight: 700 }}>
                {error}
              </Typography>
            )}

            <Button type="submit" variant="contained" size="large" disabled={isSubmitting} sx={{ mt: 1.5 }}>
              Login
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
              <Link component={RouterLink} to="/forgot-password" underline="hover" sx={{ fontWeight: 700 }}>
                Forgot password?
              </Link>
              <Link component={RouterLink} to="/register" underline="hover" sx={{ fontWeight: 700 }}>
                Register
              </Link>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary">
            Demo-friendly UI scaffold. Wire API fields as needed.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

