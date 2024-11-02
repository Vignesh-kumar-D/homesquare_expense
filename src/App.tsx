// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Projects from './pages/projects';
import './App.css';
import ProjectDetails from './pages/projects/ProjectDetails';
import Employees from './pages/employees';
import Dashboard from './pages/dashboard';
import Transactions from './pages/transactions';
import MyExpenses from './pages/myexpenses';
const mockUser = {
  name: 'John Doe',
  role: 'admin' as const,
  isAuthenticated: true,
};

const Login = () => <div>Login Page</div>;

const ProjectRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Projects />} />
        <Route path="/:projectId" element={<ProjectDetails />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  const handleLogout = () => {
    console.log('Logging out...');
    // Add logout logic here
  };

  // Protected Route wrapper component
  const ProtectedRoute: React.FC<{
    element: React.ReactNode;
    allowedRoles?: Array<'admin' | 'accountant' | 'employee'>;
  }> = ({ element, allowedRoles = [] }) => {
    if (!mockUser.isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(mockUser.role)) {
      return <Navigate to="/dashboard" replace />;
    }

    return <>{element}</>;
  };

  return (
    <div style={styles.app}>
      {mockUser.isAuthenticated && (
        <Header
          userName={mockUser.name}
          userRole={mockUser.role}
          onLogout={handleLogout}
        />
      )}

      <main style={styles.mainContent}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              mockUser.isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login />
              )
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Dashboard />} />}
          />

          {/* Admin Only Routes */}
          <Route
            path="/projects/*"
            element={
              <ProtectedRoute
                element={<ProjectRoutes />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute
                element={<Employees />}
                allowedRoles={['admin']}
              />
            }
          />

          {/* Admin and Accountant Routes */}
          <Route
            path="/transactions"
            element={
              <ProtectedRoute
                element={<Transactions />}
                allowedRoles={['admin', 'accountant']}
              />
            }
          />

          {/* All Authenticated Users Routes */}
          <Route
            path="/my-expenses"
            element={<ProtectedRoute element={<MyExpenses />} />}
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  mainContent: {
    flex: 1,
    padding: '20px',
    // Add a subtle gradient overlay to the
  },
} as const;

export default App;
