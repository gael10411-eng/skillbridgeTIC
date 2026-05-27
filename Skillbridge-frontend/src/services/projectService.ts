import api from './api';

// ========================
// PROJECT TYPES
// ========================
export interface Project {
  id: number;
  titulo: string;
  descripcion: string;
  owner_id: number;
  visibilidad: 'publico' | 'privado' | 'solo_empresas' | 'solo_instituciones';
  estado: 'activo' | 'cerrado';
  imagen?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface CreateProjectDTO {
  titulo: string;
  descripcion: string;
  owner_id: number;
  visibilidad?: 'publico' | 'privado' | 'solo_empresas' | 'solo_instituciones';
  imagen?: string;
}

export interface UpdateProjectDTO {
  titulo?: string;
  descripcion?: string;
  visibilidad?: 'publico' | 'privado' | 'solo_empresas' | 'solo_instituciones';
  estado?: 'activo' | 'cerrado';
  imagen?: string;
}

// ========================
// GET ALL PROJECTS
// ========================
export async function getAllProjects(): Promise<Project[]> {
  try {
    const response = await api.get('/projects');
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

// ========================
// GET PROJECT BY ID
// ========================
export async function getProjectById(projectId: number): Promise<Project> {
  try {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching project ${projectId}:`, error);
    throw error;
  }
}

// ========================
// GET PROJECTS BY OWNER
// ========================
export async function getProjectsByOwner(ownerId: number): Promise<Project[]> {
  try {
    const response = await api.get(`/projects/owner/${ownerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching owner projects ${ownerId}:`, error);
    throw error;
  }
}

// ========================
// CREATE PROJECT
// ========================
export async function createProject(projectData: CreateProjectDTO): Promise<Project> {
  try {
    const response = await api.post('/projects', projectData);
    return response.data.project;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

// ========================
// UPDATE PROJECT
// ========================
export async function updateProject(projectId: number, updates: UpdateProjectDTO): Promise<Project> {
  try {
    const response = await api.put(`/projects/${projectId}`, updates);
    return response.data.project;
  } catch (error) {
    console.error(`Error updating project ${projectId}:`, error);
    throw error;
  }
}

// ========================
// DELETE PROJECT
// ========================
export async function deleteProject(projectId: number): Promise<void> {
  try {
    await api.delete(`/projects/${projectId}`);
  } catch (error) {
    console.error(`Error deleting project ${projectId}:`, error);
    throw error;
  }
}
