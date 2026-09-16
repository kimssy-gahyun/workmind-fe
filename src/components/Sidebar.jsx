import { NavLink } from 'react-router-dom'

const navigation = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/documents', label: 'Documents' },
  { to: '/knowledge', label: 'Knowledge Search' },
]

function Sidebar() {
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
    </aside>
  )
}

export default Sidebar