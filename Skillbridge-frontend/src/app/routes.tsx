import api from '../services/api';
export type ProjectVisibility =
  | 'publico'
  | 'privado'
  | 'solo_empresas'
  | 'solo_instituciones';

export type ProjectStatus = 'activo' | 'cerrado';

export interface ProjectOwner {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  avatar?: string | null;
}

export interface ProjectFile {
  id: number;
  project_id: number;
  user_id: number;
  nombre: string;
  tipo_mime: string;
  tamano: number;
  storage_path: string;
  url: string;
  fecha_creacion: string;
}

export interface Project {
  id: number;
  titulo: string;
  descripcion: string;
  owner_id: number;
  owner?: ProjectOwner;
  visibilidad: ProjectVisibility;
  estado: ProjectStatus;
  imagen?: string | null;
  fecha_creacion: string;
  files?: ProjectFile[];
}

export interface ProjectViewer {
  id?: number;
  rol?: string;
}

export interface CreateProjectPayload {
  titulo: string;
  descripcion: string;
  owner_id: number;
  visibilidad?: ProjectVisibility;
  estado?: ProjectStatus;
  imagen?: string;
}

export async function getProjects(
  viewer: ProjectViewer,
  scope: 'explore' | 'mine' = 'explore'
): Promise<Project[]> {
  const response = await api.get('/projects', {
    params: {
      scope,
      viewer_id: viewer.id,
      viewer_role: viewer.rol
    }
  });

  return response.data;
}

export async function getProject(
  id: string,
  viewer: ProjectViewer
): Promise<Project> {
  const response = await api.get(`/projects/${id}`, {
    params: {
      viewer_id: viewer.id,
      viewer_role: viewer.rol
    }
  });

  return response.data;
}

export async function createProject(
  payload: CreateProjectPayload
): Promise<Project> {
  const response = await api.post('/projects', payload);
  return response.data.project;
}

export async function uploadProjectFile(
  projectId: number,
  userId: number,
  file: File
): Promise<ProjectFile> {
  const contenido_base64 = await fileToBase64(file);

  const response = await api.post(`/projects/${projectId}/files`, {
    user_id: userId,
    nombre: file.name,
    tipo_mime: file.type || 'application/octet-stream',
    tamano: file.size,
    contenido_base64
  });

  return response.data.file;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result || '');
      resolve(result.split(',')[1] || '');
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
