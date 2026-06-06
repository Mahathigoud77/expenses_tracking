import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { IncomeListScreen } from './IncomeListScreen'
import { AddEditIncomeScreen } from './AddEditIncomeScreen'

export function IncomeStackRoot() {
  return (
    <Routes>
      <Route index element={<IncomeListScreen />} />
      <Route path="new" element={<AddEditIncomeScreen mode="create" />} />
      <Route path=":id/edit" element={<AddEditIncomeScreen mode="edit" />} />
      <Route path="*" element={<Navigate to="/income" replace />} />
    </Routes>
  )
}

