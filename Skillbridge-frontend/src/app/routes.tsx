import { createBrowserRouter, Navigate } from 'react-router';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Mentorships } from './pages/Mentorships';
import { Certifications } from './pages/Certifications';
import { Layout } from './components/Layout';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <Layout>{children}</Layout>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/projects',
    element: (
      <ProtectedRoute>
        <Projects />
      </ProtectedRoute>
    ),
  },
  {
    path: '/mentorships',
    element: (
      <ProtectedRoute>
        <Mentorships />
      </ProtectedRoute>
    ),
  },
  {
    path: '/certifications',
    element: (
      <ProtectedRoute>
        <Certifications />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
