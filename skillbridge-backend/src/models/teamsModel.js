const supabase = require('../config/supabaseClient');

// ========================
// GET ALL TEAMS
// ========================
async function getAllTeams() {
  const { data, error } = await supabase
    .from('teams')
    .select(`
      id,
      project_id,
      nombre,
      members:team_members(
        id,
        user_id,
        rol_en_equipo,
        users:user_id(id, nombre, email, avatar)
      ),
      projects:project_id(id, titulo, descripcion)
    `)
    .order('nombre', { ascending: true });

  if (error) throw error;
  return data;
}

// ========================
// GET TEAM BY ID
// ========================
async function getTeamById(teamId) {
  const { data, error } = await supabase
    .from('teams')
    .select(`
      id,
      project_id,
      nombre,
      members:team_members(
        id,
        user_id,
        rol_en_equipo,
        users:user_id(id, nombre, email, avatar)
      ),
      projects:project_id(id, titulo, descripcion)
    `)
    .eq('id', teamId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
}

// ========================
// GET TEAMS BY PROJECT
// ========================
async function getTeamsByProject(projectId) {
  const { data, error } = await supabase
    .from('teams')
    .select(`
      id,
      project_id,
      nombre,
      members:team_members(
        id,
        user_id,
        rol_en_equipo,
        users:user_id(id, nombre, email, avatar)
      )
    `)
    .eq('project_id', projectId);

  if (error) throw error;
  return data;
}

// ========================
// CREATE TEAM
// ========================
async function createTeam(projectId, nombre) {
  const { data, error } = await supabase
    .from('teams')
    .insert([
      {
        project_id: projectId,
        nombre
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ========================
// UPDATE TEAM
// ========================
async function updateTeam(teamId, updates) {
  const { data, error } = await supabase
    .from('teams')
    .update(updates)
    .eq('id', teamId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ========================
// DELETE TEAM
// ========================
async function deleteTeam(teamId) {
  // Primero eliminar todos los miembros del equipo
  await supabase
    .from('team_members')
    .delete()
    .eq('team_id', teamId);

  // Luego eliminar el equipo
  const { data, error } = await supabase
    .from('teams')
    .delete()
    .eq('id', teamId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ========================
// ADD TEAM MEMBER
// ========================
async function addTeamMember(teamId, userId, rolEnEquipo) {
  const { data, error } = await supabase
    .from('team_members')
    .insert([
      {
        team_id: teamId,
        user_id: userId,
        rol_en_equipo: rolEnEquipo || 'miembro'
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ========================
// UPDATE TEAM MEMBER ROLE
// ========================
async function updateTeamMemberRole(teamMemberId, nuevoRol) {
  const { data, error } = await supabase
    .from('team_members')
    .update({ rol_en_equipo: nuevoRol })
    .eq('id', teamMemberId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ========================
// REMOVE TEAM MEMBER
// ========================
async function removeTeamMember(teamMemberId) {
  const { data, error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', teamMemberId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

module.exports = {
  getAllTeams,
  getTeamById,
  getTeamsByProject,
  createTeam,
  updateTeam,
  deleteTeam,
  addTeamMember,
  updateTeamMemberRole,
  removeTeamMember
};
