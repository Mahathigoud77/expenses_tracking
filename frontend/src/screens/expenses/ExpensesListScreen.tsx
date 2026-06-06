import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { createApiClient } from '../../services/api'

type ExpenseItem = {
  id: number
  amount: number
  category: string
  description?: string
  occurred_at?: string
}

const categoryMeta: Record<string, { emoji: string; color: string; bg: string }> = {
  food:          { emoji: '🍽️', color: '#ef4444', bg: '#fef2f2' },
  transport:     { emoji: '🚗', color: '#f59e0b', bg: '#fffbeb' },
  shopping:      { emoji: '🛍️', color: '#8b5cf6', bg: '#f5f3ff' },
  entertainment: { emoji: '🎬', color: '#4f6ef7', bg: '#eef1fe' },
  health:        { emoji: '💊', color: '#10b981', bg: '#ecfdf5' },
  utilities:     { emoji: '💡', color: '#f97316', bg: '#fff7ed' },
  rent:          { emoji: '🏠', color: '#6366f1', bg: '#eef2ff' },
  others:        { emoji: '📦', color: '#6b7280', bg: '#f3f4f6' },
}

const getCatMeta = (cat: string) =>
  categoryMeta[cat.toLowerCase()] ?? { emoji: '💸', color: '#ef4444', bg: '#fef2f2' }

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --bg: #f5f6fa;
    --surface: #ffffff;
    --border: #e8eaf2;
    --text-primary: #0f1117;
    --text-secondary: #6b7280;
    --text-muted: #9ca3af;
    --accent: #ef4444;
    --accent-dark: #dc2626;
    --accent-light: #fef2f2;
    --red: #ef4444;
    --red-light: #fef2f2;
    --shadow-sm: 0 1px 3px rgba(15,17,23,0.06), 0 1px 2px rgba(15,17,23,0.04);
    --shadow-md: 0 4px 16px rgba(15,17,23,0.08), 0 2px 6px rgba(15,17,23,0.04);
    --radius: 16px;
    --radius-sm: 10px;
    --font: 'Epilogue', sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }

  .el-page {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--font);
    color: var(--text-primary);
    display: flex;
    flex-direction: column;
  }

  /* Nav */
  .el-nav {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 0 2.5rem;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 50;
  }
  .el-nav-brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-weight: 800;
    font-size: 1.1rem;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    text-decoration: none;
  }
  .el-nav-logo {
    width: 32px; height: 32px;
    background: #4f6ef7;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 0.85rem;
  }

  /* Body */
  .el-body {
    max-width: 860px;
    margin: 0 auto;
    padding: 2.5rem 2rem 4rem;
    width: 100%;
    box-sizing: border-box;
  }

  /* Page header */
  .el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.75rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .el-title {
    font-size: 1.7rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
  }
  .el-subtitle {
    font-family: var(--mono);
    font-size: 0.7rem;
    color: var(--text-muted);
    margin-top: 0.3rem;
    letter-spacing: 0.04em;
  }

  /* Add button */
  .btn-add {
    font-family: var(--font);
    font-size: 0.82rem;
    font-weight: 700;
    color: white;
    background: var(--accent);
    border: none;
    border-radius: var(--radius-sm);
    padding: 0.65rem 1.3rem;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    box-shadow: 0 2px 8px rgba(239,68,68,0.35);
    transition: all 0.15s;
    white-space: nowrap;
  }
  .btn-add:hover {
    background: var(--accent-dark);
    box-shadow: 0 4px 14px rgba(239,68,68,0.45);
    transform: translateY(-1px);
  }

  /* Summary strip */
  .el-summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    margin-bottom: 1.5rem;
    box-shadow: var(--shadow-sm);
  }
  @media (max-width: 560px) { .el-summary { grid-template-columns: 1fr; } }

  .summary-cell {
    background: var(--surface);
    padding: 1.25rem 1.5rem;
  }
  .summary-label {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    margin-bottom: 0.4rem;
  }
  .summary-value {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    font-variant-numeric: tabular-nums;
  }
  .summary-value .pfx {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);
    margin-right: 1px;
  }
  .summary-value.red { color: var(--accent); }

  /* List card */
  .el-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }

  .el-card-header {
    padding: 1.25rem 1.6rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .el-card-title {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--text-primary);
  }
  .el-count-pill {
    font-family: var(--mono);
    font-size: 0.65rem;
    background: var(--accent-light);
    color: var(--accent);
    padding: 0.25rem 0.6rem;
    border-radius: 20px;
    font-weight: 500;
  }

  /* Expense rows */
  .el-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.6rem;
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
    cursor: default;
  }
  .el-row:last-child { border-bottom: none; }
  .el-row:hover { background: #fafbff; }

  .el-row-icon {
    width: 42px; height: 42px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .el-row-info { flex: 1; min-width: 0; }
  .el-row-source {
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-row-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.2rem;
    flex-wrap: wrap;
  }
  .el-cat-badge {
    font-family: var(--mono);
    font-size: 0.6rem;
    font-weight: 500;
    padding: 0.2rem 0.5rem;
    border-radius: 20px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .el-row-date {
    font-family: var(--mono);
    font-size: 0.65rem;
    color: var(--text-muted);
    letter-spacing: 0.03em;
  }

  .el-row-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.3rem;
    flex-shrink: 0;
  }
  .el-row-amount {
    font-family: var(--mono);
    font-size: 1rem;
    font-weight: 600;
    color: var(--accent);
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.01em;
  }
  .el-row-actions {
    display: flex;
    gap: 0.4rem;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .el-row:hover .el-row-actions { opacity: 1; }

  .row-btn {
    font-family: var(--font);
    font-size: 0.65rem;
    font-weight: 600;
    padding: 0.25rem 0.6rem;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-secondary);
    cursor: pointer;
    text-decoration: none;
    transition: all 0.15s;
  }
  .row-btn:hover { background: var(--bg); color: var(--text-primary); }
  .row-btn.danger:hover { background: var(--red-light); color: var(--red); border-color: #fca5a5; }

  /* Empty state */
  .el-empty {
    padding: 4rem 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  .el-empty-icon {
    font-size: 2.5rem;
    width: 72px; height: 72px;
    background: var(--accent-light);
    border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 0.25rem;
  }
  .el-empty-title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-primary);
  }
  .el-empty-sub {
    font-size: 0.82rem;
    color: var(--text-muted);
    max-width: 280px;
    line-height: 1.5;
  }
  .el-empty-cta {
    font-family: var(--font);
    font-size: 0.82rem;
    font-weight: 700;
    color: white;
    background: var(--accent);
    border: none;
    border-radius: var(--radius-sm);
    padding: 0.65rem 1.3rem;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    box-shadow: 0 2px 8px rgba(239,68,68,0.3);
    transition: all 0.15s;
    margin-top: 0.5rem;
  }
  .el-empty-cta:hover {
    background: var(--accent-dark);
    transform: translateY(-1px);
  }

  /* Loading */
  @keyframes shimmer {
    from { background-position: -600px 0; }
    to   { background-position: 600px 0; }
  }
  .sk-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.6rem;
    border-bottom: 1px solid var(--border);
  }
  .sk-row:last-child { border-bottom: none; }
  .sk-circle {
    width: 42px; height: 42px;
    border-radius: 10px;
    flex-shrink: 0;
    background: linear-gradient(90deg, #f0f0f5 0%, #e4e4ef 50%, #f0f0f5 100%);
    background-size: 1200px 100%;
    animation: shimmer 1.5s infinite;
  }
  .sk-lines { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
  .sk-line {
    border-radius: 6px;
    background: linear-gradient(90deg, #f0f0f5 0%, #e4e4ef 50%, #f0f0f5 100%);
    background-size: 1200px 100%;
    animation: shimmer 1.5s infinite;
  }

  /* Error */
  .err-box {
    background: var(--red-light);
    border: 1px solid #fca5a5;
    color: var(--red);
    font-size: 0.82rem;
    padding: 1rem 1.25rem;
    border-radius: var(--radius-sm);
    font-weight: 500;
  }

  @media (max-width: 600px) {
    .el-nav { padding: 0 1.25rem; }
    .el-body { padding: 1.5rem 1rem 3rem; }
    .el-row { padding: 0.9rem 1rem; }
    .el-card-header { padding: 1rem; }
  }
`

function fmt(n: number) { return n.toLocaleString('en-IN') }

function formatDate(s?: string) {
  if (!s) return 'Unknown date'
  const d = new Date(s)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function ExpensesListScreen() {
  const { token } = useAuth()
  const [expenses, setExpenses] = useState<ExpenseItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!token) return
      setLoading(true); setError(null)
      try {
        const client = createApiClient(token)
        const res = await client.get<ExpenseItem[]>('/api/v1/expenses')
        setExpenses(res.data)
      } catch (err: any) {
        setError(err?.response?.data?.detail || err?.message || 'Failed to load expense records')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [token])

  const total = expenses.reduce((s, e) => s + e.amount, 0)
  const avg   = expenses.length ? Math.round(total / expenses.length) : 0
  const top   = expenses.length ? Math.max(...expenses.map(e => e.amount)) : 0

  return (
    <>
      <style>{css}</style>
      <div className="el-page">

        <nav className="el-nav">
          <a className="el-nav-brand" href="/">
            <div className="el-nav-logo">₹</div>
            Finly
          </a>
        </nav>

        <div className="el-body">

          {/* Header */}
          <div className="el-header">
            <div>
              <div className="el-title">Expenses</div>
              <div className="el-subtitle">
                {new Date().toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase()} · ALL RECORDS
              </div>
            </div>
            <a className="btn-add" href="/expenses/new">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Add Expense
            </a>
          </div>

          {/* Summary strip */}
          {!loading && expenses.length > 0 && (
            <div className="el-summary">
              <div className="summary-cell">
                <div className="summary-label">Total Spent</div>
                <div className="summary-value red"><span className="pfx">₹</span>{fmt(total)}</div>
              </div>
              <div className="summary-cell">
                <div className="summary-label">Average Entry</div>
                <div className="summary-value"><span className="pfx">₹</span>{fmt(avg)}</div>
              </div>
              <div className="summary-cell">
                <div className="summary-label">Highest Entry</div>
                <div className="summary-value"><span className="pfx">₹</span>{fmt(top)}</div>
              </div>
            </div>
          )}

          {/* List card */}
          <div className="el-card">
            <div className="el-card-header">
              <div className="el-card-title">All Expense Records</div>
              {!loading && <span className="el-count-pill">{expenses.length} entries</span>}
            </div>

            {loading ? (
              [1,2,3,4,5].map(i => (
                <div key={i} className="sk-row">
                  <div className="sk-circle" />
                  <div className="sk-lines">
                    <div className="sk-line" style={{ height: 14, width: '55%' }} />
                    <div className="sk-line" style={{ height: 11, width: '35%' }} />
                  </div>
                  <div className="sk-line" style={{ height: 16, width: 70, borderRadius: 6 }} />
                </div>
              ))
            ) : error ? (
              <div style={{ padding: '1.25rem 1.6rem' }}>
                <div className="err-box">⚠ {error}</div>
              </div>
            ) : expenses.length === 0 ? (
              <div className="el-empty">
                <div className="el-empty-icon">💸</div>
                <div className="el-empty-title">No expense records yet</div>
                <div className="el-empty-sub">Start tracking your spending to get a clear picture of your finances.</div>
                <a className="el-empty-cta" href="/expenses/new">
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Add your first expense
                </a>
              </div>
            ) : (
              expenses.map((exp) => {
                const meta = getCatMeta(exp.category)
                return (
                  <div key={exp.id} className="el-row">
                    <div className="el-row-icon" style={{ background: meta.bg }}>
                      {meta.emoji}
                    </div>
                    <div className="el-row-info">
                      <div className="el-row-source">
                        {exp.description ?? 'Unnamed expense'}
                      </div>
                      <div className="el-row-meta">
                        <span
                          className="el-cat-badge"
                          style={{ background: meta.bg, color: meta.color }}
                        >
                          {exp.category}
                        </span>
                        <span className="el-row-date">{formatDate(exp.occurred_at)}</span>
                      </div>
                    </div>
                    <div className="el-row-right">
                      <div className="el-row-amount">-₹{fmt(exp.amount)}</div>
                      <div className="el-row-actions">
                        <a className="row-btn" href={`/expenses/${exp.id}/edit`}>Edit</a>
                        <button className="row-btn danger">Delete</button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

        </div>
      </div>
    </>
  )
}