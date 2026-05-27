const certificationsModel = require('../models/certificationsModel');

// ========================
// GET ALL CERTIFICATIONS
// ========================
async function getCertifications(req, res) {
  try {
    const certifications = await certificationsModel.getAllCertifications();
    res.json(certifications);
  } catch (err) {
    console.error('Error fetching certifications:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// GET CERTIFICATION BY ID
// ========================
async function getCertificationById(req, res) {
  try {
    const { id } = req.params;
    const certification = await certificationsModel.getCertificationById(id);

    if (!certification) {
      return res.status(404).json({ error: 'Certificación no encontrada' });
    }

    res.json(certification);
  } catch (err) {
    console.error('Error fetching certification:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// GET USER'S EARNED CERTIFICATIONS
// ========================
async function getUserEarnedCertifications(req, res) {
  try {
    const { userId } = req.params;
    const earnedCerts = await certificationsModel.getUserEarnedCertifications(userId);

    res.json(earnedCerts);
  } catch (err) {
    console.error('Error fetching earned certifications:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// CREATE EARNED CERTIFICATION
// ========================
async function createEarnedCertification(req, res) {
  try {
    const { certification_id, credential_id, verification_url } = req.body;
    const userId = req.user.id;

    // Validar campos requeridos
    if (!certification_id) {
      return res.status(400).json({
        error: 'certification_id es requerido'
      });
    }

    const earnedCert = await certificationsModel.createEarnedCertification(
      userId,
      certification_id,
      credential_id,
      verification_url
    );

    res.status(201).json({
      success: true,
      message: 'Certificación obtenida exitosamente',
      earnedCertification: earnedCert
    });
  } catch (err) {
    console.error('Error creating earned certification:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// DELETE EARNED CERTIFICATION
// ========================
async function deleteEarnedCertification(req, res) {
  try {
    const { id } = req.params;

    // Verificar que existe
    const earnedCerts = await certificationsModel.getUserEarnedCertifications(req.user.id);
    const earnedCert = earnedCerts.find(ec => ec.id === parseInt(id));

    if (!earnedCert) {
      return res.status(404).json({ error: 'Certificación no encontrada' });
    }

    const deleted = await certificationsModel.deleteEarnedCertification(id);

    res.json({
      success: true,
      message: 'Certificación eliminada exitosamente',
      earnedCertification: deleted
    });
  } catch (err) {
    console.error('Error deleting earned certification:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getCertifications,
  getCertificationById,
  getUserEarnedCertifications,
  createEarnedCertification,
  deleteEarnedCertification
};
