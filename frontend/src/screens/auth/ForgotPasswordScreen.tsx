import React from 'react'
import { Box, Button, Card, CardContent, TextField, Typography, Link } from '@mui/material'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate, Link as RouterLink } from 'react-router-dom'

type FormValues = { email: string }

const apiBase = 'http://localhost:8000'

export function ForgotPasswordScreen() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState } = useForm<FormValues>({ defaultValues: { email: '' } })
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)

  const onSubmit = async (values: FormValues) => {
    setError(null)
    setSuccess(null)

    try {
      await axios.post(`${apiBase}/api/v1/auth/forgot-password`, values)
      setSuccess('Reset link sent. Check your email.')
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? e?.message ?? 'Failed to send reset link')
    }
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '70vh', alignItems: 'center', justifyContent: 'center', px: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 520 }}>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1.5 }}>
            Reset password
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Enter your email and we’ll send you a reset link.
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              {...register('email', { required: 'Email is required' })}
              error={!!formState.errors.email}
              helperText={formState.errors.email?.message}
            />

            {error && <Typography sx={{ color: 'error.main', fontWeight: 700 }}>{error}</Typography>}
            {success && <Typography sx={{ color: 'success.main', fontWeight: 700 }}>{success}</Typography>}

            <Button type="submit" variant="contained" size="large" disabled={formState.isSubmitting}>
              Send Reset Link
            </Button>

            <Box sx={{ mt: 0.5 }}>
              <Link component={RouterLink} to="/login" underline="hover" sx={{ fontWeight: 700 }}>
                Back to login
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

