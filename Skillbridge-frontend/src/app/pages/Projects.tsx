import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Image as ImageIcon, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../context/AuthContext';
import {
  createProject,
  getProjects,
  type Project,
  type ProjectVisibility
} from '../../services/projectService';

interface ProjectsProps {
  scope?: 'explore' | 'mine';
}

const visibilityLabels: Record<ProjectVisibility, string> = {
  publico: 'Público',
  privado: 'Privado',
  solo_empresas: 'Solo empresas',
  solo_instituciones: 'Solo instituciones'
};

export function Projects({ scope = 'explore' }: ProjectsProps) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [visibilidad, setVisibilidad] = useState<ProjectVisibility>('privado');
  const [imagen, setImagen] = useState('');

  const isMine = scope === 'mine';

  useEffect(() => {
    fetchProjects();
  }, [scope, user?.id, user?.rol]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects(
        {
          id: user?.id,
          rol: user?.rol
        },
        scope
      );

      setProjects(data);
    } catch (error) {
      console.error(error);
      toast.error('Error cargando proyectos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!user?.id) {
      toast.error('No se encontró tu usuario activo');
      return;
    }

    try {
      await createProject({
        titulo,
        descripcion,
        owner_id: user.id,
        visibilidad,
        imagen
      });

      toast.success('Proyecto creado exitosamente');
      setTitulo('');
      setDescripcion('');
      setImagen('');
      setVisibilidad('privado');
      setIsCreateDialogOpen(false);
      fetchProjects();
    } catch (error) {
      console.error(error);
      toast.error('Error creando proyecto');
    }
  };

  const filteredProjects = projects.filter((project) => {
    const text = `${project.titulo} ${project.descripcion || ''} ${project.owner?.nombre || ''}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <div className="p-6 text-gray-500">Cargando proyectos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isMine ? 'Mis Proyectos' : 'Proyectos'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isMine
              ? 'Consulta y administra los proyectos que creaste'
              : 'Explora proyectos visibles para tu tipo de cuenta'}
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proyecto
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Proyecto</DialogTitle>
              <DialogDescription>Completa la información inicial del proyecto</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input value={titulo} onChange={(event) => setTitulo(event.target.value)} placeholder="Mi Proyecto" />
              </div>

              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea value={descripcion} onChange={(event) => setDescripcion(event.target.value)} placeholder="Describe el proyecto" />
              </div>

              <div className="space-y-2">
                <Label>Visibilidad</Label>
                <Select value={visibilidad} onValueChange={(value) => setVisibilidad(value as ProjectVisibility)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="publico">Público</SelectItem>
                    <SelectItem value="privado">Privado</SelectItem>
                    <SelectItem value="solo_empresas">Solo Empresas</SelectItem>
                    <SelectItem value="solo_instituciones">Solo Instituciones</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>URL Imagen</Label>
                <Input value={imagen} onChange={(event) => setImagen(event.target.value)} placeholder="https://..." />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateProject}>
                Crear Proyecto
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar proyectos..."
              className="pl-10"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-gray-500">
            {isMine ? 'Aún no tienes proyectos creados.' : 'No hay proyectos disponibles para tu usuario.'}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              {project.imagen && (
                <img src={project.imagen} alt={project.titulo} className="w-full h-48 object-cover" />
              )}

              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <Badge>{project.estado}</Badge>
                  <Badge variant="outline">{visibilityLabels[project.visibilidad]}</Badge>
                </div>
                <CardTitle>{project.titulo}</CardTitle>
                <CardDescription>{project.descripcion}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Propietario: {project.owner?.nombre || (project.owner_id === user?.id ? 'Tú' : 'Usuario')}</p>
                  <p>Archivos: disponibles en el detalle del proyecto</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>
                    Creado: {new Date(project.fecha_creacion).toLocaleDateString('es-ES')}
                  </span>
                </div>

                <div className="pt-4 border-t flex justify-end">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/projects/${project.id}`}>
                      {project.imagen ? (
                        <ImageIcon className="mr-2 h-4 w-4" />
                      ) : (
                        <Eye className="mr-2 h-4 w-4" />
                      )}
                      Ver Proyecto
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
