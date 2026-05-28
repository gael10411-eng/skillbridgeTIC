const path = require('path');
const supabase = require('../config/supabaseClient');

const PROJECT_FILES_BUCKET = process.env.PROJECT_FILES_BUCKET || 'project-files';

function canViewProject(project, viewerId, viewerRole) {
  if (project.owner_id === Number(viewerId)) {
    return true;
  }

  if (project.visibilidad === 'publico') {
    return true;
  }

  if (project.visibilidad === 'solo_empresas') {
    return ['empresa', 'admin'].includes(viewerRole);
  }

  if (project.visibilidad === 'solo_instituciones') {
    return ['institucion', 'admin'].includes(viewerRole);
  }

  return false;
}

async function createProject(req, res) {
  try {
    const {
      titulo,
      descripcion,
      owner_id,
      visibilidad,
      estado,
      imagen
    } = req.body;

    if (!titulo || !owner_id) {
      return res.status(400).json({
        success: false,
        error: 'Titulo y owner_id son obligatorios'
      });
    }

    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          titulo,
          descripcion,
          owner_id,
          visibilidad: visibilidad || 'privado',
          estado: estado || 'activo',
          imagen: imagen || null
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ success: true, project: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getProjects(req, res) {
  try {
    const { scope, viewer_id, viewer_role } = req.query;

    let query = supabase
      .from('projects')
      .select(`
        *,
        owner:users!projects_owner_id_fkey (
          id,
          nombre,
          email,
          rol,
          avatar
        )
      `)
      .order('fecha_creacion', { ascending: false });

    if (scope === 'mine') {
      if (!viewer_id) {
        return res.status(400).json({ error: 'viewer_id es requerido para mis proyectos' });
      }

      query = query.eq('owner_id', viewer_id);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const projects = scope === 'mine'
      ? data || []
      : (data || []).filter((project) =>
          canViewProject(project, viewer_id, viewer_role)
        );

    return res.json(projects);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getProjectById(req, res) {
  try {
    const { id } = req.params;
    const { viewer_id, viewer_role } = req.query;

    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        *,
        owner:users!projects_owner_id_fkey (
          id,
          nombre,
          email,
          rol,
          avatar
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!project) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    if (!canViewProject(project, viewer_id, viewer_role)) {
      return res.status(403).json({ error: 'No tienes acceso a este proyecto' });
    }

    const { data: files, error: filesError } = await supabase
      .from('project_files')
      .select('*')
      .eq('project_id', id)
      .order('fecha_creacion', { ascending: false });

    return res.json({
      ...project,
      files: filesError ? [] : files || [],
      filesWarning: filesError ? filesError.message : null
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function uploadProjectFile(req, res) {
  try {
    const { id } = req.params;
    const {
      user_id,
      nombre,
      tipo_mime,
      tamano,
      contenido_base64
    } = req.body;

    if (!nombre || !tipo_mime || !contenido_base64) {
      return res.status(400).json({ error: 'Archivo requerido' });
    }

    if (!user_id) {
      return res.status(400).json({ error: 'user_id es requerido' });
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, owner_id')
      .eq('id', id)
      .maybeSingle();

    if (projectError) {
      return res.status(500).json({ error: projectError.message });
    }

    if (!project) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    if (project.owner_id !== Number(user_id)) {
      return res.status(403).json({ error: 'Solo el propietario puede subir archivos' });
    }

    const fileBuffer = Buffer.from(contenido_base64, 'base64');

    if (fileBuffer.length > 25 * 1024 * 1024) {
      return res.status(400).json({ error: 'El archivo no puede superar 25 MB' });
    }

    const extension = path.extname(nombre);
    const safeName = nombre
      .replace(extension, '')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .slice(0, 80);
    const storagePath = `${id}/${Date.now()}-${safeName}${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(PROJECT_FILES_BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: tipo_mime,
        upsert: false
      });

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message });
    }

    const { data: publicUrlData } = supabase.storage
      .from(PROJECT_FILES_BUCKET)
      .getPublicUrl(storagePath);

    const { data, error } = await supabase
      .from('project_files')
      .insert([
        {
          project_id: id,
          user_id,
          nombre,
          tipo_mime,
          tamano: tamano || fileBuffer.length,
          storage_path: storagePath,
          url: publicUrlData.publicUrl
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ success: true, file: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  uploadProjectFile
};