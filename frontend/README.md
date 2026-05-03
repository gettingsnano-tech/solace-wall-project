# Core Capital Wall - Frontend

This is the frontend for the Core Capital Wall Project, built with Next.js 15, Tailwind CSS, and Framer Motion.

## Features

- **Responsive Design**: Mobile-first, sleek, and modern UI.
- **Dynamic Dashboards**: Real-time portfolio tracking and analytics.
- **Secure Authentication**: Integrated with the Core Capital Wall Backend for JWT-based auth and 2FA.
- **Interactive UI**: Smooth transitions and animations using Framer Motion.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3001` (configured in `package.json`).

3. **Configure Environment**:
   Create a `.env.local` if you need to override the API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

## Tech Stack

- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: Axios & React Query
