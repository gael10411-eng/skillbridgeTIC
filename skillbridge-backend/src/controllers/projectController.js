const createProject = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      owner_id,
      visibilidad,
      estado,
      imagen
    } = req.body;

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

    res.json({ success: true, project: data });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// OBTENER PROYECTOS
const getProjects = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createProject,
  getProjects
};