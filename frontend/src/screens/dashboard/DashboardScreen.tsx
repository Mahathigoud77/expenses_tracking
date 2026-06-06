import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { createApiClient } from '../../services/api'

type DashboardSummaryResponse = {
  month: string
  total_income: number
  total_expenses: number
  remaining_balance: number
  monthly_budget: number | null
  spent_pct: number | null
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --white: #ffffff;
    --bg: #f5f6fa;
    --surface: #ffffff;
    --surface2: #f0f2f8;
    --border: #e8eaf2;
    --text-primary: #0f1117;
    --text-secondary: #6b7280;
    --text-muted: #9ca3af;
    --accent: #4f6ef7;
    --accent-light: #eef1fe;
    --accent-hover: #3d5ce5;
    --green: #10b981;
    --green-light: #ecfdf5;
    --red: #ef4444;
    --red-light: #fef2f2;
    --amber: #f59e0b;
    --amber-light: #fffbeb;
    --shadow-sm: 0 1px 3px rgba(15,17,23,0.06), 0 1px 2px rgba(15,17,23,0.04);
    --shadow-md: 0 4px 16px rgba(15,17,23,0.08), 0 2px 6px rgba(15,17,23,0.04);
    --shadow-lg: 0 12px 40px rgba(15,17,23,0.1), 0 4px 12px rgba(15,17,23,0.06);
    --radius: 16px;
    --radius-sm: 10px;
    --font: 'Epilogue', sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }

  .d-wrap {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--font);
    color: var(--text-primary);
    padding: 0;
  }

  /* ── Top nav bar ── */
  .d-nav {
    background: var(--white);
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

  .d-nav-brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-weight: 800;
    font-size: 1.1rem;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  .d-nav-logo {
    width: 32px;
    height: 32px;
    background: var(--accent);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.85rem;
  }

  .d-nav-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .d-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4f6ef7 0%, #8b5cf6 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
  }

  /* ── Body ── */
  .d-body {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2.5rem 2.5rem 4rem;
  }

  /* ── Page header ── */
  .d-page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .d-page-title {
    font-size: 1.7rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    line-height: 1.1;
  }

  .d-page-subtitle {
    font-family: var(--mono);
    font-size: 0.72rem;
    color: var(--text-muted);
    margin-top: 0.3rem;
    letter-spacing: 0.04em;
  }

  .d-actions {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  /* ── Buttons ── */
  .btn {
    font-family: var(--font);
    font-size: 0.82rem;
    font-weight: 600;
    padding: 0.6rem 1.2rem;
    border-radius: var(--radius-sm);
    border: none;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    transition: all 0.15s ease;
    white-space: nowrap;
  }

  .btn-primary {
    background: var(--accent);
    color: white;
    box-shadow: 0 2px 8px rgba(79,110,247,0.35);
  }

  .btn-primary:hover {
    background: var(--accent-hover);
    box-shadow: 0 4px 14px rgba(79,110,247,0.45);
    transform: translateY(-1px);
  }

  .btn-secondary {
    background: var(--surface);
    color: var(--text-primary);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }

  .btn-secondary:hover {
    background: var(--surface2);
    border-color: #d1d5db;
    transform: translateY(-1px);
  }

  /* ── Stat cards ── */
  .stat-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
    margin-bottom: 1.75rem;
  }

  @media (max-width: 1024px) { .stat-row { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px)  { .stat-row { grid-template-columns: 1fr; } }

  .stat-card {
    background: var(--surface);
    border-radius: var(--radius);
    padding: 1.5rem 1.5rem 1.4rem;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border);
    position: relative;
    overflow: hidden;
    transition: box-shadow 0.2s, transform 0.2s;
  }

  .stat-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  .stat-icon-bg {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
  }

  .stat-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 0.6rem;
  }

  .stat-value {
    font-size: 1.9rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1;
    color: var(--text-primary);
    font-variant-numeric: tabular-nums;
  }

  .stat-prefix {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-muted);
    margin-right: 1px;
    vertical-align: baseline;
    line-height: 1;
  }

  .stat-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    font-family: var(--mono);
    font-size: 0.68rem;
    font-weight: 500;
    padding: 0.25rem 0.55rem;
    border-radius: 20px;
    margin-top: 0.7rem;
  }

  .badge-green { background: var(--green-light); color: var(--green); }
  .badge-red   { background: var(--red-light);   color: var(--red); }
  .badge-muted { background: var(--surface2);     color: var(--text-muted); }
  .badge-amber { background: var(--amber-light);  color: var(--amber); }

  /* budget bar */
  .bbar-wrap { margin-top: 0.85rem; }
  .bbar-meta {
    display: flex;
    justify-content: space-between;
    font-family: var(--mono);
    font-size: 0.65rem;
    color: var(--text-muted);
    margin-bottom: 0.4rem;
  }
  .bbar-track {
    height: 6px;
    background: var(--surface2);
    border-radius: 99px;
    overflow: hidden;
  }
  .bbar-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 1.2s cubic-bezier(.4,0,.2,1);
  }
  .bbar-fill.safe   { background: linear-gradient(90deg, #10b981, #34d399); }
  .bbar-fill.warn   { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
  .bbar-fill.danger { background: linear-gradient(90deg, #ef4444, #f87171); }

  /* ── Content grid ── */
  .content-grid {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 1.25rem;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 1024px) { .content-grid { grid-template-columns: 1fr; } }

  /* ── Card ── */
  .card {
    background: var(--surface);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }

  .card-header {
    padding: 1.4rem 1.6rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
  }

  .card-title {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }

  .card-pill {
    font-family: var(--mono);
    font-size: 0.62rem;
    background: var(--accent-light);
    color: var(--accent);
    padding: 0.3rem 0.7rem;
    border-radius: 20px;
    font-weight: 500;
    letter-spacing: 0.04em;
  }

  /* ── Bar chart ── */
  .chart-wrap { padding: 0 1.6rem 1.4rem; }

  .bars-area {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    height: 180px;
    padding: 0 0 2px;
    border-bottom: 1px solid var(--border);
  }

  .bar-group {
    flex: 1;
    display: flex;
    gap: 3px;
    align-items: flex-end;
    position: relative;
  }

  .bar-group:hover .bar { opacity: 0.75; }
  .bar-group:hover .bar:hover { opacity: 1; }

  .bar {
    flex: 1;
    border-radius: 4px 4px 0 0;
    transition: opacity 0.15s, transform 0.15s;
    cursor: pointer;
    position: relative;
  }

  .bar.b-income  { background: linear-gradient(180deg, #4f6ef7 0%, #7c93fb 100%); }
  .bar.b-expense { background: linear-gradient(180deg, #e2e8ff 0%, #c7d3ff 100%); }

  .bars-labels {
    display: flex;
    gap: 8px;
    padding: 0.5rem 0 0;
  }
  .bar-label {
    flex: 1;
    font-family: var(--mono);
    font-size: 0.6rem;
    color: var(--text-muted);
    text-align: center;
    letter-spacing: 0.05em;
  }

  .chart-legend {
    display: flex;
    gap: 1.2rem;
    margin-top: 1rem;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.72rem;
    color: var(--text-secondary);
    font-weight: 500;
  }
  .legend-swatch {
    width: 10px;
    height: 10px;
    border-radius: 3px;
  }

  /* ── Transactions ── */
  .tx-list { padding: 0 1.6rem 1.4rem; }

  .tx-row {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding: 0.85rem 0;
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
    border-radius: 8px;
    margin: 0 -0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  .tx-row:last-child { border-bottom: none; }
  .tx-row:hover { background: var(--surface2); }

  .tx-icon-wrap {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .tx-info { flex: 1; min-width: 0; }
  .tx-name {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tx-meta {
    font-family: var(--mono);
    font-size: 0.62rem;
    color: var(--text-muted);
    margin-top: 0.15rem;
  }
  .tx-amt {
    font-family: var(--mono);
    font-size: 0.85rem;
    font-weight: 500;
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
  }
  .tx-amt.plus { color: var(--green); }
  .tx-amt.minus { color: var(--text-secondary); }

  /* ── Category grid ── */
  .cat-section { padding: 0 1.6rem 1.6rem; }
  .cat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  @media (max-width: 700px) { .cat-grid { grid-template-columns: repeat(2, 1fr); } }

  .cat-tile {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 1.1rem 1rem;
    transition: box-shadow 0.2s, transform 0.2s;
    cursor: default;
  }
  .cat-tile:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  .cat-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }
  .cat-emoji { font-size: 1.3rem; }
  .cat-pct-pill {
    font-family: var(--mono);
    font-size: 0.62rem;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text-muted);
    padding: 0.2rem 0.45rem;
    border-radius: 20px;
  }
  .cat-name {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--text-muted);
    margin-bottom: 0.3rem;
  }
  .cat-val {
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }
  .cat-bar-track {
    height: 3px;
    background: var(--border);
    border-radius: 99px;
    margin-top: 0.75rem;
    overflow: hidden;
  }
  .cat-bar-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 1.4s cubic-bezier(.4,0,.2,1);
  }

  /* Shimmer */
  @keyframes shimmer {
    from { background-position: -600px 0; }
    to   { background-position: 600px 0; }
  }
  .sk {
    display: inline-block;
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
    padding: 0.9rem 1.25rem;
    border-radius: var(--radius-sm);
    margin-bottom: 1.5rem;
    font-weight: 500;
  }

  /* Warning */
  .warn-box {
    background: var(--amber-light);
    border: 1px solid #fcd34d;
    color: var(--amber);
    font-size: 0.82rem;
    padding: 1rem 1.25rem;
    border-radius: var(--radius-sm);
    margin-bottom: 1.5rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .warn-box-icon {
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  .warn-box-content {
    flex: 1;
  }

  .warn-box-title {
    font-weight: 600;
    margin-bottom: 0.2rem;
  }

  .warn-box-message {
    font-size: 0.75rem;
    opacity: 0.9;
  }

  /* Responsive nav */
  @media (max-width: 700px) {
    .d-nav { padding: 0 1.25rem; }
    .d-body { padding: 1.5rem 1.25rem 3rem; }
    .d-page-header { flex-direction: column; align-items: flex-start; }
  }
`

const chartData = [
  { m: 'Jan', inc: 62, exp: 41 },
  { m: 'Feb', inc: 78, exp: 56 },
  { m: 'Mar', inc: 55, exp: 72 },
  { m: 'Apr', inc: 83, exp: 48 },
  { m: 'May', inc: 91, exp: 67 },
  { m: 'Jun', inc: 74, exp: 60 },
]

const recentTx = [
  { icon: '🛒', bg: '#fef9ec', name: 'Supermart Grocery',  meta: 'Today · Food',          amt: -1840, plus: false },
  { icon: '💼', bg: '#ecfdf5', name: 'Freelance Payment',  meta: 'Yesterday · Income',    amt: +42000, plus: true  },
  { icon: '⚡', bg: '#eff6ff', name: 'Electricity Bill',   meta: 'Jun 4 · Utilities',     amt: -2200, plus: false },
  { icon: '🚗', bg: '#fdf4ff', name: 'Uber Rides',         meta: 'Jun 3 · Transport',     amt: -680,  plus: false },
  { icon: '🍕', bg: '#fff7ed', name: 'Swiggy Order',       meta: 'Jun 3 · Food',          amt: -540,  plus: false },
]

const categories = [
  { emoji: '🏠', name: 'Housing',   amt: 12000, pct: 40, color: '#4f6ef7' },
  { emoji: '🛍️', name: 'Shopping', amt: 8400,  pct: 28, color: '#10b981' },
  { emoji: '🍽️', name: 'Food',     amt: 5200,  pct: 17, color: '#f59e0b' },
  { emoji: '🚗', name: 'Transport', amt: 2800,  pct: 9,  color: '#ef4444' },
  { emoji: '💊', name: 'Health',    amt: 1500,  pct: 5,  color: '#8b5cf6' },
  { emoji: '🎮', name: 'Leisure',   amt: 900,   pct: 3,  color: '#ec4899' },
]

export function DashboardScreen() {
  const { token, loading: authLoading, user } = useAuth()
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null)
  const [error, setError]     = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const apiClient = useMemo(() => createApiClient(token ?? undefined), [token])

  useEffect(() => {
    const load = async () => {
      if (!token || authLoading) return
      setLoading(true); setError(null)
      try {
        const res = await apiClient.get<DashboardSummaryResponse>('/api/v1/dashboard/summary')
        setSummary(res.data)
      } catch (e: any) {
        setError(e?.response?.data?.detail || e?.message || 'Failed to load summary')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [apiClient, token, authLoading])

  const totalIncome    = summary?.total_income     ?? 0
  const totalExpenses  = summary?.total_expenses   ?? 0
  const remaining      = summary?.remaining_balance ?? 0
  const monthlyBudget  = summary?.monthly_budget   ?? 0
  const spentPct       = summary?.spent_pct != null ? Math.max(0, Math.min(100, Math.round(summary.spent_pct))) : 0
  const barClass       = spentPct > 80 ? 'danger' : spentPct > 55 ? 'warn' : 'safe'
  const budgetExceedsIncome = monthlyBudget > 0 && monthlyBudget > totalIncome
  const budgetExcessAmount = monthlyBudget - totalIncome

  const fmt  = (n: number) => n.toLocaleString('en-IN')
  const initials = (user?.full_name ?? user?.email ?? 'U').slice(0, 2).toUpperCase()
  const firstName = user?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'there'
  const monthLabel = summary?.month ?? new Date().toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <>
      <style>{css}</style>
      <div className="d-wrap">

        {/* Navbar */}
        <nav className="d-nav">
          <div className="d-nav-brand">
            <div className="d-nav-logo">₹</div>
            Finly
          </div>
          <div className="d-nav-right">
            <div className="d-avatar" title={user?.full_name ?? user?.email}>{initials}</div>
          </div>
        </nav>

        <div className="d-body">

          {/* Page header */}
          <div className="d-page-header">
            <div>
              <div className="d-page-title">Good morning, {firstName} 👋</div>
              <div className="d-page-subtitle">{monthLabel} · Financial Overview</div>
            </div>
            <div className="d-actions">
              <a className="btn btn-primary" href="/expenses/new">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                Add Expense
              </a>
              <a className="btn btn-secondary" href="/income/new">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                Add Income
              </a>
              <a className="btn btn-secondary" href="/reports">Reports →</a>
            </div>
          </div>

          {error && <div className="err-box">⚠ {error}</div>}

          {budgetExceedsIncome && (
            <div className="warn-box">
              <div className="warn-box-icon">⚠️</div>
              <div className="warn-box-content">
                <div className="warn-box-title">Budget Exceeds Income</div>
                <div className="warn-box-message">
                  Your monthly budget (₹{fmt(monthlyBudget)}) is ₹{fmt(budgetExcessAmount)} more than your income (₹{fmt(totalIncome)}). Consider adjusting your budget to match your income.
                </div>
              </div>
            </div>
          )}

          {/* Stat cards */}
          <div className="stat-row">

            {/* Income */}
            <div className="stat-card">
              <div className="stat-icon-bg" style={{ background: '#eef1fe' }}>💰</div>
              <div className="stat-label">Total Income</div>
              {loading && !summary
                ? <span className="sk" style={{ width: '75%', height: '2rem', display: 'block', borderRadius: 8 }} />
                : <div className="stat-value"><span className="stat-prefix">₹</span>{fmt(totalIncome)}</div>
              }
              <div className="stat-badge badge-green">↑ This month</div>
            </div>

            {/* Expenses */}
            <div className="stat-card">
              <div className="stat-icon-bg" style={{ background: '#fef2f2' }}>📉</div>
              <div className="stat-label">Total Expenses</div>
              {loading && !summary
                ? <span className="sk" style={{ width: '75%', height: '2rem', display: 'block', borderRadius: 8 }} />
                : <div className="stat-value"><span className="stat-prefix">₹</span>{fmt(totalExpenses)}</div>
              }
              <div className="stat-badge badge-red">↑ vs last month</div>
            </div>

            {/* Remaining */}
            <div className="stat-card">
              <div className="stat-icon-bg" style={{ background: '#ecfdf5' }}>🏦</div>
              <div className="stat-label">Remaining Balance</div>
              {loading && !summary
                ? <span className="sk" style={{ width: '75%', height: '2rem', display: 'block', borderRadius: 8 }} />
                : <div className="stat-value"><span className="stat-prefix">₹</span>{fmt(remaining)}</div>
              }
              <div className="stat-badge badge-muted">Available</div>
            </div>

            {/* Budget */}
            <div className="stat-card">
              <div className="stat-icon-bg" style={{ background: '#fffbeb' }}>🎯</div>
              <div className="stat-label">Monthly Budget</div>
              {loading && !summary
                ? <span className="sk" style={{ width: '75%', height: '2rem', display: 'block', borderRadius: 8 }} />
                : <div className="stat-value"><span className="stat-prefix">₹</span>{fmt(monthlyBudget)}</div>
              }
              <div className="bbar-wrap">
                <div className="bbar-meta">
                  <span>{summary?.spent_pct == null ? 'No budget set' : `${spentPct}% used`}</span>
                  {summary?.spent_pct != null && <span>{100 - spentPct}% left</span>}
                </div>
                <div className="bbar-track">
                  <div className={`bbar-fill ${barClass}`} style={{ width: `${spentPct}%` }} />
                </div>
              </div>
            </div>

          </div>

          {/* Main grid */}
          <div className="content-grid">

            {/* Analytics */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Monthly Analytics</div>
                <span className="card-pill">6 months</span>
              </div>
              <div className="chart-wrap">
                <div className="bars-area">
                  {chartData.map((d, i) => (
                    <div key={i} className="bar-group">
                      <div className="bar b-income"  style={{ height: `${d.inc}%` }} title={`Income`} />
                      <div className="bar b-expense" style={{ height: `${d.exp}%` }} title={`Expenses`} />
                    </div>
                  ))}
                </div>
                <div className="bars-labels">
                  {chartData.map((d, i) => <div key={i} className="bar-label">{d.m}</div>)}
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-swatch" style={{ background: '#4f6ef7' }} />
                    Income
                  </div>
                  <div className="legend-item">
                    <div className="legend-swatch" style={{ background: '#c7d3ff' }} />
                    Expenses
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Recent Transactions</div>
                <span className="card-pill">Last 5</span>
              </div>
              <div className="tx-list">
                {recentTx.map((tx, i) => (
                  <div key={i} className="tx-row">
                    <div className="tx-icon-wrap" style={{ background: tx.bg }}>{tx.icon}</div>
                    <div className="tx-info">
                      <div className="tx-name">{tx.name}</div>
                      <div className="tx-meta">{tx.meta}</div>
                    </div>
                    <div className={`tx-amt ${tx.plus ? 'plus' : 'minus'}`}>
                      {tx.plus ? '+' : ''}₹{Math.abs(tx.amt).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Category breakdown */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Expense Categories</div>
              <span className="card-pill">This month</span>
            </div>
            <div className="cat-section">
              <div className="cat-grid">
                {categories.map((c, i) => (
                  <div key={i} className="cat-tile">
                    <div className="cat-top">
                      <span className="cat-emoji">{c.emoji}</span>
                      <span className="cat-pct-pill">{c.pct}%</span>
                    </div>
                    <div className="cat-name">{c.name}</div>
                    <div className="cat-val">₹{c.amt.toLocaleString('en-IN')}</div>
                    <div className="cat-bar-track">
                      <div className="cat-bar-fill" style={{ width: `${c.pct}%`, background: c.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}