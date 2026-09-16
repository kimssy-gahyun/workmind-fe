import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import AuthProvider from './auth/AuthProvider.jsx'
import { useAuth } from './auth/AuthContext.js'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Documents from './pages/Documents.jsx'
import DocumentCreate from './pages/DocumentCreate.jsx'
import DocumentDetail from './pages/DocumentDetail.jsx'
import KnowledgeSearch from './pages/KnowledgeSearch.jsx'
import './App.css'

function SessionStatus() {
  const { status, retry } = useAuth()
  return (
    <main className="session-status" aria-live="polite">
      {status === 'error' ? (
        <div>
          <p role="alert">사용자 정보를 확인할 수 없습니다. 서버 연결을 확인해주세요.</p>
          <button type="button" onClick={retry}>다시 시도</button>
        </div>
      ) : <p role="status">사용자 정보를 확인하고 있습니다.</p>}
    </main>
  )
}

function ProtectedRoute() {
  const { status } = useAuth()
  if (status === 'anonymous') return <Navigate to="/" replace />
  if (status !== 'authenticated') return <SessionStatus />
  return <Outlet />
}

function LoginRoute() {
  const { status } = useAuth()
  if (status === 'authenticated') return <Navigate to="/dashboard" replace />
  if (status !== 'anonymous') return <SessionStatus />
  return <Login />
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginRoute />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/documents/new" element={<DocumentCreate />} />
            <Route path="/documents/:id" element={<DocumentDetail />} />
            <Route path="/knowledge" element={<KnowledgeSearch />} />
            <Route path="/knowledge-search" element={<Navigate to="/knowledge" replace />} />
            <Route path="*" element={<h1>Page Not Found</h1>} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App