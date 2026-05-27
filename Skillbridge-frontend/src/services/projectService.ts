import api from './api';

export type ProjectVisibility =
  | 'publico'
  | 'privado'
  | 'solo_empresas'
  | 'solo_instituciones';

export type ProjectStatus =
  | 'activo'
  | 'cerrado';

export interface Project {
  id: number;
  titulo: string;
  descripcion: string;
  owner_id: number;
  visibilidad: ProjectVisibility;
  estado: ProjectStatus;
  imagen?: string | null;
  fecha_creacion: string;
}

export interface CreateProjectPayload {
  titulo: string;
  descripcion: string;
  owner_id: number;
  visibilidad?: ProjectVisibility;
  estado?: ProjectStatus;
  imagen?: string;
}

export async function getProjects(): Promise<Project[]> {
  const response = await api.get('/projects');
  return response.data;
}

export async function createProject(
  payload: CreateProjectPayload
): Promise<Project> {
  const response = await api.post('/projects', payload);
  return response.data.project;
}