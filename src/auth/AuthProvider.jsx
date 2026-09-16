import { useEffect, useState } from 'react'
import client, { TOKEN_KEY } from '../api/client.js'
import { AuthContext } from './AuthContext.js'

function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = sessionStorage.getItem(TOKEN_KEY)
    return { token, user: null, status: token ? 'checking' : 'anonymous' }
  })
  const [attempt, setAttempt] = useState(0)
  const token = auth.token

  useEffect(() => {
    if (!token) return

    const controller = new AbortController()
    client.get('/members/me', { signal: controller.signal })
      .then(({ data }) => {
        if (controller.signal.aborted || sessionStorage.getItem(TOKEN_KEY) !== token) return
        setAuth({ token, user: data, status: 'authenticated' })
      })
      .catch((error) => {
        if (controller.signal.aborted || sessionStorage.getItem(TOKEN_KEY) !== token) return
        if ([401, 403, 404].includes(error.response?.status)) {
          sessionStorage.removeItem(TOKEN_KEY)
          setAuth({ token: null, user: null, status: 'anonymous' })
        } else {
          setAuth({ token, user: null, status: 'error' })
        }
      })

    return () => controller.abort()
  }, [token, attempt])

  async function login(email, password) {
    const { data } = await client.post('/auth/login', { email, password })
    if (typeof data.accessToken !== 'string' || !data.accessToken.trim()) {
      throw new Error('Login response did not include an access token')
    }
    sessionStorage.setItem(TOKEN_KEY, data.accessToken)
    setAuth({ token: data.accessToken, user: null, status: 'checking' })
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY)
    setAuth({ token: null, user: null, status: 'anonymous' })
  }
  function retry() {
    setAuth((current) => ({ ...current, status: 'checking' }))
    setAttempt((current) => current + 1)
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, retry }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider