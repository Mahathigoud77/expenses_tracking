import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Box, BottomNavigation, BottomNavigationAction, Paper, Typography } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import BarChartIcon from '@mui/icons-material/BarChart'
import PersonIcon from '@mui/icons-material/Person'
import { useAuth } from '../context/AuthContext'

type NavItem = {
  label: string
  path: string
  icon: React.ReactNode
}

const items: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Expenses', path: '/expenses', icon: <ReceiptLongIcon /> },
  { label: 'Income', path: '/income', icon: <TrendingUpIcon /> },
  { label: 'Reports', path: '/reports', icon: <BarChartIcon /> },
  { label: 'Profile', path: '/profile', icon: <PersonIcon /> },
]

function getCurrentIndex(pathname: string) {
  if (pathname.startsWith('/expenses')) return 1
  if (pathname.startsWith('/income')) return 2
  if (pathname.startsWith('/reports')) return 3
  if (pathname.startsWith('/profile')) return 4
  return 0
}

export function AppLayout() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const value = getCurrentIndex(location.pathname)

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ px: 2, pt: 3, pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.5 }}>
          Smart Expense Tracker
        </Typography>
        <Typography color="text.secondary">
          Welcome back, {user?.full_name ?? user?.email ?? 'valued user'}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, px: { xs: 1.5, md: 3 }, pb: 9 }}>
        <Outlet />
      </Box>

      <Paper elevation={3} sx={{ position: 'fixed', left: 0, right: 0, bottom: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, newValue) => navigate(items[newValue].path)}
          sx={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
        >
          {items.map((it) => (
            <BottomNavigationAction key={it.path} label={it.label} icon={it.icon} />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  )
}

