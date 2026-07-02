const express = require('express');
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservation,
  cancelReservation,
} = require('../controllers/reservationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleMiddleware');
const { reservationValidation } = require('../utils/validators');

router.post('/', protect, authorize('customer'), reservationValidation, createReservation);
router.get('/my', protect, authorize('customer'), getMyReservations);
router.get('/', protect, authorize('admin'), getAllReservations);
router.put('/:id', protect, authorize('admin'), updateReservation);
router.patch('/:id/cancel', protect, cancelReservation);

module.exports = router;
