import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import ErrorBoundary from './components/ui/ErrorBoundary'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Timer from './pages/Timer'
import AuthCallback from './pages/AuthCallback'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/timer" element={<Timer />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
              </Routes>
            </Layout>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
