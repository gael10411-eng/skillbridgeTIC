const projectsModel = require('../models/projectsModel');

// ========================
// GET ALL PROJECTS
// ========================
async function getProjects(req, res) {
  try {
    const projects = await projectsModel.getAllProjects();
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// GET PROJECT BY ID
// ========================
async function getProjectById(req, res) {
  try {
    const { id } = req.params;
    const project = await projectsModel.getProjectById(id);

    if (!project) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json(project);
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// CREATE PROJECT
// ========================
async function createProject(req, res) {
  try {
    const { titulo, descripcion, owner_id, visibilidad, imagen } = req.body;

    // Validar campos requeridos
    if (!titulo || !descripcion || !owner_id) {
      return res.status(400).json({
        error: 'Título, descripción y owner_id son requeridos'
      });
    }

    // Validar visibilidad
    const validVisibilidades = ['publico', 'privado', 'solo_empresas', 'solo_instituciones'];
    if (visibilidad && !validVisibilidades.includes(visibilidad)) {
      return res.status(400).json({
        error: 'Visibilidad inválida'
      });
    }

    const project = await projectsModel.createProject(
      titulo,
      descripcion,
      owner_id,
      visibilidad,
      imagen
    );

    res.status(201).json({
      success: true,
      message: 'Proyecto creado exitosamente',
      project
    });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// UPDATE PROJECT
// ========================
async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const { titulo, descripcion, visibilidad, estado, imagen } = req.body;

    // Verificar que el proyecto existe
    const existingProject = await projectsModel.getProjectById(id);
    if (!existingProject) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    // Preparar actualizaciones (solo enviar lo que venga)
    const updates = {};
    if (titulo) updates.titulo = titulo;
    if (descripcion) updates.descripcion = descripcion;
    if (visibilidad) updates.visibilidad = visibilidad;
    if (estado) updates.estado = estado;
    if (imagen !== undefined) updates.imagen = imagen;

    // Validar visibilidad si se proporciona
    if (visibilidad) {
      const validVisibilidades = ['publico', 'privado', 'solo_empresas', 'solo_instituciones'];
      if (!validVisibilidades.includes(visibilidad)) {
        return res.status(400).json({
          error: 'Visibilidad inválida'
        });
      }
    }

    // Validar estado si se proporciona
    if (estado) {
      const validEstados = ['activo', 'cerrado'];
      if (!validEstados.includes(estado)) {
        return res.status(400).json({
          error: 'Estado inválido'
        });
      }
    }

    const updatedProject = await projectsModel.updateProject(id, updates);

    res.json({
      success: true,
      message: 'Proyecto actualizado exitosamente',
      project: updatedProject
    });
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// DELETE PROJECT
// ========================
async function deleteProject(req, res) {
  try {
    const { id } = req.params;

    // Verificar que el proyecto existe
    const existingProject = await projectsModel.getProjectById(id);
    if (!existingProject) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    const deletedProject = await projectsModel.deleteProject(id);

    res.json({
      success: true,
      message: 'Proyecto eliminado exitosamente',
      project: deletedProject
    });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// GET PROJECTS BY OWNER
// ========================
async function getProjectsByOwner(req, res) {
  try {
    const { ownerId } = req.params;
    const projects = await projectsModel.getProjectsByOwner(ownerId);

    res.json(projects);
  } catch (err) {
    console.error('Error fetching owner projects:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getProjects,
  getProjectById,
  getProjectsByOwner,
  createProject,
  updateProject,
  deleteProject
};