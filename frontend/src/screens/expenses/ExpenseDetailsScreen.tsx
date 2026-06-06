import React, { useEffect, useState } from 'react'
import { Box, Card, CardContent, Button, CircularProgress, Typography } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { createApiClient } from '../../services/api'

type ExpenseDetail = {
  id: number
  amount: number
  category: string
  description?: string
  occurred_at?: string
  created_at?: string
  updated_at?: string
}

export function ExpenseDetailsScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [expense, setExpense] = useState<ExpenseDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id || !token) return

    const loadExpense = async () => {
      setLoading(true)
      setError(null)

      try {
        const client = createApiClient(token)
        const res = await client.get<ExpenseDetail>(`/api/v1/expenses/${id}`)
        setExpense(res.data)
      } catch (err: any) {
        setError(err?.response?.data?.detail || err?.message || 'Failed to load expense')
      } finally {
        setLoading(false)
      }
    }

    void loadExpense()
  }, [id, token])

  return (
    <Box>
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error.main">{error}</Typography>
          ) : (
            <>
              <Typography variant="h5" sx={{ fontWeight: 900 }}>
                Expense Details #{id}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                Detailed view of your saved expense entry.
              </Typography>

              <Typography>
                <strong>Amount:</strong> ₹{expense?.amount.toLocaleString()}
              </Typography>
              <Typography>
                <strong>Category:</strong> {expense?.category}
              </Typography>
              <Typography>
                <strong>Description:</strong> {expense?.description ?? 'No description'}
              </Typography>
              <Typography>
                <strong>Date:</strong> {expense?.occurred_at?.slice(0, 10) ?? 'Unknown'}
              </Typography>
              <Typography>
                <strong>Created:</strong> {expense?.created_at?.slice(0, 16).replace('T', ' ') ?? 'Unknown'}
              </Typography>
              <Typography>
                <strong>Updated:</strong> {expense?.updated_at?.slice(0, 16).replace('T', ' ') ?? 'Unknown'}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1.5, mt: 3, flexWrap: 'wrap' }}>
                <Button variant="contained" onClick={() => navigate(`/expenses/${id}/edit`)}>
                  Edit
                </Button>
                <Button variant="outlined" color="error" onClick={() => alert('Delete expense is not implemented yet')}>
                  Delete
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

