import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Download, FileText, Upload } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useAuth } from '../context/AuthContext';
import {
  getProject,
  uploadProjectFile,
  type Project,
  type ProjectFile
} from '../../services/projectService';

export function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const isOwner = project?.owner_id === user?.id;

  useEffect(() => {
    fetchProject();
  }, [id, user?.id, user?.rol]);

  const fetchProject = async () => {
    if (!id) {
      return;
    }

    try {
      setLoading(true);
      const data = await getProject(id, {
        id: user?.id,
        rol: user?.rol
      });
      setProject(data);
    } catch (error) {
      console.error(error);
      toast.error('No se pudo cargar el proyecto');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !project || !user?.id) {
      return;
    }

    setUploading(true);

    try {
      const uploadedFile = await uploadProjectFile(project.id, user.id, file);
      setProject({
        ...project,
        files: [uploadedFile, ...(project.files || [])]
      });
      toast.success('Archivo subido correctamente');
    } catch (error) {
      console.error(error);
      toast.error('No se pudo subir el archivo');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const formatFileSize = (file: ProjectFile) => {
    if (!file.tamano) {
      return 'Sin tamaño';
    }

    if (file.tamano < 1024 * 1024) {
      return `${Math.round(file.tamano / 1024)} KB`;
    }

    return `${(file.tamano / 1024 / 1024).toFixed(1)} MB`;
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Cargando proyecto...</div>;
  }

  if (!project) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-gray-500">
          No se pudo cargar el proyecto.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button asChild variant="outline">
          <Link to="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a proyectos
          </Link>
        </Button>

        {isOwner && (
          <Button asChild variant="outline">
            <Link to="/my-projects">Mis Proyectos</Link>
          </Button>
        )}
      </div>

      <Card className="overflow-hidden">
        {project.imagen && (
          <img src={project.imagen} alt={project.titulo} className="w-full h-64 object-cover" />
        )}
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{project.estado}</Badge>
            <Badge variant="outline">{project.visibilidad}</Badge>
            {isOwner && <Badge variant="secondary">Propietario</Badge>}
          </div>
          <CardTitle className="text-3xl">{project.titulo}</CardTitle>
          <CardDescription>{project.descripcion || 'Sin descripción'}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 space-y-2">
          <p>Propietario: {project.owner?.nombre || 'Usuario'}</p>
          <p className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Creado: {new Date(project.fecha_creacion).toLocaleDateString('es-ES')}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Archivos del Proyecto</CardTitle>
          <CardDescription>
            Puedes adjuntar imágenes, documentos, PDFs, HTML, TXT y otros archivos necesarios para el proyecto.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isOwner && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border p-4">
              <Upload className="h-5 w-5 text-indigo-600" />
              <Input
                type="file"
                onChange={handleFileChange}
                disabled={uploading}
                accept=".png,.jpg,.jpeg,.gif,.webp,.pdf,.doc,.docx,.txt,.html,.css,.js,.ts,.tsx,.zip,.csv,.xlsx"
              />
              <span className="text-sm text-gray-500">
                {uploading ? 'Subiendo...' : 'Máximo 25 MB'}
              </span>
            </div>
          )}

          {!project.files || project.files.length === 0 ? (
            <p className="text-sm text-gray-500">Este proyecto aún no tiene archivos.</p>
          ) : (
            <div className="space-y-3">
              {project.files.map((file) => (
                <div key={file.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{file.nombre}</p>
                      <p className="text-xs text-gray-500">{file.tipo_mime} • {formatFileSize(file)}</p>
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm">
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Abrir
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
