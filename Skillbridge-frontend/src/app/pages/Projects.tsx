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
  Image as ImageIcon
} from 'lucide-react';

import { toast } from 'sonner';

interface Project {

  id: number;

  titulo: string;

  descripcion: string;

  owner_id: number;

  visibilidad:
    | 'publico'
    | 'privado'
    | 'solo_empresas'
    | 'solo_instituciones';

  estado:
    | 'activo'
    | 'cerrado';

  imagen?: string;

  fecha_creacion: string;

  // TEMPORALES
  progreso?: string;
  tareas?: string;
}

export function Projects() {

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [searchTerm, setSearchTerm] =
    useState('');

  const [isCreateDialogOpen, setIsCreateDialogOpen] =
    useState(false);

  // FORM
  const [titulo, setTitulo] =
    useState('');

  const [descripcion, setDescripcion] =
    useState('');

  const [visibilidad, setVisibilidad] =
    useState('privado');

  const [imagen, setImagen] =
    useState('');

  // CARGAR PROYECTOS
  useEffect(() => {

    fetchProjects();

  }, []);

  const fetchProjects = async () => {

    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/projects`
      );

      const data = await response.json();

      // AGREGAMOS DATOS TEMPORALES
      const formattedProjects = data.map(
        (project: Project) => ({
          ...project,
          progreso: 'No disponible aún',
          tareas: 'No disponible aún',
        })
      );

      setProjects(formattedProjects);

    } catch (error) {

      console.error(error);

      toast.error(
        'Error cargando proyectos'
      );

    } finally {

      setLoading(false);
    }
  };

  // CREAR PROYECTO
  const handleCreateProject = async () => {

    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/projects`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            titulo,
            descripcion,
            visibilidad,
            imagen,
          }),
        }
      );

      if (!response.ok) {

        throw new Error(
          'Error creando proyecto'
        );
      }

      toast.success(
        'Proyecto creado exitosamente'
      );

      setTitulo('');
      setDescripcion('');
      setImagen('');

      setIsCreateDialogOpen(false);

      fetchProjects();

    } catch (error) {

      console.error(error);

      toast.error(
        'Error creando proyecto'
      );
    }
  };

  // FILTRAR
  const filteredProjects = projects.filter(
    (project) =>
      project.titulo
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        ) ||

      project.descripcion
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
  );

  // LOADING
  if (loading) {

    return (

      <div className="p-6">
        Cargando proyectos...
      </div>
    );
  }

  return (

    <div className="space-y-6">

      {/* HEADER */}
      <div className="
        flex
        flex-col
        sm:flex-row
        sm:items-center
        sm:justify-between
        gap-4
      ">

        <div>

          <h1 className="
            text-3xl
            font-bold
            text-gray-900
          ">
            Proyectos
          </h1>

          <p className="
            text-gray-600
            mt-1
          ">
            Gestiona tus proyectos
          </p>

        </div>

        {/* DIALOG */}
        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={
            setIsCreateDialogOpen
          }
        >

          <DialogTrigger asChild>

            <Button>

              <Plus className="
                mr-2
                h-4
                w-4
              " />

              Nuevo Proyecto

            </Button>

          </DialogTrigger>

          <DialogContent>

            <DialogHeader>

              <DialogTitle>
                Crear Proyecto
              </DialogTitle>

              <DialogDescription>
                Completa la información
              </DialogDescription>

            </DialogHeader>

            <div className="
              space-y-4
              py-4
            ">

              {/* TITULO */}
              <div className="
                space-y-2
              ">

                <Label>
                  Título
                </Label>

                <Input
                  value={titulo}
                  onChange={(e) =>
                    setTitulo(
                      e.target.value
                    )
                  }
                  placeholder="
                    Mi Proyecto
                  "
                />

              </div>

              {/* DESCRIPCION */}
              <div className="
                space-y-2
              ">

                <Label>
                  Descripción
                </Label>

                <Textarea
                  value={descripcion}
                  onChange={(e) =>
                    setDescripcion(
                      e.target.value
                    )
                  }
                  placeholder="
                    Describe el proyecto
                  "
                />

              </div>

              {/* VISIBILIDAD */}
              <div className="
                space-y-2
              ">

                <Label>
                  Visibilidad
                </Label>

                <Select
                  value={visibilidad}
                  onValueChange={
                    setVisibilidad
                  }
                >

                  <SelectTrigger>

                    <SelectValue />

                  </SelectTrigger>

                  <SelectContent>

                    <SelectItem
                      value="publico"
                    >
                      Público
                    </SelectItem>

                    <SelectItem
                      value="privado"
                    >
                      Privado
                    </SelectItem>

                    <SelectItem
                      value="solo_empresas"
                    >
                      Solo Empresas
                    </SelectItem>

                    <SelectItem
                      value="solo_instituciones"
                    >
                      Solo Instituciones
                    </SelectItem>

                  </SelectContent>

                </Select>

              </div>

              {/* IMAGEN */}
              <div className="
                space-y-2
              ">

                <Label>
                  URL Imagen
                </Label>

                <Input
                  value={imagen}
                  onChange={(e) =>
                    setImagen(
                      e.target.value
                    )
                  }
                  placeholder="
                    https://...
                  "
                />

              </div>

            </div>

            <div className="
              flex
              justify-end
              gap-3
            ">

              <Button
                variant="outline"
                onClick={() =>
                  setIsCreateDialogOpen(
                    false
                  )
                }
              >
                Cancelar
              </Button>

              <Button
                onClick={
                  handleCreateProject
                }
              >
                Crear Proyecto
              </Button>

            </div>

          </DialogContent>

        </Dialog>

      </div>

      {/* SEARCH */}
      <Card>

        <CardContent className="
          pt-6
        ">

          <div className="
            relative
          ">

            <Search className="
              absolute
              left-3
              top-3
              h-4
              w-4
              text-gray-400
            " />

            <Input
              placeholder="
                Buscar proyectos...
              "
              className="
                pl-10
              "
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

          </div>

        </CardContent>

      </Card>

      {/* PROYECTOS */}
      <div className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
      ">

        {filteredProjects.map(
          (project) => (

            <Card
              key={project.id}
              className="
                hover:shadow-lg
                transition-shadow
              "
            >

              {/* IMAGEN */}
              {project.imagen && (

                <img
                  src={project.imagen}
                  alt={project.titulo}
                  className="
                    w-full
                    h-48
                    object-cover
                    rounded-t-lg
                  "
                />
              )}

              <CardHeader>

                <div className="
                  flex
                  items-center
                  justify-between
                ">

                  <Badge>

                    {project.estado}

                  </Badge>

                  <Badge
                    variant="outline"
                  >

                    {project.visibilidad}

                  </Badge>

                </div>

                <CardTitle>

                  {project.titulo}

                </CardTitle>

                <CardDescription>

                  {project.descripcion}

                </CardDescription>

              </CardHeader>

              <CardContent className="
                space-y-4
              ">

                {/* TEMPORAL */}
                <div className="
                  text-sm
                  text-gray-500
                  space-y-1
                ">

                  <p>
                    Progreso:
                    {' '}
                    {project.progreso}
                  </p>

                  <p>
                    Tareas:
                    {' '}
                    {project.tareas}
                  </p>

                </div>

                {/* FECHA */}
                <div className="
                  flex
                  items-center
                  gap-2
                  text-xs
                  text-gray-500
                ">

                  <Clock className="
                    h-3
                    w-3
                  " />

                  <span>

                    Creado:
                    {' '}

                    {new Date(
                      project.fecha_creacion
                    ).toLocaleDateString(
                      'es-ES'
                    )}

                  </span>

                </div>

                {/* FOOTER */}
                <div className="
                  pt-4
                  border-t
                  flex
                  justify-end
                ">

                  <Button
                    variant="outline"
                    size="sm"
                  >

                    <ImageIcon className="
                      mr-2
                      h-4
                      w-4
                    " />

                    Ver Proyecto

                  </Button>

                </div>

              </CardContent>

            </Card>
          )
        )}

      </div>

    </div>
  );
}