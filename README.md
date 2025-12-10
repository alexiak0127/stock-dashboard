# Market Dashboard

Market Dashboard is a simple, real-time stock tracker where you can search tickers, see key financials, and keep a personal watchlist.


Log in, look up a stock, check its price, overview, and financials, and save your favorites so they’re easy to find next time.


This is a full-stack app with Next.js for the frontend and backend API routes, MongoDB for database, NextAuth for authentication, and Alpha Vantage API for real-time stock market data.

## Team Members
- Alexia Kim
- Charles Yao
- Ahemed Bullo
- Raymond Greenberg

## Features
### 1. Homepage
- **Hero Section**:
  - "Explore stocks": Takes you to the search page
  - "View my watchlist": Takes you to your favorites after logging in
- **Top Movers**:
  - 5 stock cards showing the biggest market movers
    - Green = gainers
    - Red = losers
    - Click any card to open the stock detail modal
### 2. Authentication
  - Sign in with Github or Google
  - Users will be redirected back with their profile avatar visible
### 3. Stock Search
  - Search for any publicly traded stock
  - Stock card appears with current price
  - Click the stock card to open the detailed model
### 4. Stock Detail Modal
  - When you click any stock card, a modal opens with three tabs:
    - **Overview**: Company description, sector, market cap, P/E ratio, and key metrics
    - **Financials**: Income statement with revenue, expenses, and profitability
    - **Price**: Current and historical price information and interactive price chart
### 5. Favorites/Watchlist
  - Add stocks to your personal watchlist for quick access
  - Each logged-in user has their own favorites list
  - Favorites saved to MongoDB
