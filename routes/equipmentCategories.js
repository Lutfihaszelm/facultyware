const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const { checkPermission } = require('../middlewares/acl');
const ctrl = require('../controllers/equipmentCategoryController');

// Export (sebelum /:id agar tidak conflict)
router.get('/export', isAuthenticated, checkPermission('equipment_categories.export'), ctrl.exportData);

// Index
router.get('/', isAuthenticated, checkPermission('equipment_categories.view'), ctrl.index);

// Create
router.get('/create', isAuthenticated, checkPermission('equipment_categories.create'), ctrl.create);
router.post('/', isAuthenticated, checkPermission('equipment_categories.create'), ctrl.validateCategory, ctrl.store);

// Edit
router.get('/:id/edit', isAuthenticated, checkPermission('equipment_categories.edit'), ctrl.edit);
router.post('/:id', isAuthenticated, checkPermission('equipment_categories.edit'), ctrl.validateCategory, ctrl.update);

// Delete
router.delete('/:id', isAuthenticated, checkPermission('equipment_categories.delete'), ctrl.destroy);

module.exports = router;
