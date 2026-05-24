import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useAuth } from '../context/AuthContext';
import { FolderKanban, Users, Award, TrendingUp, Plus, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';

export function Dashboard() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setUsers(data);
      })
      .catch(err => console.error(err));
  }, []);

  const stats = [
    {
      title: 'Proyectos Activos',
      value: '3',
      icon: FolderKanban,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+2 este mes',
    },
    {
      title: 'Mentorías',
      value: '2',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: 'En progreso',
    },
    {
      title: 'Certificaciones',
      value: '5',
      icon: Award,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      change: '2 pendientes',
    },
    {
      title: 'Progreso Global',
      value: '68%',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+12% este mes',
    },
  ];

  const recentProjects = [
    {
      id: 1,
      name: 'Sistema de Gestión IoT',
      team: 'Equipo Alpha',
      progress: 75,
      status: 'En progreso',
      deadline: '2026-05-01',
      members: 4,
    },
    {
      id: 2,
      name: 'App Móvil de Aprendizaje',
      team: 'Equipo Beta',
      progress: 45,
      status: 'En progreso',
      deadline: '2026-06-15',
      members: 3,
    },
    {
      id: 3,
      name: 'Dashboard Analytics',
      team: 'Equipo Gamma',
      progress: 90,
      status: 'Revisión',
      deadline: '2026-04-25',
      members: 5,
    },
  ];

  const upcomingMentorships = [
    {
      id: 1,
      mentor: 'Dr. Carlos Ruiz',
      topic: 'Arquitectura de Software',
      date: '2026-04-18',
      time: '10:00 AM',
      status: 'confirmed',
    },
    {
      id: 2,
      mentor: 'Ing. María López',
      topic: 'Desarrollo Backend',
      date: '2026-04-20',
      time: '2:00 PM',
      status: 'pending',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          ¡Bienvenido de vuelta, {user?.name}! 👋
        </h1>
        <p className="text-blue-100 mb-6">
          Continúa tu camino de aprendizaje y colaboración
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <Link to="/projects">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proyecto
            </Link>
          </Button>
          <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            <Link to="/mentorships">
              Solicitar Mentoría
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Proyectos Recientes</CardTitle>
                <CardDescription>Tus proyectos colaborativos activos</CardDescription>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link to="/projects">Ver todos</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-500">{project.team} • {project.members} miembros</p>
                    </div>
                    <Badge variant={project.status === 'Revisión' ? 'secondary' : 'default'}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progreso</span>
                      <span className="font-medium text-gray-900">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>Vence: {new Date(project.deadline).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Mentorships */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Mentorías</CardTitle>
            <CardDescription>Sesiones programadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMentorships.map((mentorship) => (
                <div key={mentorship.id} className="p-3 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className={`${mentorship.status === 'confirmed' ? 'bg-green-100' : 'bg-yellow-100'} p-2 rounded-lg`}>
                      {mentorship.status === 'confirmed' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm">{mentorship.mentor}</h4>
                      <p className="text-xs text-gray-600 mb-2">{mentorship.topic}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(mentorship.date).toLocaleDateString('es-ES')} • {mentorship.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link to="/mentorships">Ver todas las mentorías</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
  <CardHeader>
    <CardTitle>Usuarios desde Backend</CardTitle>
  </CardHeader>

  <CardContent>
    {users.map((u: any) => (
      <p key={u.id}>
        {u.nombre}
      </p>
    ))}
  </CardContent>
</Card>
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>Accede rápidamente a las funciones principales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-24 flex-col">
              <Link to="/projects">
                <FolderKanban className="h-6 w-6 mb-2" />
                <span className="text-sm">Nuevo Proyecto</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24 flex-col">
              <Link to="/mentorships">
                <Users className="h-6 w-6 mb-2" />
                <span className="text-sm">Solicitar Mentoría</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24 flex-col">
              <Link to="/certifications">
                <Award className="h-6 w-6 mb-2" />
                <span className="text-sm">Mis Certificados</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24 flex-col">
              <Link to="/dashboard">
                <TrendingUp className="h-6 w-6 mb-2" />
                <span className="text-sm">Ver Progreso</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
