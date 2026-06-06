import React from 'react'
import { Box, Button, Card, CardContent, TextField, Typography, Link } from '@mui/material'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

type FormValues = {
  full_name: string
  email: string
  phone_number: string
  password: string
  confirm_password: string
}

const apiBase = 'http://localhost:8000'

const formatError = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.map(item => formatError(item)).join(', ')
  if (value && typeof value === 'object') {
    const errorObj = value as Record<string, unknown>
    if ('detail' in errorObj) return formatError(errorObj.detail)
    if ('message' in errorObj) return formatError(errorObj.message)
    return JSON.stringify(errorObj)
  }
  return 'Registration failed'
}

export function RegisterScreen() {
  const { setAuth } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      full_name: '',
      email: '',
      phone_number: '',
      password: '',
      confirm_password: '',
    },
  })

  const password = watch('password')

  const [error, setError] = React.useState<string | null>(null)

  const onSubmit = async (values: FormValues) => {
    setError(null)
    if (values.password !== values.confirm_password) {
      setError('Passwords do not match')
      return
    }

    try {
      const res = await axios.post<{ access_token: string; user_id: number; email: string; full_name?: string; phone_number?: string; role: string }>(
        `${apiBase}/api/v1/auth/register`,
        {
          email: values.email,
          password: values.password,
          full_name: values.full_name,
          phone_number: values.phone_number,
        },
      )
      setAuth(res.data.access_token, {
        user_id: res.data.user_id,
        email: res.data.email,
        full_name: res.data.full_name ?? null,
        phone_number: res.data.phone_number ?? null,
        role: res.data.role,
      })
      navigate('/')
    } catch (error: any) {
      setError(formatError(error?.response?.data ?? error?.message ?? 'Registration failed'))
    }
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '70vh', alignItems: 'center', justifyContent: 'center', px: 2, background: 'linear-gradient(180deg, #eef2ff 0%, #ffffff 100%)' }}>
      <Card sx={{ width: '100%', maxWidth: 560, boxShadow: 5, overflow: 'hidden' }}>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1.5 }}>
            Create account
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Register to start tracking your finances.
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField
              label="Full Name"
              fullWidth
              {...register('full_name', { required: 'Full name is required' })}
              error={!!errors.full_name}
              helperText={errors.full_name?.message}
            />

            <TextField
              label="Email"
              type="email"
              fullWidth
              {...register('email', { required: 'Email is required' })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              label="Phone Number"
              fullWidth
              {...register('phone_number', { required: 'Phone number is required' })}
              error={!!errors.phone_number}
              helperText={errors.phone_number?.message}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              {...register('confirm_password', { required: 'Confirm your password' })}
              error={!!errors.confirm_password}
              helperText={errors.confirm_password?.message}
            />

            {error && (
              <Typography sx={{ color: 'error.main', fontWeight: 700 }}>
                {error}
              </Typography>
            )}

            <Button type="submit" variant="contained" size="large" disabled={isSubmitting} sx={{ mt: 1.5 }}>
              Register
            </Button>

            <Box sx={{ mt: 0.5 }}>
              <Link component={RouterLink} to="/login" underline="hover" sx={{ fontWeight: 700 }}>
                Already have an account? Login
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

