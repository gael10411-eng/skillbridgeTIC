import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

import {
  FolderKanban,
  Users,
  Award,
  TrendingUp,
  Plus,
  UserCircle
} from 'lucide-react';

interface BackendUser {
  id: number;
  nombre: string;
  email: string;
  rol?: string;
  avatar?: string;
}

export function Dashboard() {

  const { user } = useAuth();

  const [users, setUsers] = useState<BackendUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Obtener usuarios reales desde backend
  useEffect(() => {

    const fetchUsers = async () => {

      try {

        const token = localStorage.getItem('token');

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Error obteniendo usuarios');
        }

        const data = await response.json();

        setUsers(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoadingUsers(false);

      }
    };

    fetchUsers();

  }, []);

  return (

    <div className="space-y-8">

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">

        <h1 className="text-3xl font-bold mb-2">
          ¡Bienvenido de vuelta, {user?.nombre}!
        </h1>

        <p className="text-blue-100 mb-6">
          Continúa desarrollando proyectos y fortaleciendo tus habilidades.
        </p>

        <div className="flex flex-wrap gap-3">

          <Button asChild variant="secondary">
            <Link to="/projects">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proyecto
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Link to="/mentorships">
              Solicitar Mentoría
            </Link>
          </Button>

        </div>
      </div>

      {/* Estado Inicial */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Card>

          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-blue-600" />
              Proyectos
            </CardTitle>

            <CardDescription>
              Tus proyectos aparecerán aquí
            </CardDescription>
          </CardHeader>

          <CardContent>

            <div className="text-center py-6">

              <p className="text-gray-500 text-sm mb-4">
                Aún no tienes proyectos creados.
              </p>

              <Button asChild size="sm">

                <Link to="/projects">
                  Crear Proyecto
                </Link>

              </Button>

            </div>

          </CardContent>
        </Card>

        <Card>

          <CardHeader>

            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Mentorías
            </CardTitle>

            <CardDescription>
              Tus sesiones aparecerán aquí
            </CardDescription>

          </CardHeader>

          <CardContent>

            <div className="text-center py-6">

              <p className="text-gray-500 text-sm mb-4">
                No tienes mentorías programadas.
              </p>

              <Button asChild size="sm" variant="outline">

                <Link to="/mentorships">
                  Buscar Mentor
                </Link>

              </Button>

            </div>

          </CardContent>
        </Card>

        <Card>

          <CardHeader>

            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-600" />
              Certificaciones
            </CardTitle>

            <CardDescription>
              Tus logros aparecerán aquí
            </CardDescription>

          </CardHeader>

          <CardContent>

            <div className="text-center py-6">

              <p className="text-gray-500 text-sm mb-4">
                Aún no tienes certificaciones.
              </p>

              <Button asChild size="sm" variant="outline">

                <Link to="/certifications">
                  Explorar Certificaciones
                </Link>

              </Button>

            </div>

          </CardContent>
        </Card>

      </div>

      {/* Usuarios Backend */}
      <Card>

        <CardHeader>

          <CardTitle>
            Usuarios Registrados
          </CardTitle>

          <CardDescription>
            Información obtenida desde la API y base de datos real
          </CardDescription>

        </CardHeader>

        <CardContent>

          {loadingUsers ? (

            <p className="text-gray-500">
              Cargando usuarios...
            </p>

          ) : users.length === 0 ? (

            <p className="text-gray-500">
              No hay usuarios registrados.
            </p>

          ) : (

            <div className="space-y-3">

              {users.map((u) => (

                <div
                  key={u.id}
                  className="p-4 border rounded-xl flex items-center justify-between hover:shadow-sm transition-shadow"
                >

                  <div className="flex items-center gap-3">

                    {u.avatar ? (

                      <img
                        src={u.avatar}
                        alt={u.nombre}
                        className="w-10 h-10 rounded-full object-cover"
                      />

                    ) : (

                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">

                        <UserCircle className="h-6 w-6 text-gray-500" />

                      </div>

                    )}

                    <div>

                      <p className="font-medium text-gray-900">
                        {u.nombre}
                      </p>

                      <p className="text-sm text-gray-500">
                        {u.email}
                      </p>

                    </div>

                  </div>

                  {u.rol && (

                    <Badge variant="outline">
                      {u.rol}
                    </Badge>

                  )}

                </div>
              ))}
            </div>
          )}

        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>

        <CardHeader>

          <CardTitle>
            Acciones Rápidas
          </CardTitle>

          <CardDescription>
            Accede rápidamente a las funciones principales
          </CardDescription>

        </CardHeader>

        <CardContent>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <Button
              asChild
              variant="outline"
              className="h-24 flex-col"
            >

              <Link to="/projects">

                <FolderKanban className="h-6 w-6 mb-2" />

                <span className="text-sm">
                  Nuevo Proyecto
                </span>

              </Link>

            </Button>

            <Button
              asChild
              variant="outline"
              className="h-24 flex-col"
            >

              <Link to="/mentorships">

                <Users className="h-6 w-6 mb-2" />

                <span className="text-sm">
                  Mentorías
                </span>

              </Link>

            </Button>

            <Button
              asChild
              variant="outline"
              className="h-24 flex-col"
            >

              <Link to="/certifications">

                <Award className="h-6 w-6 mb-2" />

                <span className="text-sm">
                  Certificaciones
                </span>

              </Link>

            </Button>

            <Button
              asChild
              variant="outline"
              className="h-24 flex-col"
            >

              <Link to="/dashboard">

                <TrendingUp className="h-6 w-6 mb-2" />

                <span className="text-sm">
                  Mi Progreso
                </span>

              </Link>

            </Button>

          </div>

        </CardContent>
      </Card>

    </div>
  );
}