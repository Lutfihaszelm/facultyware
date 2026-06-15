const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const db = require('../lib/db');

// GET /api/equipments — JSON list dengan search
router.get('/equipments', isAuthenticated, async (req, res, next) => {
  try {
    const q = req.query.q || '';
    const conditionFilter = req.query.condition || '';
    const statusFilter = req.query.status || '';

    let where = `WHERE a.type = 'equipment'`;
    const params = [];

    if (q) {
      where += ` AND (a.name LIKE ? OR a.code LIKE ? OR e.brand LIKE ?)`;
      const like = `%${q}%`;
      params.push(like, like, like);
    }
    if (conditionFilter) { where += ` AND a.\`condition\` = ?`; params.push(conditionFilter); }
    if (statusFilter) { where += ` AND a.status = ?`; params.push(statusFilter); }

    const [rows] = await db.query(`
      SELECT a.id, a.name, a.code, a.condition, a.status,
        a.acquisition_date, a.acquisition_type,
        e.brand, e.model, e.photo
      FROM assets a
      JOIN equipments e ON e.asset_id = a.id
      ${where}
      ORDER BY a.name
      LIMIT 100
    `, params);

    res.json({ data: rows, count: rows.length });
  } catch (err) {
    next(err);
  }
});

// GET /api/equipments/:id — JSON detail
router.get('/equipments/:id', isAuthenticated, async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, e.brand, e.model, e.serial_number, e.specification,
        e.photo, e.purchase_link, e.depreciation_value, e.useful_life
      FROM assets a
      JOIN equipments e ON e.asset_id = a.id
      WHERE a.id = ? AND a.type = 'equipment'
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Aset tidak ditemukan' });
    }
    res.json({ data: rows[0] });
  } catch (err) {
    next(err);
  }
});

// GET /api/stats — Statistik ringkas
router.get('/stats', isAuthenticated, async (req, res, next) => {
  try {
    const [[{ total }]] = await db.query(`SELECT COUNT(*) AS total FROM assets WHERE type = 'equipment'`);
    const [conditionStats] = await db.query(`
      SELECT \`condition\`, COUNT(*) AS count FROM assets WHERE type = 'equipment' GROUP BY \`condition\`
    `);
    const [statusStats] = await db.query(`
      SELECT status, COUNT(*) AS count FROM assets WHERE type = 'equipment' GROUP BY status
    `);

    res.json({
      data: {
        total_equipments: total,
        by_condition: conditionStats,
        by_status: statusStats,
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
