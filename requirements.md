# Requirements.md

## 📌 Project Overview
An **Expense Tracking Mobile Application** built with **Expo (React Native)**, styled with **TailwindCSS**, and powered by **Supabase** for authentication and database management.  

The app allows users to track expenses, manage bank accounts, categorize transactions, and view their balance and history in a clean, mobile-first UI.  

---

## 🚀 Tech Stack
- **Frontend:** Expo (React Native)
- **Styling:** TailwindCSS (NativeWind)
- **Backend & Auth:** Supabase
- **Database:** Supabase PostgreSQL
- **Routing:** Expo Router
- **State Management:** React Query / Context API (for session & data caching)

---

## 🔐 Authentication & User Flow
- **Signup/Login**
  - Supabase email/password authentication
  - Google OAuth login (via Supabase)
- **First-time Signup Flow (3 steps)**
  1. Ask for **Username**  
  2. Ask for **Initial Bank Balance**  
  3. Add a **Primary Bank Account**  
- After setup, redirect user to **Main Dashboard**  

---

## 📱 App Pages / Screens

### 1. **Auth Screens**
- **Login Screen**
  - Email & password login
  - Google OAuth option
- **Signup Screen**
  - Email/password signup
  - Google OAuth option  

### 2. **Setup Flow (Post-Signup)**
- **Username Screen** → Input name  
- **Initial Balance Screen** → Enter starting balance  
- **Primary Bank Account Screen** → Add bank name, account number, initial balance  

### 3. **Main Application**
- **Dashboard**
  - Show **current balance**
  - Show **recent transaction history**
- **Add Transaction**
  - Form: amount, type (income/expense), category, date, note
  - Update linked bank balance
- **Add Bank Account**
  - Form: bank name, account number, balance
  - Multiple bank accounts allowed
- **Add Category**
  - User can define custom categories (Food, Rent, Travel, etc.)
- **Transaction History**
  - Filter by category/date/type
  - Paginated list  

---

## 🗄️ Database Schema (Supabase)

### `users`
| Column        | Type       | Description                    |
|---------------|-----------|--------------------------------|
| id            | uuid (PK) | Supabase auth user id          |
| name          | text      | Username                       |
| created_at    | timestamp | Auto-generated                 |

### `banks`
| Column        | Type       | Description                    |
|---------------|-----------|--------------------------------|
| id            | uuid (PK) | Unique bank id                 |
| user_id       | uuid (FK) | Linked to users.id             |
| bank_name     | text      | Bank name                      |
| account_no    | text      | Bank account number            |
| balance       | numeric   | Current balance                |

### `categories`
| Column        | Type       | Description                    |
|---------------|-----------|--------------------------------|
| id            | uuid (PK) | Category id                    |
| user_id       | uuid (FK) | Linked to users.id             |
| name          | text      | Category name                  |

### `transactions`
| Column        | Type       | Description                    |
|---------------|-----------|--------------------------------|
| id            | uuid (PK) | Transaction id                 |
| user_id       | uuid (FK) | Linked to users.id             |
| bank_id       | uuid (FK) | Linked to banks.id             |
| category_id   | uuid (FK) | Linked to categories.id        |
| amount        | numeric   | Amount spent/received          |
| type          | text      | "income" / "expense"           |
| note          | text      | Optional note                  |
| created_at    | timestamp | Date of transaction            |

---

## 🎨 UI/UX Requirements
- Mobile-first clean UI
- **TailwindCSS (NativeWind)** for styling
- Dark/light mode toggle (optional stretch goal)
- Consistent card-based design for transactions & balances

---

## 🔄 Navigation
- **Expo Router** for navigation
- Auth-protected routes:
  - `/dashboard`
  - `/transactions`
  - `/banks`
  - `/categories`
- Public routes:
  - `/login`
  - `/signup`

---

## ✅ Deliverables
1. Expo project with folder structure:
   ```
   /src
     /components
     /pages
     /hooks
     /context
     /lib (supabase client)
   ```
2. TailwindCSS configured with NativeWind
3. Supabase client setup (`supabase.js`)
4. Authentication guards for private routes
5. CRUD operations for banks, categories, and transactions
6. Dashboard showing real-time balance & history  
