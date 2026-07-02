const { validationResult } = require('express-validator');
const Table = require('../models/Table');
const Reservation = require('../models/Reservation');

// @desc    Get all tables
// @route   GET /api/tables
// @access  Private
const getTables = async (req, res, next) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });

    res.json({
      success: true,
      count: tables.length,
      tables,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a table
// @route   POST /api/tables
// @access  Private (Admin)
const createTable = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { tableNumber, capacity } = req.body;

    const existingTable = await Table.findOne({ tableNumber });
    if (existingTable) {
      return res.status(400).json({ message: `Table ${tableNumber} already exists` });
    }

    const table = await Table.create({ tableNumber, capacity });

    res.status(201).json({
      success: true,
      table,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a table
// @route   PUT /api/tables/:id
// @access  Private (Admin)
const updateTable = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    let table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Check if new tableNumber conflicts with another table
    if (req.body.tableNumber && req.body.tableNumber !== table.tableNumber) {
      const existing = await Table.findOne({ tableNumber: req.body.tableNumber });
      if (existing) {
        return res
          .status(400)
          .json({ message: `Table ${req.body.tableNumber} already exists` });
      }
    }

    table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      table,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a table
// @route   DELETE /api/tables/:id
// @access  Private (Admin)
const deleteTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Prevent deletion if table has active (confirmed) reservations
    const activeReservations = await Reservation.countDocuments({
      table: table._id,
      status: 'confirmed',
    });

    if (activeReservations > 0) {
      return res.status(400).json({
        message: `Cannot delete table ${table.tableNumber}. It has ${activeReservations} active reservation(s).`,
      });
    }

    await Table.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `Table ${table.tableNumber} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTables, createTable, updateTable, deleteTable };
