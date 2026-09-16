import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.js'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const submitting = useRef(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting.current) return
    submitting.current = true
    setLoading(true)
    setError('')

    try {
      await login(email.trim(), password)
      navigate('/dashboard', { replace: true })
    } catch (failure) {
      setError(failure.response?.status === 401
        ? '이메일 또는 비밀번호를 확인해주세요.'
        : '로그인할 수 없습니다. 서버 연결을 확인한 후 다시 시도해주세요.')
    } finally {
      submitting.current = false
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-shell">
        <header className="login-brand">
          <span className="login-symbol" aria-hidden="true">W</span>
          <span>WorkMind</span>
        </header>
        <section className="login-card" aria-labelledby="login-title">
          <div className="login-heading">
            <p className="login-eyebrow">WORKSPACE ACCESS</p>
            <h1 id="login-title">업무의 시작, WorkMind</h1>
            <p className="login-description">AI 기반 사내 문서 및 지식 관리 시스템</p>
          </div>
          <form onSubmit={handleSubmit} aria-busy={loading}>
            <div className="login-field">
              <label htmlFor="email">이메일</label>
              <input id="email" name="email" type="email" autoComplete="username"
                placeholder="name@company.com" value={email}
                onChange={(event) => setEmail(event.target.value)}
                required disabled={loading} autoCapitalize="none" spellCheck={false} />
            </div>
            <div className="login-field">
              <label htmlFor="password">비밀번호</label>
              <input id="password" name="password" type="password" autoComplete="current-password"
                placeholder="비밀번호를 입력해주세요" value={password}
                onChange={(event) => setPassword(event.target.value)}
                required disabled={loading} aria-describedby={error ? 'login-error' : undefined} />
            </div>
            {error && <p id="login-error" className="login-error" role="alert">{error}</p>}
            <button className="login-submit" type="submit" disabled={loading}>
              {loading ? '로그인 중…' : '로그인'}
            </button>
          </form>
          <p className="login-note">회사에서 사용하는 계정으로 로그인해주세요.</p>
        </section>
        <footer className="login-footer">WorkMind · 사내 업무 공간</footer>
      </div>
    </main>
  )
}

export default Login