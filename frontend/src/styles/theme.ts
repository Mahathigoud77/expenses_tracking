import { createTheme } from '@mui/material/styles'

export const AppTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4F46E5',
    },
    secondary: {
      main: '#06B6D4',
    },
    background: {
      default: '#F6F7FB',
    },
    error: {
      main: '#EF4444',
    },
    success: {
      main: '#22C55E',
    },
  } as any,
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: [
      'Inter',
      'system-ui',
      '-apple-system',
      'Segoe UI',
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 800,
      letterSpacing: -0.5,
    },
    h6: {
      fontWeight: 700,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 14,
          fontWeight: 700,
        },
      },
    },
  },
})

