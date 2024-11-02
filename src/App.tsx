// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Projects from './pages/projects';
import styles from './App.module.css';
import ProjectDetails from './pages/projects/ProjectDetails';
import Employees from './pages/employees';
import Dashboard from './pages/dashboard';
import Profile from './pages/profile';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import Transactions from './pages/transactions';
import MyExpenses from './pages/myexpenses';

interface PrivateRouteProps {
  element: JSX.Element;
  allowedRoles?: Array<'admin' | 'accountant' | 'employee'>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  element,
  allowedRoles = [],
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return element;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>{children}</main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <Layout>
              <PrivateRoute element={<Projects />} />
            </Layout>
          }
        />
        <Route
          path="/projects"
          element={
            <Layout>
              <PrivateRoute element={<Projects />} />
            </Layout>
          }
        />
        <Route
          path="/projects/:projectId"
          element={
            <Layout>
              <PrivateRoute element={<ProjectDetails />} />
            </Layout>
          }
        />

        <Route
          path="/profile"
          element={
            <Layout>
              <PrivateRoute element={<Profile />} />
            </Layout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <PrivateRoute element={<Dashboard />} allowedRoles={['admin']} />
            </Layout>
          }
        />

        <Route
          path="/employees"
          element={
            <Layout>
              <PrivateRoute element={<Employees />} allowedRoles={['admin']} />
            </Layout>
          }
        />
        <Route
          path="/transactions"
          element={
            <Layout>
              <PrivateRoute
                element={<Transactions />}
                allowedRoles={['admin', 'accountant']}
              />
            </Layout>
          }
        />

        <Route
          path="/my-expenses"
          element={
            <Layout>
              <PrivateRoute element={<MyExpenses />} />
            </Layout>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
