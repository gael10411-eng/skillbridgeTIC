const supabase = require('../config/supabaseClient');

// ========================
// GET ALL PROJECTS
// ========================
async function getAllProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('fecha_creacion', { ascending: false });

  if (error) throw error;
  return data;
}

// ========================
// GET PROJECT BY ID
// ========================
async function getProjectById(projectId) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
}

// ========================
// GET PROJECTS BY OWNER
// ========================
async function getProjectsByOwner(ownerId) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('owner_id', ownerId)
    .order('fecha_creacion', { ascending: false });

  if (error) throw error;
  return data;
}

// ========================
// CREATE PROJECT
// ========================
async function createProject(titulo, descripcion, owner_id, visibilidad, imagen) {
  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        titulo,
        descripcion,
        owner_id,
        visibilidad: visibilidad || 'privado',
        estado: 'activo',
        imagen: imagen || null,
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString()
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ========================
// UPDATE PROJECT
// ========================
async function updateProject(projectId, updates) {
  const { data, error } = await supabase
    .from('projects')
    .update({
      ...updates,
      fecha_actualizacion: new Date().toISOString()
    })
    .eq('id', projectId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ========================
// DELETE PROJECT
// ========================
async function deleteProject(projectId) {
  const { data, error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

module.exports = {
  getAllProjects,
  getProjectById,
  getProjectsByOwner,
  createProject,
  updateProject,
  deleteProject
};
