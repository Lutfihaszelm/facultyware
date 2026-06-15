const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const { checkPermission } = require('../middlewares/acl');
const upload = require('../middlewares/upload');
const ctrl = require('../controllers/equipmentController');

// Export (sebelum /:id agar tidak conflict)
router.get('/export', isAuthenticated, checkPermission('equipments.export'), ctrl.exportData);

// Index + Search
router.get('/', isAuthenticated, checkPermission('equipments.view'), ctrl.index);

// Create
router.get('/create', isAuthenticated, checkPermission('equipments.create'), ctrl.create);
router.post('/', isAuthenticated, checkPermission('equipments.create'),
  upload.single('photo'), ctrl.validateEquipment, ctrl.store);

// Show
router.get('/:id', isAuthenticated, checkPermission('equipments.view'), ctrl.show);

// Edit
router.get('/:id/edit', isAuthenticated, checkPermission('equipments.edit'), ctrl.edit);
router.post('/:id', isAuthenticated, checkPermission('equipments.edit'),
  upload.single('photo'), ctrl.validateEquipment, ctrl.update);

// Delete
router.delete('/:id', isAuthenticated, checkPermission('equipments.delete'), ctrl.destroy);

module.exports = router;
