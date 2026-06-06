import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ReportsDashboardScreen } from './ReportsDashboardScreen'

export function ReportsStackRoot() {
  return (
    <Routes>
      <Route index element={<ReportsDashboardScreen />} />
      <Route path="*" element={<Navigate to="/reports" replace />} />
    </Routes>
  )
}

