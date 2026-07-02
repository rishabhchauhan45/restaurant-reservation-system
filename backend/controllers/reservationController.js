const { validationResult } = require('express-validator');
const Reservation = require('../models/Reservation');
const Table = require('../models/Table');

// @desc    Create reservation with smart table assignment
// @route   POST /api/reservations
// @access  Private (Customer)
const createReservation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { reservationDate, timeSlot, guests } = req.body;

    // 1. Find all tables with capacity >= guests, sorted by smallest suitable capacity
    const suitableTables = await Table.find({ capacity: { $gte: guests } }).sort({
      capacity: 1,
    });

    if (suitableTables.length === 0) {
      return res.status(409).json({
        message: 'No tables available for selected time.',
      });
    }

    // 2. Find which of these tables are already booked for this date/time
    const bookedReservations = await Reservation.find({
      reservationDate,
      timeSlot,
      status: 'confirmed',
      table: { $in: suitableTables.map((t) => t._id) },
    });

    const bookedTableIds = new Set(
      bookedReservations.map((r) => r.table.toString())
    );

    // 3. Find the first available table (smallest capacity that fits)
    const availableTable = suitableTables.find(
      (t) => !bookedTableIds.has(t._id.toString())
    );

    if (!availableTable) {
      return res.status(409).json({
        message: 'No tables available for selected time.',
      });
    }

    // 4. Create the reservation
    const reservation = await Reservation.create({
      user: req.user._id,
      table: availableTable._id,
      reservationDate,
      timeSlot,
      guests,
    });

    // 5. Return populated reservation
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('table', 'tableNumber capacity')
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      reservation: populatedReservation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's reservations
// @route   GET /api/reservations/my
// @access  Private (Customer)
const getMyReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('table', 'tableNumber capacity')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reservations.length,
      reservations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reservations (with optional date filter)
// @route   GET /api/reservations
// @access  Private (Admin)
const getAllReservations = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.date) {
      filter.reservationDate = req.query.date;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const reservations = await Reservation.find(filter)
      .populate('table', 'tableNumber capacity')
      .populate('user', 'name email')
      .sort({ reservationDate: -1, timeSlot: 1 });

    res.json({
      success: true,
      count: reservations.length,
      reservations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update reservation (Admin)
// @route   PUT /api/reservations/:id
// @access  Private (Admin)
const updateReservation = async (req, res, next) => {
  try {
    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    const { reservationDate, timeSlot, guests, status } = req.body;

    // If date/time/guests are changing, re-run table assignment logic
    if (
      reservationDate &&
      timeSlot &&
      guests &&
      (reservationDate !== reservation.reservationDate ||
        timeSlot !== reservation.timeSlot ||
        guests !== reservation.guests)
    ) {
      const suitableTables = await Table.find({
        capacity: { $gte: guests },
      }).sort({ capacity: 1 });

      const bookedReservations = await Reservation.find({
        reservationDate,
        timeSlot,
        status: 'confirmed',
        _id: { $ne: reservation._id },
        table: { $in: suitableTables.map((t) => t._id) },
      });

      const bookedTableIds = new Set(
        bookedReservations.map((r) => r.table.toString())
      );

      const availableTable = suitableTables.find(
        (t) => !bookedTableIds.has(t._id.toString())
      );

      if (!availableTable) {
        return res.status(409).json({
          message: 'No tables available for selected time.',
        });
      }

      reservation.table = availableTable._id;
      reservation.reservationDate = reservationDate;
      reservation.timeSlot = timeSlot;
      reservation.guests = guests;
    }

    if (status) {
      reservation.status = status;
    }

    await reservation.save();

    const updatedReservation = await Reservation.findById(reservation._id)
      .populate('table', 'tableNumber capacity')
      .populate('user', 'name email');

    res.json({
      success: true,
      reservation: updatedReservation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel reservation
// @route   PATCH /api/reservations/:id/cancel
// @access  Private (Customer: own only, Admin: any)
const cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Customers can only cancel their own reservations
    if (
      req.user.role === 'customer' &&
      reservation.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: 'Not authorized to cancel this reservation',
      });
    }

    if (reservation.status === 'cancelled') {
      return res.status(400).json({ message: 'Reservation is already cancelled' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    const updatedReservation = await Reservation.findById(reservation._id)
      .populate('table', 'tableNumber capacity')
      .populate('user', 'name email');

    res.json({
      success: true,
      reservation: updatedReservation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservation,
  cancelReservation,
};
