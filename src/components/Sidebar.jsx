import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.js'

const navigation = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/documents', label: 'Documents' },
  { to: '/knowledge', label: 'Knowledge Search' },
]

function Sidebar() {
  const { logout } = useAuth()
  return (
    <aside className="sidebar">
      <p className="brand">WorkMind</p>
      <nav aria-label="Main navigation">
        <ul className="navigation">
          {navigation.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  isActive ? 'navigation-link active' : 'navigation-link'
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button className="navigation-link sidebar-logout" type="button" onClick={logout}>
          로그아웃
        </button>
      </div>
    </aside>
  )
}

export default Sidebar