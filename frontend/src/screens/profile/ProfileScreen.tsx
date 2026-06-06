import React, { useState } from 'react'
import { Avatar, Box, Button, Card, CardContent, Divider, TextField, Typography, CircularProgress } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import { useAuth } from '../../context/AuthContext'
import { createApiClient } from '../../services/api'

export function ProfileScreen() {
  const { user, logout, setAuth, token } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: user?.full_name ?? '',
    phone_number: user?.phone_number ?? '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const api = createApiClient(token ?? undefined)
      const response = await api.put('/auth/me', {
        full_name: formData.full_name,
        phone_number: formData.phone_number,
      })

      // Update auth context with new user data
      if (user && token) {
        setAuth(token, {
          ...user,
          full_name: response.data.full_name,
          phone_number: response.data.phone_number,
        })
      }

      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name ?? '',
      phone_number: user?.phone_number ?? '',
    })
    setIsEditing(false)
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
        Profile
      </Typography>

      <Card sx={{ maxWidth: 780 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main' }}>
              <PersonIcon sx={{ fontSize: 36 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900 }}>
                {user?.full_name || user?.email || 'Your profile'}
              </Typography>
              <Typography color="text.secondary">Manage your account details and security settings.</Typography>
            </Box>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>User Information</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 3 }}>
            <TextField
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              disabled={!isEditing}
              fullWidth
            />
            <TextField label="Email" value={user?.email ?? ''} disabled fullWidth />
            <TextField
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              disabled={!isEditing}
              fullWidth
            />
            <TextField label="Role" value={user?.role ?? ''} disabled fullWidth />
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>Account Actions</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {!isEditing ? (
              <>
                <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
                <Button variant="contained" color="error" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

