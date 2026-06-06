import React, { useEffect, useMemo, useState } from 'react'
import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'
import { Box, Button, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { createApiClient } from '../../services/api'

type ExpenseItem = {
  id: number
  amount: number
  category: string
  description?: string
  occurred_at?: string
}

type IncomeItem = {
  id: number
  amount: number
  category: string
  description?: string
  occurred_at?: string
}

type TransactionRow = {
  id: number
  type: 'Income' | 'Expense'
  amount: number
  category: string
  description?: string
  occurred_at?: string
}

const formatCurrency = (value: number) => `Rs ${value.toLocaleString()}`

export function ReportsDashboardScreen() {
  const { token, loading: authLoading } = useAuth()
  const apiClient = useMemo(() => createApiClient(token ?? undefined), [token])
  const navigate = useNavigate()

  const [expenses, setExpenses] = useState<ExpenseItem[]>([])
  const [incomes, setIncomes] = useState<IncomeItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      if (!token || authLoading) return
      setLoading(true)
      setError(null)

      try {
        const [expenseRes, incomeRes] = await Promise.all([
          apiClient.get<ExpenseItem[]>('/api/v1/expenses'),
          apiClient.get<IncomeItem[]>('/api/v1/incomes'),
        ])

        setExpenses(expenseRes.data)
        setIncomes(incomeRes.data)
      } catch (err: any) {
        setError(err?.response?.data?.detail || err?.message || 'Failed to load report data')
      } finally {
        setLoading(false)
      }
    }

    void loadData()
  }, [apiClient, authLoading, token])

  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0)
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0)
  const remainingBalance = totalIncome - totalExpenses

  const transactions = useMemo<TransactionRow[]>(() => {
    return [
      ...incomes.map((item) => ({
        id: item.id,
        type: 'Income' as const,
        amount: item.amount,
        category: item.category,
        description: item.description,
        occurred_at: item.occurred_at,
      })),
      ...expenses.map((item) => ({
        id: item.id,
        type: 'Expense' as const,
        amount: item.amount,
        category: item.category,
        description: item.description,
        occurred_at: item.occurred_at,
      })),
    ]
      .sort((a, b) => {
        const aDate = a.occurred_at ? new Date(a.occurred_at).getTime() : 0
        const bDate = b.occurred_at ? new Date(b.occurred_at).getTime() : 0
        return bDate - aDate
      })
      .slice(0, 10)
  }, [expenses, incomes])

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      transactions.map((row) => ({
        Type: row.type,
        Category: row.category,
        Description: row.description ?? '',
        Amount: row.amount,
        Date: row.occurred_at ? row.occurred_at.slice(0, 10) : '',
      })),
    )
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report')
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'expense-report.xlsx'
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'letter' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(18)
    doc.text('Expense Report', 40, 40)
    doc.setFontSize(11)
    doc.text('Generated from Smart Expense Tracker', 40, 60)
    doc.text('Currency: INR (Rs)', 40, 76)

    doc.setFontSize(12)
    doc.text(`Total Income: ${formatCurrency(totalIncome)}`, 40, 100)
    doc.text(`Total Expenses: ${formatCurrency(totalExpenses)}`, 40, 118)
    doc.text(`Remaining Balance: ${formatCurrency(remainingBalance)}`, 40, 136)

    const tableTop = 170
    const cellWidth = 130

    const headers = ['Type', 'Category', 'Amount', 'Date']
    headers.forEach((text, index) => {
      doc.text(text, 40 + index * cellWidth, tableTop)
    })

    transactions.forEach((row, rowIndex) => {
      const y = tableTop + 20 + rowIndex * 18
      doc.text(row.type, 40, y)
      doc.text(row.category, 40 + 1 * cellWidth, y)
      doc.text(formatCurrency(row.amount), 40 + 2 * cellWidth, y)
      doc.text(row.occurred_at ? row.occurred_at.slice(0, 10) : 'Unknown', 40 + 3 * cellWidth, y)
    })

    doc.save('expense-report.pdf')
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
        Reports
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        <Card>
          <CardContent>
            <Typography sx={{ fontWeight: 900 }}>Total Income</Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, mt: 1 }}>
              {formatCurrency(totalIncome)}
            </Typography>
            <Typography color="text.secondary">Sum of all income records.</Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography sx={{ fontWeight: 900 }}>Total Expenses</Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, mt: 1 }}>
              {formatCurrency(totalExpenses)}
            </Typography>
            <Typography color="text.secondary">Sum of all expense entries.</Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography sx={{ fontWeight: 900 }}>Remaining Balance</Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, mt: 1 }}>
              {formatCurrency(remainingBalance)}
            </Typography>
            <Typography color="text.secondary">Income minus expenses.</Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        <Button variant="contained" onClick={() => navigate('/expenses/new')}>
          Add Expense
        </Button>
        <Button variant="outlined" onClick={() => navigate('/income/new')}>
          Add Income
        </Button>
        <Button variant="outlined" onClick={exportPdf} disabled={transactions.length === 0}>
          Export PDF
        </Button>
        <Button variant="outlined" onClick={exportExcel} disabled={transactions.length === 0}>
          Export Excel
        </Button>
      </Box>

      {error ? (
        <Typography color="error.main" sx={{ mt: 2 }}>
          {error}
        </Typography>
      ) : null}

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
            Recent Transactions
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : transactions.length === 0 ? (
            <Typography color="text.secondary">No transactions yet. Add an expense or income to see your report.</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((row) => (
                    <TableRow key={`${row.type}-${row.id}`}>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{row.description ?? '—'}</TableCell>
                      <TableCell>{formatCurrency(row.amount)}</TableCell>
                      <TableCell>{row.occurred_at ? row.occurred_at.slice(0, 10) : 'Unknown'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

