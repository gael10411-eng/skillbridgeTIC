import { useEffect, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../components/ui/card';

import { Button } from '../components/ui/button';

import { Input } from '../components/ui/input';

import { Label } from '../components/ui/label';

import { Textarea } from '../components/ui/textarea';

import { Badge } from '../components/ui/badge';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select';

import {
  Plus,
  Search,
  Clock,
  Trash2,
  Edit,
  AlertCircle
} from 'lucide-react';

import { toast } from 'sonner';

import * as projectService from '../services/projectService';

interface Project {
  id: number;
  titulo: string;
  descripcion: string;
  owner_id: number;
  visibilidad: 'publico' | 'privado' | 'solo_empresas' | 'solo_instituciones';
  estado: 'activo' | 'cerrado';
  imagen?: string;
  fecha_creacion: string;
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  // FORM
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [visibilidad, setVisibilidad] = useState('privado');
  const [imagen, setImagen] = useState('');

  // CARGAR PROYECTOS
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error(error);
      toast.error('Error cargando proyectos');
    } finally {
      setLoading(false);
    }
  };

  // LIMPIAR FORMULARIO
  const clearForm = () => {
    setTitulo('');
    setDescripcion('');
    setVisibilidad('privado');
    setImagen('');
    setEditingProjectId(null);
  };

  // CREAR PROYECTO
  const handleCreateProject = async () => {
    try {
      if (!titulo.trim() || !descripcion.trim()) {
        toast.error('Completa todos los campos requeridos');
        return;
      }

      // NOTA: owner_id debe venir del usuario autenticado
      // Por ahora usamos 1, pero deberías obtenerlo del contexto de autenticación
      const ownerIdFromAuth = 1;

      const newProject = await projectService.createProject({
        titulo,
        descripcion,
        owner_id: ownerIdFromAuth,
        visibilidad: visibilidad as any,
        imagen: imagen || undefined
      });

      toast.success('Proyecto creado exitosamente');
      setProjects([newProject, ...projects]);
      clearForm();
      setIsCreateDialogOpen(false);

    } catch (error) {
      console.error(error);
      toast.error('Error creando proyecto');
    }
  };

  // ACTUALIZAR PROYECTO
  const handleUpdateProject = async (projectId: number) => {
    try {
      if (!titulo.trim() || !descripcion.trim()) {
        toast.error('Completa todos los campos requeridos');
        return;
      }

      const updatedProject = await projectService.updateProject(projectId, {
        titulo,
        descripcion,
        visibilidad: visibilidad as any,
        imagen: imagen || undefined
      });

      setProjects(projects.map(p => p.id === projectId ? updatedProject : p));
      toast.success('Proyecto actualizado exitosamente');
      clearForm();
      setIsCreateDialogOpen(false);

    } catch (error) {
      console.error(error);
      toast.error('Error actualizando proyecto');
    }
  };

  // ELIMINAR PROYECTO
  const handleDeleteProject = async (projectId: number) => {
    try {
      if (!window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
        return;
      }

      await projectService.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      toast.success('Proyecto eliminado exitosamente');

    } catch (error) {
      console.error(error);
      toast.error('Error eliminando proyecto');
    }
  };

  // ABRIR DIÁLOGO PARA EDITAR
  const handleEditClick = (project: Project) => {
    setTitulo(project.titulo);
    setDescripcion(project.descripcion);
    setVisibilidad(project.visibilidad);
    setImagen(project.imagen || '');
    setEditingProjectId(project.id);
    setIsCreateDialogOpen(true);
  };

  // CERRAR DIÁLOGO
  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    clearForm();
  };

  // FILTRAR
  const filteredProjects = projects.filter(
    (project) =>
      project.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // LOADING
  if (loading) {
    return <div className="p-6">Cargando proyectos...</div>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Proyectos</h1>
          <p className="text-gray-600 mt-1">Gestiona tus proyectos</p>
        </div>

        {/* DIALOG */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proyecto
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProjectId ? 'Editar Proyecto' : 'Crear Proyecto'}
              </DialogTitle>
              <DialogDescription>
                Completa la información
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* TITULO */}
              <div className="space-y-2">
                <Label>Título *</Label>
                <Input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Mi Proyecto"
                />
              </div>

              {/* DESCRIPCION */}
              <div className="space-y-2">
                <Label>Descripción *</Label>
                <Textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describe el proyecto"
                />
              </div>

              {/* VISIBILIDAD */}
              <div className="space-y-2">
                <Label>Visibilidad</Label>
                <Select value={visibilidad} onValueChange={setVisibilidad}>
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

              {/* IMAGEN */}
              <div className="space-y-2">
                <Label>URL Imagen</Label>
                <Input
                  value={imagen}
                  onChange={(e) => setImagen(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>

              <Button
                onClick={() =>
                  editingProjectId
                    ? handleUpdateProject(editingProjectId)
                    : handleCreateProject()
                }
              >
                {editingProjectId ? 'Actualizar' : 'Crear'} Proyecto
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* SEARCH */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar proyectos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* PROYECTOS */}
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-center">No hay proyectos aún</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              {/* IMAGEN */}
              {project.imagen && (
                <img
                  src={project.imagen}
                  alt={project.titulo}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}

              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge>{project.estado}</Badge>
                  <Badge variant="outline">{project.visibilidad}</Badge>
                </div>
                <CardTitle>{project.titulo}</CardTitle>
                <CardDescription>{project.descripcion}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* FECHA */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>
                    Creado:{' '}
                    {new Date(project.fecha_creacion).toLocaleDateString('es-ES')}
                  </span>
                </div>

                {/* FOOTER */}
                <div className="pt-4 border-t flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(project)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
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