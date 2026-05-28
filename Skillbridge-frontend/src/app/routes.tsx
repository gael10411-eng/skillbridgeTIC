import { createBrowserRouter, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Mentorships } from './pages/Mentorships';
import { Certifications } from './pages/Certifications';
import { Profile } from './pages/Profile';
import { Terms } from './pages/Terms';

import { Layout } from './components/Layout';
import { useAuth } from './context/AuthContext';

/*
|--------------------------------------------------------------------------
| Protected Route
|--------------------------------------------------------------------------
|
| Protege rutas privadas usando JWT/localStorage.
| Si no hay sesión -> regresa al login.
|
*/

function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {

  const { isAuthenticated, loading } = useAuth();

  /*
  |--------------------------------------------------------------------------
  | Loading Auth
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">
          Cargando...
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Not Authenticated
  |--------------------------------------------------------------------------
  */

  if (!isAuthenticated) {

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Authenticated
  |--------------------------------------------------------------------------
  */

  return (
    <Layout>
      {children}
    </Layout>
  );
}

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
*/

export const router = createBrowserRouter([

  /*
  |--------------------------------------------------------------------------
  | LOGIN
  |--------------------------------------------------------------------------
  */

  {
    path: '/',
    element: <Login />,
  },

  /*
  |--------------------------------------------------------------------------
  | TERMS
  |--------------------------------------------------------------------------
  */

  {
    path: '/terms',
    element: <Terms />,
  },

  /*
  |--------------------------------------------------------------------------
  | DASHBOARD
  |--------------------------------------------------------------------------
  */

  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },

  /*
  |--------------------------------------------------------------------------
  | PROJECTS
  |--------------------------------------------------------------------------
  */

  {
    path: '/projects',
    element: (
      <ProtectedRoute>
        <Projects />
      </ProtectedRoute>
    ),
  },

  /*
  |--------------------------------------------------------------------------
  | MENTORSHIPS
  |--------------------------------------------------------------------------
  */

  {
    path: '/mentorships',
    element: (
      <ProtectedRoute>
        <Mentorships />
      </ProtectedRoute>
    ),
  },

  /*
  |--------------------------------------------------------------------------
  | CERTIFICATIONS
  |--------------------------------------------------------------------------
  */

  {
    path: '/certifications',
    element: (
      <ProtectedRoute>
        <Certifications />
      </ProtectedRoute>
    ),
  },

  /*
  |--------------------------------------------------------------------------
  | PROFILE
  |--------------------------------------------------------------------------
  */

  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },

  {
    path: '/my-projects',
    element: (
      <ProtectedRoute>
        <Projects scope="mine" />
      </ProtectedRoute>
    ),
  },

  {
    path: '/projects/:id',
    element: (
      <ProtectedRoute>
        <ProjectDetail />
      </ProtectedRoute>
    ),
  },

  /*
  |--------------------------------------------------------------------------
  | 404
  |--------------------------------------------------------------------------
  */

  {
    path: '*',
    element: (
      <Navigate
        to="/"
        replace
      />
    ),
  },
]);
