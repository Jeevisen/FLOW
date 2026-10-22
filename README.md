# FLOW 💸

FLOW is my personal finance tracker web app! I built this project to get more comfortable with React, learn how to work with databases, and explore full-stack web development. Unlike my previous project, this one uses Supabase for authentication and data storage, allowing users to create accounts, record transactions, and keep track of their finances.

## What it does

- Create an account and log in securely
- View a personalized financial dashboard
- Track total balance, income, expenses, and transactions
- Add income and expense transactions with amounts, descriptions, and dates
- View transaction history and monthly cash flow
- Navigate between pages with a responsive interface
- Sign out and protect pages from unauthenticated access

## Built with

- React
- JavaScript
- Vite
- Tailwind CSS
- Motion for animations and transitions
- React Router for navigation
- Supabase Auth for user authentication
- Supabase (PostgreSQL) for storing transactions

## Project structure

```text
FLOW/
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── public/
│   ├── bg.mp4
│   ├── logo.png
│   └── favicon.svg
├── lib/
│   └── supabaseClient.js
└── src/
    ├── components/
    │   ├── header.jsx
    │   └── protectedRoute.jsx
    ├── App.jsx
    ├── dashboard.jsx
    ├── index.css
    ├── login.jsx
    ├── main.jsx
    ├── signup.jsx
    └── transactions.jsx
```

## Running it locally

1. Clone the repository and open the project folder in VS Code.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a Supabase project and configure the `transactions` table with Row Level Security policies so users can only access their own transactions.
4. Create a `.env` file in the root directory and add your Supabase project URL and publishable/anon key:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open the localhost URL displayed in the terminal.

## Notes

[Flow Video Demo](https://drive.google.com/file/d/1RhsiO9vxmPizK02ziXEb9B5RhnALyKom/view?usp=sharing)


[Try FLOW (Live Website)](https://flow-lemon-rho.vercel.app/)


This is a personal project I built to practice full-stack development, particularly connecting a React frontend to a PostgreSQL database through Supabase.

FLOW isn't connected to real bank accounts. All financial information is manually entered, and balances are calculated based on the transactions recorded in the app.

The project was developed for learning and portfolio purposes rather than production use.