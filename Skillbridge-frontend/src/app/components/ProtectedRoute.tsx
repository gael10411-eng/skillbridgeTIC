import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | string[];
}

/**
 * Componente para proteger rutas por autenticación y rol
 * 
 * Uso:
 * <ProtectedRoute requiredRole="admin">
 *   <AdminPanel />
 * </ProtectedRoute>
 */
export function ProtectedRoute({
  children,
  requiredRole
}: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!user || !allowedRoles.includes(user.rol)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
            <p className="text-gray-600 mb-6">
              No tienes permisos para acceder a esta página.
            </p>
            <p className="text-sm text-gray-500">
              Tu rol: <span className="font-semibold">{user?.rol}</span>
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

/**
 * Componente para mostrar/ocultar contenido según el rol
 * 
 * Uso:
 * <RoleBasedComponent requiredRole="admin">
 *   <AdminButton />
 * </RoleBasedComponent>
 */
export function RoleBasedComponent({
  children,
  requiredRole
}: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowedRoles.includes(user.rol)) {
      return null;
    }
  }

  return <>{children}</>;
}

/**
 * Hook para verificar si el usuario tiene un rol específico
 */
export function useHasRole(role: string | string[]): boolean {
  const { user } = useAuth();
  if (!user) return false;
  
  const allowedRoles = Array.isArray(role) ? role : [role];
  return allowedRoles.includes(user.rol);
}

/**
 * Hook para verificar si es admin
 */
export function useIsAdmin(): boolean {
  return useHasRole('admin');
}

/**
 * Hook para verificar si es mentor
 */
export function useIsMentor(): boolean {
  return useHasRole('mentor');
}

/**
 * Hook para verificar si es estudiante
 */
export function useIsStudent(): boolean {
  return useHasRole('estudiante');
}
