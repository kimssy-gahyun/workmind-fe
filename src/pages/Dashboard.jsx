import { useAuth } from '../auth/AuthContext.js'

function Dashboard() {
  const { user } = useAuth()
  return (
    <>
      <h1>Dashboard</h1>
      <p>{user.name}님, 안녕하세요.</p>
    </>
  )
}

export default Dashboard