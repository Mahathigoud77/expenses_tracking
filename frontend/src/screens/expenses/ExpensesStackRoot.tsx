import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { ExpensesListScreen } from './ExpensesListScreen'
import { AddEditExpenseScreen } from './AddEditExpenseScreen'
import { ExpenseDetailsScreen } from './ExpenseDetailsScreen'

export function ExpensesStackRoot() {
  return (
    <Routes>
      <Route index element={<ExpensesListScreen />} />
      <Route path="new" element={<AddEditExpenseScreen mode="create" />} />
      <Route path=":id/edit" element={<AddEditExpenseScreen mode="edit" />} />
      <Route path=":id" element={<ExpenseDetailsScreen />} />
      <Route path="*" element={<Navigate to="/expenses" replace />} />
    </Routes>
  )
}

