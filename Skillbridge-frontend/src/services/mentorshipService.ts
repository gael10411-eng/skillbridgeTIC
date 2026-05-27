import api from './api';

// ========================
// MENTOR TYPES
// ========================
export interface Mentor {
  id: number;
  nombre: string;
  titulo: string;
  bio: string;
  avatar?: string;
  rating: number;
  reviews: number;
  availability: string;
  sessions: number;
  user_id: number;
}

// ========================
// MENTORSHIP TYPES
// ========================
export interface Mentorship {
  id: number;
  mentor_id: number;
  student_id: number;
  tema: string;
  descripcion: string;
  fecha: string;
  hora: string;
  duracion: number;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  tipo: 'virtual' | 'presencial';
  notas?: string;
  feedback?: string;
  rating?: number;
  fecha_creacion: string;
  mentors?: Mentor;
}

export interface CreateMentorshipDTO {
  mentor_id: number;
  student_id: number;
  tema: string;
  descripcion?: string;
  fecha: string;
  hora: string;
  duracion?: number;
  tipo?: 'virtual' | 'presencial';
}

export interface UpdateMentorshipDTO {
  estado?: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  notas?: string;
  feedback?: string;
  rating?: number;
  tipo?: 'virtual' | 'presencial';
  fecha?: string;
  hora?: string;
  duracion?: number;
}

// ========================
// GET ALL MENTORS
// ========================
export async function getAllMentors(): Promise<Mentor[]> {
  try {
    const response = await api.get('/mentors');
    return response.data;
  } catch (error) {
    console.error('Error fetching mentors:', error);
    throw error;
  }
}

// ========================
// GET MENTOR BY ID
// ========================
export async function getMentorById(mentorId: number): Promise<Mentor> {
  try {
    const response = await api.get(`/mentors/${mentorId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching mentor ${mentorId}:`, error);
    throw error;
  }
}

// ========================
// GET ALL MENTORSHIPS
// ========================
export async function getAllMentorships(): Promise<Mentorship[]> {
  try {
    const response = await api.get('/mentorships');
    return response.data;
  } catch (error) {
    console.error('Error fetching mentorships:', error);
    throw error;
  }
}

// ========================
// GET MENTORSHIPS BY STUDENT
// ========================
export async function getMentorshipsByStudent(studentId: number): Promise<Mentorship[]> {
  try {
    const response = await api.get(`/mentorships/student/${studentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching student mentorships ${studentId}:`, error);
    throw error;
  }
}

// ========================
// GET MENTORSHIPS BY MENTOR
// ========================
export async function getMentorshipsByMentor(mentorId: number): Promise<Mentorship[]> {
  try {
    const response = await api.get(`/mentorships/mentor/${mentorId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching mentor mentorships ${mentorId}:`, error);
    throw error;
  }
}

// ========================
// GET MENTORSHIP BY ID
// ========================
export async function getMentorshipById(mentorshipId: number): Promise<Mentorship> {
  try {
    const response = await api.get(`/mentorships/${mentorshipId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching mentorship ${mentorshipId}:`, error);
    throw error;
  }
}

// ========================
// CREATE MENTORSHIP
// ========================
export async function createMentorship(mentorshipData: CreateMentorshipDTO): Promise<Mentorship> {
  try {
    const response = await api.post('/mentorships', mentorshipData);
    return response.data.mentorship;
  } catch (error) {
    console.error('Error creating mentorship:', error);
    throw error;
  }
}

// ========================
// UPDATE MENTORSHIP
// ========================
export async function updateMentorship(mentorshipId: number, updates: UpdateMentorshipDTO): Promise<Mentorship> {
  try {
    const response = await api.put(`/mentorships/${mentorshipId}`, updates);
    return response.data.mentorship;
  } catch (error) {
    console.error(`Error updating mentorship ${mentorshipId}:`, error);
    throw error;
  }
}

// ========================
// DELETE MENTORSHIP
// ========================
export async function deleteMentorship(mentorshipId: number): Promise<void> {
  try {
    await api.delete(`/mentorships/${mentorshipId}`);
  } catch (error) {
    console.error(`Error deleting mentorship ${mentorshipId}:`, error);
    throw error;
  }
}
