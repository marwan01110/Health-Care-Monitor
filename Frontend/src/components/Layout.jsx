import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';

export function Layout({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-medical-600">
            ❤️ Health Monitor
          </h1>
          <p className="text-sm text-gray-600 mt-1">Medical Dashboard</p>
        </div>

        <nav className="p-4">
          <NavLink
            to="/dashboard"
            label="Dashboard"
            icon="📊"
          />
          <NavLink
            to="/patients"
            label="Patients"
            icon="👥"
          />
          <NavLink
            to="/measurements"
            label="Measurements"
            icon="📈"
          />
          <NavLink
            to="/predictions"
            label="Predictions"
            icon="🔮"
          />
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-gray-50">
          {user && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-800">{user.username}</p>
              <p className="text-xs text-gray-500">{user.email || 'Medical Professional'}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full bg-danger-600 hover:bg-danger-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 shadow-sm p-6">
          <h2 className="text-3xl font-bold text-gray-900">Healthcare Dashboard</h2>
          <p className="text-gray-600 mt-1">Monitoring patient health metrics and predictions</p>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({ to, label, icon }) {
  const navigate = useNavigate();
  const isActive = window.location.pathname === to;

  return (
    <button
      onClick={() => navigate(to)}
      className={`w-full text-left px-4 py-3 rounded-lg mb-2 font-semibold transition-colors flex items-center gap-3 ${
        isActive
          ? 'bg-medical-100 text-medical-700'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <span className="text-xl">{icon}</span>
      {label}
    </button>
  );
}
