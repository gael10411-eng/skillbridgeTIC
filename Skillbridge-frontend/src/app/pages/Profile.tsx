import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Award,
  Calendar,
  CheckCircle2,
  FolderKanban,
  LogOut,
  Mail,
  Save,
  Star,
  TrendingUp,
  User,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { useAuth } from '../context/AuthContext';
import api from '../../services/api';

interface ProfileUser {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  estado: string;
  avatar?: string;
  fecha_creacion?: string;
}

interface ProfileStats {
  proyectos_activos: number;
  mentorias: number;
  certificaciones: number;
  progreso_global: number;
  ultima_actualizacion?: string | null;
}

interface ProjectSummary {
  id: number;
  titulo: string;
  descripcion?: string;
  estado: string;
  visibilidad: string;
  fecha_creacion?: string;
}

interface MentorshipSummary {
  id: number;
  tema: string;
  fecha: string;
  hora?: string;
  estado: string;
  tipo?: string;
}

interface CertificationSummary {
  id: number;
  fecha_obtenida?: string;
  credential_id?: string;
  certifications?: {
    nombre: string;
    nivel?: string;
  };
}

interface MentorProfile {
  id: number;
  titulo?: string;
  bio?: string;
  rating?: number;
  reviews?: number;
  availability?: string;
  sessions?: number;
}

interface ProfileData {
  user: ProfileUser;
  stats: ProfileStats;
  projects: ProjectSummary[];
  mentorships: MentorshipSummary[];
  certifications: CertificationSummary[];
  mentorProfile: MentorProfile | null;
}

const roleLabels: Record<string, string> = {
  estudiante: 'Estudiante',
  empresa: 'Empresa',
  institucion: 'Institución',
  admin: 'Administrador'
};

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [nombre, setNombre] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/users/${user.id}/profile`);
        setProfile(response.data);
        setNombre(response.data.user.nombre || '');
        setAvatar(response.data.user.avatar || '');
      } catch (error) {
        console.error(error);
        toast.error('Error cargando perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const userInitial = profile?.user.nombre?.charAt(0)?.toUpperCase() || 'U';
  const currentRole = profile?.user.rol ? roleLabels[profile.user.rol] || profile.user.rol : 'Sin rol';

  const joinedDate = useMemo(() => {
    if (!profile?.user.fecha_creacion) {
      return 'Sin fecha';
    }

    return new Date(profile.user.fecha_creacion).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long'
    });
  }, [profile?.user.fecha_creacion]);

  const handleSave = async () => {
    if (!user?.id) {
      return;
    }

    setSaving(true);

    try {
      const response = await api.patch(`/users/${user.id}`, {
        nombre,
        avatar
      });

      const updatedUser = {
        ...(user || {}),
        ...response.data
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));

      setProfile((current) =>
        current
          ? {
              ...current,
              user: response.data
            }
          : current
      );

      toast.success('Perfil actualizado');
    } catch (error) {
      console.error(error);
      toast.error('No se pudo actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Cargando perfil...
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-gray-500">
          No se pudo cargar la información del perfil.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.user.avatar || ''} alt={profile.user.nombre} />
            <AvatarFallback className="text-2xl">{userInitial}</AvatarFallback>
          </Avatar>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900">{profile.user.nombre}</h1>
              <Badge variant="outline">{currentRole}</Badge>
              <Badge>{profile.user.estado}</Badge>
            </div>
            <p className="text-gray-600 flex items-center gap-2 mt-1">
              <Mail className="h-4 w-4" />
              {profile.user.email}
            </p>
            <p className="text-sm text-gray-500 mt-1">Miembro desde {joinedDate}</p>
          </div>
        </div>

        <Button variant="outline" className="text-red-600" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Proyectos Activos</CardTitle>
            <FolderKanban className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{profile.stats.proyectos_activos || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Mentorías</CardTitle>
            <Users className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{profile.stats.mentorias || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Certificaciones</CardTitle>
            <Award className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{profile.stats.certificaciones || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Progreso Global</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">{profile.stats.progreso_global || 0}%</div>
            <Progress value={profile.stats.progreso_global || 0} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>Actualiza tus datos visibles en la plataforma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Nombre</Label>
              <Input
                id="profile-name"
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-avatar">URL de avatar</Label>
              <Input
                id="profile-avatar"
                value={avatar}
                onChange={(event) => setAvatar(event.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Rol: {currentRole}
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Estado: {profile.user.estado}
              </p>
            </div>

            <Button className="w-full" onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {profile.mentorProfile && (
            <Card>
              <CardHeader>
                <CardTitle>Perfil de Mentor</CardTitle>
                <CardDescription>{profile.mentorProfile.titulo || 'Mentor TIC'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{profile.mentorProfile.bio || 'Sin biografía registrada.'}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    {profile.mentorProfile.rating || 5} rating
                  </div>
                  <div>{profile.mentorProfile.reviews || 0} reseñas</div>
                  <div>{profile.mentorProfile.sessions || 0} sesiones</div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Proyectos Recientes</CardTitle>
              <CardDescription>Últimos proyectos asociados a tu cuenta</CardDescription>
            </CardHeader>
            <CardContent>
              {profile.projects.length === 0 ? (
                <p className="text-sm text-gray-500">No tienes proyectos registrados.</p>
              ) : (
                <div className="space-y-3">
                  {profile.projects.map((project) => (
                    <div key={project.id} className="flex items-start justify-between gap-3 border rounded-lg p-3">
                      <div>
                        <p className="font-medium text-gray-900">{project.titulo}</p>
                        <p className="text-sm text-gray-500 line-clamp-2">{project.descripcion || 'Sin descripción'}</p>
                      </div>
                      <Badge variant="outline">{project.estado}</Badge>
                    </div>
                  ))}
                </div>
              )}

              <Button asChild variant="outline" className="mt-4">
                <Link to="/projects">Ver Proyectos</Link>
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mentorías</CardTitle>
                <CardDescription>Sesiones recientes</CardDescription>
              </CardHeader>
              <CardContent>
                {profile.mentorships.length === 0 ? (
                  <p className="text-sm text-gray-500">No tienes mentorías registradas.</p>
                ) : (
                  <div className="space-y-3">
                    {profile.mentorships.map((session) => (
                      <div key={session.id} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-medium text-gray-900">{session.tema}</p>
                          <Badge>{session.estado}</Badge>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(session.fecha).toLocaleDateString('es-ES')} {session.hora || ''}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certificaciones</CardTitle>
                <CardDescription>Logros recientes</CardDescription>
              </CardHeader>
              <CardContent>
                {profile.certifications.length === 0 ? (
                  <p className="text-sm text-gray-500">No tienes certificaciones obtenidas.</p>
                ) : (
                  <div className="space-y-3">
                    {profile.certifications.map((certification) => (
                      <div key={certification.id} className="border rounded-lg p-3">
                        <p className="font-medium text-gray-900">
                          {certification.certifications?.nombre || 'Certificación'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {certification.fecha_obtenida
                            ? new Date(certification.fecha_obtenida).toLocaleDateString('es-ES')
                            : 'Sin fecha'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
