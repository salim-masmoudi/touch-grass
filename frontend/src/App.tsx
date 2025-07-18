import React, { createContext, useContext, useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ProjectPage from './pages/ProjectPage'
import AgentPage from './pages/AgentPage'

// Theme context
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button className="theme-toggle" onClick={toggleTheme} title="Toggle light/dark mode">
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  )
}


function App() {
  const { isAuthenticated, signOut } = useAuth()

  return (
    <ThemeProvider>
      <div className="app">
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <DashboardPage onLogout={signOut} /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/project/:id"
            element={
              isAuthenticated ? <ProjectPage /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/project/:projectId/agent/:agentId"
            element={
              isAuthenticated ? <AgentPage /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
          />
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}
