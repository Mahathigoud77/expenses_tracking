# Smart Expense Tracker - Complete Project Documentation

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Project Architecture](#project-architecture)
4. [Technology Stack](#technology-stack)
5. [Project Structure](#project-structure)
6. [How It Works](#how-it-works)
7. [User Workflows](#user-workflows)
8. [API Endpoints](#api-endpoints)
9. [Database Schema](#database-schema)
10. [Frontend Components](#frontend-components)

---

## Project Overview

**Smart Expense Tracker** is a full-stack web application designed to help users manage their personal finances efficiently. It allows users to track daily expenses and incomes, categorize spending, generate reports, and export data in multiple formats (PDF and Excel).

### Purpose
The application provides a simple yet powerful way to:
- Record daily financial transactions (expenses and income)
- Categorize expenses for better financial insight
- Monitor spending trends and balances
- Generate comprehensive financial reports
- Export financial data for further analysis

### Target Users
- Personal finance enthusiasts
- Budget-conscious individuals
- Anyone wanting to track their daily spending patterns

---

## Key Features

### 1. **Authentication & User Management**
- User registration with email and password
- Secure login with JWT (JSON Web Tokens)
- Password hashing with industry-standard algorithms
- User profile management with name and phone number storage
- Secure logout functionality

### 2. **Expense Management**
- Create new expense entries with:
  - Amount
  - Category (Food, Transport, Bills, Shopping, Health, Others)
  - Description
  - Date
- View all expenses in a list
- Click on any expense to view full details
- Edit existing expense entries
- Expenses are tied to authenticated users

### 3. **Income Management**
- Create income entries with similar fields as expenses
- Track different income sources
- View all income records
- Edit income entries

### 4. **Dashboard**
- Summary of current month's:
  - Total income
  - Total expenses
  - Remaining balance
  - Monthly budget tracking
- Quick action buttons to add new transactions
- Personalized greeting showing user's name

### 5. **Reports & Analytics**
- View all transactions (income + expenses) in one place
- Summary cards showing:
  - Total income
  - Total expenses
  - Remaining balance
- Recent transactions table (last 10 transactions)
- **Export to PDF**: Download financial report as PDF
- **Export to Excel**: Download transaction data as XLSX file

### 6. **User Profile**
- View current user information:
  - Full name
  - Email address
  - Phone number
  - Role
- Logout functionality

---

## Project Architecture

### Two-Tier Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React + TypeScript)         │
│  - User Interface (Material-UI)                          │
│  - State Management (React Context)                      │
│  - HTTP Client (Axios)                                  │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ HTTP/REST API
                       │
┌──────────────────────▼──────────────────────────────────┐
│                 BACKEND (FastAPI + Python)              │
│  - REST API Endpoints                                   │
│  - Business Logic                                       │
│  - Database Operations (SQLAlchemy ORM)                │
│  - Authentication & Authorization                       │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ SQL
                       │
┌──────────────────────▼──────────────────────────────────┐
│              DATABASE (SQLite or PostgreSQL)            │
│  - Users Table                                          │
│  - Expenses Table                                       │
│  - Incomes Table                                        │
│  - Monthly Budgets Table                                │
└─────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
User Input (Email/Password)
         ↓
Frontend Form Submission
         ↓
Backend Validation (Pydantic)
         ↓
Database Query & Password Verification
         ↓
JWT Token Generation
         ↓
Token Stored in Frontend (localStorage/sessionStorage)
         ↓
All Subsequent Requests Include Token in Headers
         ↓
Backend Verifies Token & Extracts User ID
         ↓
Operations Filtered by User ID
```

---

## Technology Stack

### Frontend Stack

| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI Library | 18.3.1 |
| **TypeScript** | Type-Safe JavaScript | 5.6.3 |
| **Material-UI (MUI)** | Component Library | 9.0.1 |
| **React Router** | Client-Side Routing | 6.26.2 |
| **Axios** | HTTP Client | 1.7.2 |
| **React Hook Form** | Form Management | 7.77.0 |
| **Vite** | Build Tool | 5.4.2 |
| **jsPDF** | PDF Export | 2.5.1 |
| **xlsx** | Excel Export | 0.18.5 |
| **Zod** | Schema Validation | 4.4.3 |

### Backend Stack

| Technology | Purpose | Version |
|-----------|---------|---------|
| **FastAPI** | Web Framework | >=0.100 |
| **Uvicorn** | ASGI Server | >=0.20 |
| **SQLAlchemy** | ORM | >=2.0 |
| **Pydantic** | Data Validation | Built-in |
| **Python-Jose** | JWT Handling | >=3.3 |
| **Passlib** | Password Hashing | >=1.7 |
| **Alembic** | Database Migrations | >=1.11 |

### Database

- **SQLite** (Development) - File-based, no setup needed
- **PostgreSQL** (Production Ready) - Requires database server

---

## Project Structure

```
tracking_expenses/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI app startup
│   │   ├── core/
│   │   │   ├── config.py           # Configuration settings
│   │   │   └── security.py         # Password hashing & JWT
│   │   ├── db/
│   │   │   ├── session.py          # Database connection
│   │   │   └── base.py             # Declarative base
│   │   ├── models/
│   │   │   ├── user.py             # User model
│   │   │   ├── expense.py          # Expense model
│   │   │   ├── income.py           # Income model
│   │   │   └── budget.py           # Budget model
│   │   ├── schemas/
│   │   │   └── token.py            # Response schemas
│   │   └── api/
│   │       └── v1/
│   │           ├── router.py       # Route aggregation
│   │           ├── dependencies.py # Shared dependencies
│   │           └── endpoints/
│   │               ├── auth.py     # Auth endpoints
│   │               ├── expenses.py # Expense CRUD
│   │               ├── incomes.py  # Income CRUD
│   │               └── dashboard.py # Dashboard summary
│   ├── alembic/                    # Database migrations
│   ├── pyproject.toml              # Python dependencies
│   └── main.py
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx                # App entry point
│   │   ├── App.tsx                 # Route definitions
│   │   ├── context/
│   │   │   └── AuthContext.tsx     # Auth state management
│   │   ├── services/
│   │   │   └── api.ts              # Axios client config
│   │   ├── navigation/
│   │   │   └── AppLayout.tsx       # Main layout with nav
│   │   ├── screens/
│   │   │   ├── auth/
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   ├── RegisterScreen.tsx
│   │   │   │   └── ForgotPasswordScreen.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── DashboardScreen.tsx
│   │   │   ├── expenses/
│   │   │   │   ├── ExpensesListScreen.tsx
│   │   │   │   ├── AddEditExpenseScreen.tsx
│   │   │   │   ├── ExpenseDetailsScreen.tsx
│   │   │   │   └── ExpensesStackRoot.tsx
│   │   │   ├── income/
│   │   │   │   ├── IncomeListScreen.tsx
│   │   │   │   ├── AddEditIncomeScreen.tsx
│   │   │   │   └── IncomeStackRoot.tsx
│   │   │   ├── profile/
│   │   │   │   └── ProfileScreen.tsx
│   │   │   └── reports/
│   │   │       ├── ReportsDashboardScreen.tsx
│   │   │       └── ReportsStackRoot.tsx
│   │   └── styles/
│   │       └── theme.ts            # Material-UI theme
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
│
├── docs/
│   ├── API_ENDPOINTS.md
│   ├── DB_SCHEMA.md
│   └── DEPLOYMENT_GUIDE.md
│
├── SETUP.md                        # Installation guide
├── INSTALL_COMMANDS.md             # Copy-paste commands
└── README.md                       # Project overview
```

---

## How It Works

### 1. User Registration

**Flow:**
1. User fills registration form with:
   - Full Name
   - Email
   - Phone Number
   - Password (confirmed)
2. Frontend validates form data
3. Request sent to backend: `POST /api/v1/auth/register`
4. Backend:
   - Validates input with Pydantic
   - Hashes password
   - Creates user in database
   - Returns JWT token
5. Frontend stores token and redirects to dashboard

### 2. User Login

**Flow:**
1. User enters email and password
2. Frontend sends: `POST /api/v1/auth/login` with credentials
3. Backend:
   - Finds user by email
   - Verifies password hash
   - Generates JWT token
   - Returns token + user info
4. Frontend stores token for future requests
5. User redirected to dashboard

### 3. Adding an Expense

**Flow:**
1. User clicks "Add Expense" button
2. Form opens with fields:
   - Description
   - Amount
   - Category (dropdown)
   - Date
3. User fills and submits form
4. Frontend sends: `POST /api/v1/expenses`
5. Backend:
   - Validates data with Pydantic
   - Extracts user ID from JWT
   - Creates expense record in database
   - Returns created expense
6. Frontend redirects to expenses list
7. New expense appears in the list

### 4. Viewing Report

**Flow:**
1. User navigates to Reports tab
2. Frontend loads component
3. On mount, fetch:
   - `GET /api/v1/expenses` (all user's expenses)
   - `GET /api/v1/incomes` (all user's incomes)
4. Frontend calculates:
   - Total income
   - Total expenses
   - Remaining balance
5. Displays summary cards and transaction table
6. User can export:
   - PDF: Uses jsPDF library
   - Excel: Uses xlsx library

---

## User Workflows

### Complete User Journey

```
START
  ↓
[Visit App] → Not Logged In
  ↓
[Show Login/Register]
  ↓
[User Registers] → JWT Token Generated
  ↓
[Redirected to Dashboard]
  ↓
[Dashboard Overview]
  ├→ [View Expenses] → Add/Edit/Delete Expenses
  ├→ [View Income] → Add/Edit Income
  ├→ [View Reports] → Export PDF/Excel
  ├→ [View Profile] → See User Details & Logout
  └→ [Daily Monitoring] → Track spending in real-time
  ↓
[Logout] → Back to Login
```

### Expense Management Workflow

```
Expenses Tab
  ├→ View List (All Expenses)
  │   └→ Click Item → View Details
  │       └→ Click Edit → Modify & Save
  │
  └→ Click "Add Expense"
      ├→ Fill Form (Amount, Category, Date, Description)
      ├→ Submit
      └→ Appears in List
```

---

## API Endpoints

### Authentication Endpoints

```
POST   /api/v1/auth/register
       - Register new user
       - Body: email, password, full_name, phone_number
       - Returns: access_token, user_id, email, etc.

POST   /api/v1/auth/login
       - Login with credentials
       - Body: username (email), password
       - Returns: access_token, user_id, email, etc.

GET    /api/v1/auth/me
       - Get current user info
       - Header: Authorization: Bearer <token>
       - Returns: Current user details
```

### Expense Endpoints

```
POST   /api/v1/expenses
       - Create new expense
       - Body: amount, category, description, occurred_at
       - Returns: Created expense object

GET    /api/v1/expenses
       - List all expenses
       - Query: category, from, to, limit, offset
       - Returns: List of expenses

GET    /api/v1/expenses/{expense_id}
       - Get single expense
       - Returns: Expense details

PUT    /api/v1/expenses/{expense_id}
       - Update expense
       - Body: amount, category, description, occurred_at
       - Returns: Updated expense
```

### Income Endpoints

```
POST   /api/v1/incomes
       - Create new income

GET    /api/v1/incomes
       - List all incomes

GET    /api/v1/incomes/{income_id}
       - Get single income

PUT    /api/v1/incomes/{income_id}
       - Update income
```

### Dashboard Endpoint

```
GET    /api/v1/dashboard/summary
       - Get current month summary
       - Returns: total_income, total_expenses, remaining_balance, spent_pct, monthly_budget
```

---

## Database Schema

### Users Table
```sql
users
├── id (Primary Key)
├── email (Unique)
├── hashed_password
├── full_name
├── phone_number
├── role
├── created_at
└── updated_at
```

### Expenses Table
```sql
expenses
├── id (Primary Key)
├── user_id (Foreign Key)
├── amount
├── category (Enum: food, transport, bills, shopping, health, others)
├── description
├── occurred_at
├── bill_file_path
├── created_at
└── updated_at
```

### Incomes Table
```sql
incomes
├── id (Primary Key)
├── user_id (Foreign Key)
├── amount
├── category
├── description
├── occurred_at
├── created_at
└── updated_at
```

### Monthly Budgets Table
```sql
monthly_budgets
├── id (Primary Key)
├── user_id (Foreign Key)
├── month
├── amount
├── created_at
└── updated_at
```

---

## Frontend Components

### Page Components

| Component | Path | Purpose |
|-----------|------|---------|
| **LoginScreen** | `screens/auth/LoginScreen.tsx` | User login page |
| **RegisterScreen** | `screens/auth/RegisterScreen.tsx` | User registration page |
| **DashboardScreen** | `screens/dashboard/DashboardScreen.tsx` | Monthly summary & quick actions |
| **ExpensesListScreen** | `screens/expenses/ExpensesListScreen.tsx` | List all expenses |
| **AddEditExpenseScreen** | `screens/expenses/AddEditExpenseScreen.tsx` | Create/edit expense |
| **ExpenseDetailsScreen** | `screens/expenses/ExpenseDetailsScreen.tsx` | View expense details |
| **IncomeListScreen** | `screens/income/IncomeListScreen.tsx` | List all incomes |
| **AddEditIncomeScreen** | `screens/income/AddEditIncomeScreen.tsx` | Create/edit income |
| **ReportsDashboardScreen** | `screens/reports/ReportsDashboardScreen.tsx` | View & export reports |
| **ProfileScreen** | `screens/profile/ProfileScreen.tsx` | User profile & logout |

### Context Providers

| Context | Path | Purpose |
|---------|------|---------|
| **AuthContext** | `context/AuthContext.tsx` | Manages auth state, token, user info |

### Services

| Service | Path | Purpose |
|---------|------|---------|
| **api.ts** | `services/api.ts` | Axios client with auth headers |

---

## Key Concepts Explained

### JWT Authentication
- **What**: JSON Web Tokens - secure way to transmit user identity
- **How**: 
  1. User logs in
  2. Server generates token containing user ID
  3. Token sent to frontend
  4. Frontend includes token in all requests
  5. Backend verifies token and identifies user

### Protected Routes
- Routes that require authentication redirect to login if user not logged in
- Implemented via `RequireAuth` component checking for token

### API Calls with Authentication
- All requests include `Authorization: Bearer <token>` header
- Axios interceptor automatically adds this header
- Backend verifies token and extracts user ID for data filtering

### Data Isolation
- Each user only sees their own expenses and incomes
- Backend filters by `user_id` extracted from JWT token
- No cross-user data leakage

---

## Development vs Production

### Development Setup
```bash
Backend:  uvicorn app.main:app --reload    # Auto-reload on changes
Frontend: npm run dev                      # Vite dev server with HMR
Database: SQLite (test.db)                # File-based, auto-created
```

### Production Setup
```bash
Backend:  uvicorn app.main:app --workers 4    # Multiple workers
Frontend: npm run build → static files served # Optimized bundle
Database: PostgreSQL                         # Persistent database
```

---

## Common User Actions

### Action: Track Daily Expenses
1. Open app → Dashboard
2. Click "Add Expense"
3. Fill amount, category, description, date
4. Click Save
5. See on dashboard and expenses list

### Action: Review Monthly Spending
1. Go to Reports tab
2. See summary cards (income, expenses, balance)
3. Review recent transactions table
4. Export to PDF or Excel for records

### Action: Edit Previous Entry
1. Go to Expenses/Income tab
2. Click on entry to view details
3. Click "Edit"
4. Modify fields
5. Click Save

### Action: Logout
1. Go to Profile tab
2. Click Logout button
3. Redirected to login page

---

## Project Status & Features

### ✅ Implemented Features
- User authentication (register/login/logout)
- Create, read, update expenses
- Create, read, update incomes
- Dashboard with summary
- Reports with live data
- PDF and Excel export
- User profile management
- Responsive Material-UI design

### 🔄 In Progress / Future
- Delete operations for expenses/incomes
- Monthly budget setting and tracking
- Category-based spending analytics
- Charts and visualizations
- Bill image upload
- Recurring transactions
- Budget alerts

---

## Support & Troubleshooting

### Common Issues

**"Cannot connect to backend"**
- Ensure backend is running: `uvicorn app.main:app --reload`
- Check backend port is 8000

**"Authentication failed"**
- Check JWT token is stored in browser
- Try registering a new account
- Check backend logs for errors

**"Expenses not showing in reports"**
- Ensure you've added expenses first
- Wait for page to load (check loading spinner)
- Try refreshing the page

For more detailed troubleshooting, see [SETUP.md](SETUP.md).
