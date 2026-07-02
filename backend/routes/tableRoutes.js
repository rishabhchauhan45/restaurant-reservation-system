const express = require('express');
const router = express.Router();
const {
  getTables,
  createTable,
  updateTable,
  deleteTable,
} = require('../controllers/tableController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleMiddleware');
const { tableValidation } = require('../utils/validators');

router.get('/', protect, getTables);
router.post('/', protect, authorize('admin'), tableValidation, createTable);
router.put('/:id', protect, authorize('admin'), tableValidation, updateTable);
router.delete('/:id', protect, authorize('admin'), deleteTable);

module.exports = router;
