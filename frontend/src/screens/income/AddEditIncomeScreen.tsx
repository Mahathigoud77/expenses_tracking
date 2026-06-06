import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { createApiClient } from '../../services/api'

type Props = { mode: 'create' | 'edit' }

type FormValues = {
  source: string
  amount: string
  category: string
  date: string
  notes?: string
}

const categories = [
  { value: 'salary',      label: 'Salary',      emoji: '💼' },
  { value: 'freelance',   label: 'Freelance',   emoji: '🧑‍💻' },
  { value: 'investments', label: 'Investments', emoji: '📈' },
  { value: 'rent',        label: 'Rent',        emoji: '🏠' },
  { value: 'others',      label: 'Others',      emoji: '📦' },
]

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --bg: #f5f6fa;
    --surface: #ffffff;
    --border: #e8eaf2;
    --border-focus: #10b981;
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

  .inc-page {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--font);
    color: var(--text-primary);
    display: flex;
    flex-direction: column;
  }

  .inc-nav {
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

  .inc-nav-brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-weight: 800;
    font-size: 1.1rem;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    text-decoration: none;
  }

  .inc-nav-logo {
    width: 32px;
    height: 32px;
    background: #4f6ef7;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.85rem;
  }

  .inc-back {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--text-secondary);
    background: none;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.5rem 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-family: var(--font);
    transition: all 0.15s;
    text-decoration: none;
  }
  .inc-back:hover { background: var(--bg); color: var(--text-primary); }

  .inc-body {
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 3rem 1.5rem 4rem;
  }

  .inc-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-md);
    width: 100%;
    max-width: 520px;
    overflow: hidden;
  }

  .inc-card-top {
    height: 4px;
    background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
  }

  .inc-card-inner { padding: 2.25rem 2.25rem 2rem; }

  .inc-header { margin-bottom: 2rem; }

  .inc-mode-tag {
    font-family: var(--mono);
    font-size: 0.65rem;
    font-weight: 500;
    color: var(--accent);
    background: var(--accent-light);
    padding: 0.3rem 0.7rem;
    border-radius: 20px;
    letter-spacing: 0.06em;
    display: inline-block;
    margin-bottom: 0.75rem;
  }

  .inc-title {
    font-size: 1.6rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    line-height: 1.1;
  }

  .inc-subtitle {
    font-size: 0.82rem;
    color: var(--text-muted);
    margin-top: 0.4rem;
  }

  .inc-form { display: flex; flex-direction: column; gap: 1.25rem; }

  .field-wrap { display: flex; flex-direction: column; gap: 0.4rem; }

  .field-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-secondary);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .field-input {
    font-family: var(--font);
    font-size: 0.92rem;
    font-weight: 500;
    color: var(--text-primary);
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.75rem 1rem;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    width: 100%;
    box-sizing: border-box;
    -webkit-appearance: none;
    resize: none;
  }
  .field-input:focus {
    border-color: var(--border-focus);
    background: var(--surface);
    box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
  }
  .field-input.has-error {
    border-color: var(--red);
    box-shadow: 0 0 0 3px rgba(239,68,68,0.08);
  }
  .field-input::placeholder { color: var(--text-muted); }

  .amount-wrap { position: relative; }
  .amount-prefix {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-family: var(--mono);
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--text-muted);
    pointer-events: none;
  }
  .amount-input {
    padding-left: 2rem !important;
    font-family: var(--mono) !important;
    font-size: 1.05rem !important;
    font-weight: 600 !important;
  }

  /* 5-col category grid */
  .cat-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.6rem;
  }
  @media (max-width: 460px) { .cat-grid { grid-template-columns: repeat(3, 1fr); } }

  .cat-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    padding: 0.75rem 0.4rem;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--bg);
    cursor: pointer;
    transition: all 0.15s;
    font-family: var(--font);
  }
  .cat-option:hover { border-color: #a7f3d0; background: #f0fdf9; }
  .cat-option.selected {
    border-color: var(--accent);
    background: var(--accent-light);
    box-shadow: 0 0 0 3px rgba(16,185,129,0.08);
  }
  .cat-option-emoji { font-size: 1.2rem; }
  .cat-option-label {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .cat-option.selected .cat-option-label { color: var(--accent-dark); }

  .field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  @media (max-width: 420px) { .field-row { grid-template-columns: 1fr; } }

  .field-err {
    font-size: 0.7rem;
    color: var(--red);
    font-weight: 500;
  }

  .err-box {
    background: var(--red-light);
    border: 1px solid #fca5a5;
    color: var(--red);
    font-size: 0.8rem;
    padding: 0.8rem 1rem;
    border-radius: var(--radius-sm);
    font-weight: 500;
  }

  .submit-btn {
    font-family: var(--font);
    font-size: 0.9rem;
    font-weight: 700;
    color: white;
    background: var(--accent);
    border: none;
    border-radius: var(--radius-sm);
    padding: 0.9rem 1.5rem;
    cursor: pointer;
    width: 100%;
    box-shadow: 0 2px 8px rgba(16,185,129,0.35);
    transition: all 0.15s;
    margin-top: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  .submit-btn:hover:not(:disabled) {
    background: var(--accent-dark);
    box-shadow: 0 4px 14px rgba(16,185,129,0.45);
    transform: translateY(-1px);
  }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 600px) {
    .inc-nav { padding: 0 1.25rem; }
    .inc-body { padding: 1.5rem 1rem 3rem; }
    .inc-card-inner { padding: 1.75rem 1.5rem 1.5rem; }
  }
`

export function AddEditIncomeScreen({ mode }: Props) {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, watch, setValue, reset, formState } = useForm<FormValues>({
    defaultValues: { source: '', amount: '', category: 'salary', date: '', notes: '' },
  })

  const selectedCategory = watch('category')

  useEffect(() => {
    if (mode !== 'edit' || !id || !token) return
    const load = async () => {
      try {
        const client = createApiClient(token)
        const res = await client.get(`/api/v1/incomes/${id}`)
        const inc = res.data
        reset({
          source: inc.description ?? '',
          amount: String(inc.amount),
          category: inc.category,
          date: inc.occurred_at ? inc.occurred_at.slice(0, 10) : '',
          notes: inc.notes ?? '',
        })
      } catch (err: any) {
        setError(err?.response?.data?.detail || err?.message || 'Failed to load income')
      }
    }
    void load()
  }, [mode, id, token, reset])

  const onSubmit = async (values: FormValues) => {
    if (!token) return
    setError(null)
    try {
      const client = createApiClient(token)
      const payload = {
        amount: Number(values.amount),
        category: values.category,
        description: values.source,
        occurred_at: values.date || undefined,
        notes: values.notes || undefined,
      }
      if (mode === 'edit' && id) {
        await client.put(`/api/v1/incomes/${id}`, payload)
      } else {
        await client.post('/api/v1/incomes', payload)
      }
      navigate('/income')
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to save income')
    }
  }

  return (
    <>
      <style>{css}</style>
      <div className="inc-page">

        <nav className="inc-nav">
          <a className="inc-nav-brand" href="/">
            <div className="inc-nav-logo">₹</div>
            Finly
          </a>
          <button className="inc-back" onClick={() => navigate(-1)}>← Back</button>
        </nav>

        <div className="inc-body">
          <div className="inc-card">
            <div className="inc-card-top" />
            <div className="inc-card-inner">

              <div className="inc-header">
                <div className="inc-mode-tag">
                  {mode === 'create' ? '+ NEW INCOME' : `EDITING #${id ?? ''}`}
                </div>
                <div className="inc-title">
                  {mode === 'create' ? 'Add Income' : 'Edit Income'}
                </div>
                <div className="inc-subtitle">
                  {mode === 'create'
                    ? 'Log a new income source to keep your finances up to date.'
                    : 'Update the details of this income entry.'}
                </div>
              </div>

              <form className="inc-form" onSubmit={handleSubmit(onSubmit)}>

                {/* Source */}
                <div className="field-wrap">
                  <label className="field-label">Source</label>
                  <input
                    className={`field-input ${formState.errors.source ? 'has-error' : ''}`}
                    placeholder="e.g. Acme Corp salary, Client project…"
                    {...register('source', { required: 'Source is required' })}
                  />
                  {formState.errors.source && (
                    <span className="field-err">⚠ {formState.errors.source.message}</span>
                  )}
                </div>

                {/* Amount + Date */}
                <div className="field-row">
                  <div className="field-wrap">
                    <label className="field-label">Amount</label>
                    <div className="amount-wrap">
                      <span className="amount-prefix">₹</span>
                      <input
                        className={`field-input amount-input ${formState.errors.amount ? 'has-error' : ''}`}
                        placeholder="0.00"
                        inputMode="decimal"
                        {...register('amount', { required: 'Amount is required' })}
                      />
                    </div>
                    {formState.errors.amount && (
                      <span className="field-err">⚠ {formState.errors.amount.message}</span>
                    )}
                  </div>

                  <div className="field-wrap">
                    <label className="field-label">Date</label>
                    <input type="date" className="field-input" {...register('date')} />
                  </div>
                </div>

                {/* Category */}
                <div className="field-wrap">
                  <label className="field-label">Category</label>
                  <div className="cat-grid">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        className={`cat-option ${selectedCategory === cat.value ? 'selected' : ''}`}
                        onClick={() => setValue('category', cat.value)}
                      >
                        <span className="cat-option-emoji">{cat.emoji}</span>
                        <span className="cat-option-label">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                  <input type="hidden" {...register('category')} />
                </div>

                {/* Notes */}
                <div className="field-wrap">
                  <label className="field-label">Notes <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--text-muted)' }}>(optional)</span></label>
                  <textarea
                    className="field-input"
                    rows={3}
                    placeholder="Any additional details…"
                    {...register('notes')}
                  />
                </div>

                {error && <div className="err-box">⚠ {error}</div>}

                <button type="submit" className="submit-btn" disabled={formState.isSubmitting}>
                  {formState.isSubmitting ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                        <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                        <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Saving…
                    </>
                  ) : (
                    <>{mode === 'create' ? '💰 Save Income' : '✓ Update Income'}</>
                  )}
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}