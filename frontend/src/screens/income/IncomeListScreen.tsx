import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { createApiClient } from '../../services/api'

type IncomeItem = {
  id: number
  amount: number
  category: string
  description?: string
  occurred_at?: string
}

const categoryMeta: Record<string, { emoji: string; color: string; bg: string }> = {
  salary:      { emoji: '💼', color: '#10b981', bg: '#ecfdf5' },
  freelance:   { emoji: '🧑‍💻', color: '#4f6ef7', bg: '#eef1fe' },
  investments: { emoji: '📈', color: '#f59e0b', bg: '#fffbeb' },
  rent:        { emoji: '🏠', color: '#8b5cf6', bg: '#f5f3ff' },
  others:      { emoji: '📦', color: '#6b7280', bg: '#f3f4f6' },
}

const getCatMeta = (cat: string) =>
  categoryMeta[cat.toLowerCase()] ?? { emoji: '💰', color: '#10b981', bg: '#ecfdf5' }

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --bg: #f5f6fa;
    --surface: #ffffff;
    --border: #e8eaf2;
    --text-primary: #0f1117;
    --text-secondary: #6b7280;
    --text-muted: #9ca3af;
    --accent: #10b981;
    --accent-dark: #059669;
    --accent-light: #ecfdf5;
    --red: #ef4444;
    --red-light: #fef2f2;
    --shadow-sm: 0 1px 3px rgba(15,17,23,0.06), 0 1px 2px rgba(15,17,23,0.04);
    --shadow-md: 0 4px 16px rgba(15,17,23,0.08), 0 2px 6px rgba(15,17,23,0.04);
    --radius: 16px;
    --radius-sm: 10px;
    --font: 'Epilogue', sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }

  .il-page {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--font);
    color: var(--text-primary);
    display: flex;
    flex-direction: column;
  }

  /* Nav */
  .il-nav {
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
  .il-nav-brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-weight: 800;
    font-size: 1.1rem;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    text-decoration: none;
  }
  .il-nav-logo {
    width: 32px; height: 32px;
    background: #4f6ef7;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 0.85rem;
  }

  /* Body */
  .il-body {
    max-width: 860px;
    margin: 0 auto;
    padding: 2.5rem 2rem 4rem;
    width: 100%;
    box-sizing: border-box;
  }

  /* Page header */
  .il-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.75rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .il-header-left {}
  .il-title {
    font-size: 1.7rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
  }
  .il-subtitle {
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
    box-shadow: 0 2px 8px rgba(16,185,129,0.35);
    transition: all 0.15s;
    white-space: nowrap;
  }
  .btn-add:hover {
    background: var(--accent-dark);
    box-shadow: 0 4px 14px rgba(16,185,129,0.45);
    transform: translateY(-1px);
  }

  /* Summary strip */
  .il-summary {
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
  @media (max-width: 560px) { .il-summary { grid-template-columns: 1fr; } }

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
  .summary-value.green { color: var(--accent); }

  /* List card */
  .il-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }

  .il-card-header {
    padding: 1.25rem 1.6rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .il-card-title {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--text-primary);
  }
  .il-count-pill {
    font-family: var(--mono);
    font-size: 0.65rem;
    background: var(--accent-light);
    color: var(--accent);
    padding: 0.25rem 0.6rem;
    border-radius: 20px;
    font-weight: 500;
  }

  /* Income rows */
  .il-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.6rem;
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
    cursor: default;
  }
  .il-row:last-child { border-bottom: none; }
  .il-row:hover { background: #fafbff; }

  .il-row-icon {
    width: 42px; height: 42px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .il-row-info { flex: 1; min-width: 0; }
  .il-row-source {
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .il-row-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.2rem;
    flex-wrap: wrap;
  }
  .il-cat-badge {
    font-family: var(--mono);
    font-size: 0.6rem;
    font-weight: 500;
    padding: 0.2rem 0.5rem;
    border-radius: 20px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .il-row-date {
    font-family: var(--mono);
    font-size: 0.65rem;
    color: var(--text-muted);
    letter-spacing: 0.03em;
  }

  .il-row-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.3rem;
    flex-shrink: 0;
  }
  .il-row-amount {
    font-family: var(--mono);
    font-size: 1rem;
    font-weight: 600;
    color: var(--accent);
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.01em;
  }
  .il-row-actions {
    display: flex;
    gap: 0.4rem;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .il-row:hover .il-row-actions { opacity: 1; }

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
  .il-empty {
    padding: 4rem 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  .il-empty-icon {
    font-size: 2.5rem;
    width: 72px; height: 72px;
    background: var(--accent-light);
    border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 0.25rem;
  }
  .il-empty-title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-primary);
  }
  .il-empty-sub {
    font-size: 0.82rem;
    color: var(--text-muted);
    max-width: 280px;
    line-height: 1.5;
  }
  .il-empty-cta {
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
    box-shadow: 0 2px 8px rgba(16,185,129,0.3);
    transition: all 0.15s;
    margin-top: 0.5rem;
  }
  .il-empty-cta:hover {
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
    .il-nav { padding: 0 1.25rem; }
    .il-body { padding: 1.5rem 1rem 3rem; }
    .il-row { padding: 0.9rem 1rem; }
    .il-card-header { padding: 1rem; }
  }
`

function fmt(n: number) { return n.toLocaleString('en-IN') }

function formatDate(s?: string) {
  if (!s) return 'Unknown date'
  const d = new Date(s)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function IncomeListScreen() {
  const { token } = useAuth()
  const [incomes, setIncomes] = useState<IncomeItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!token) return
      setLoading(true); setError(null)
      try {
        const client = createApiClient(token)
        const res = await client.get<IncomeItem[]>('/api/v1/incomes')
        setIncomes(res.data)
      } catch (err: any) {
        setError(err?.response?.data?.detail || err?.message || 'Failed to load income records')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [token])

  const total = incomes.reduce((s, i) => s + i.amount, 0)
  const avg   = incomes.length ? Math.round(total / incomes.length) : 0
  const top   = incomes.length ? Math.max(...incomes.map(i => i.amount)) : 0

  return (
    <>
      <style>{css}</style>
      <div className="il-page">

        <nav className="il-nav">
          <a className="il-nav-brand" href="/">
            <div className="il-nav-logo">₹</div>
            Finly
          </a>
        </nav>

        <div className="il-body">

          {/* Header */}
          <div className="il-header">
            <div className="il-header-left">
              <div className="il-title">Income</div>
              <div className="il-subtitle">
                {new Date().toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase()} · ALL RECORDS
              </div>
            </div>
            <a className="btn-add" href="/income/new">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Add Income
            </a>
          </div>

          {/* Summary strip */}
          {!loading && incomes.length > 0 && (
            <div className="il-summary">
              <div className="summary-cell">
                <div className="summary-label">Total Income</div>
                <div className="summary-value green"><span className="pfx">₹</span>{fmt(total)}</div>
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
          <div className="il-card">
            <div className="il-card-header">
              <div className="il-card-title">All Income Records</div>
              {!loading && <span className="il-count-pill">{incomes.length} entries</span>}
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
            ) : incomes.length === 0 ? (
              <div className="il-empty">
                <div className="il-empty-icon">💰</div>
                <div className="il-empty-title">No income records yet</div>
                <div className="il-empty-sub">Start tracking your income sources to get a clear picture of your finances.</div>
                <a className="il-empty-cta" href="/income/new">
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Add your first income
                </a>
              </div>
            ) : (
              incomes.map((inc) => {
                const meta = getCatMeta(inc.category)
                return (
                  <div key={inc.id} className="il-row">
                    <div className="il-row-icon" style={{ background: meta.bg }}>
                      {meta.emoji}
                    </div>
                    <div className="il-row-info">
                      <div className="il-row-source">
                        {inc.description ?? 'Unnamed source'}
                      </div>
                      <div className="il-row-meta">
                        <span
                          className="il-cat-badge"
                          style={{ background: meta.bg, color: meta.color }}
                        >
                          {inc.category}
                        </span>
                        <span className="il-row-date">{formatDate(inc.occurred_at)}</span>
                      </div>
                    </div>
                    <div className="il-row-right">
                      <div className="il-row-amount">+₹{fmt(inc.amount)}</div>
                      <div className="il-row-actions">
                        <a className="row-btn" href={`/income/${inc.id}/edit`}>Edit</a>
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