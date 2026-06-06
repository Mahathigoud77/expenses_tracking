import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'

import { AppTheme } from './styles/theme'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppLayout } from './navigation/AppLayout'

// Auth screens
import { LoginScreen } from './screens/auth/LoginScreen'
import { RegisterScreen } from './screens/auth/RegisterScreen'
import { ForgotPasswordScreen } from './screens/auth/ForgotPasswordScreen'

// Protected module screens
import { DashboardScreen } from './screens/dashboard/DashboardScreen'
import { ExpensesStackRoot } from './screens/expenses/ExpensesStackRoot'
import { IncomeStackRoot } from './screens/income/IncomeStackRoot'
import { ReportsStackRoot } from './screens/reports/ReportsStackRoot'
import { ProfileScreen } from './screens/profile/ProfileScreen'

function RequireAuth({ children }: { children: React.ReactElement }) {
  const { token, loading } = useAuth()
  if (loading) return null
  if (!token) return <Navigate to="/login" replace />
  return children
}

function RootRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />

      <Route
        path="/"
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardScreen />} />
        <Route path="expenses/*" element={<ExpensesStackRoot />} />
        <Route path="income/*" element={<IncomeStackRoot />} />
        <Route path="reports/*" element={<ReportsStackRoot />} />
        <Route path="profile" element={<ProfileScreen />} />

        {/* Notifications is placed under Dashboard for now; route included for future */}
        <Route path="notifications" element={<DashboardScreen />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider theme={AppTheme}>
      <CssBaseline />
      <AuthProvider>
        <RootRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}

