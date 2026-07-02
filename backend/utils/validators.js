const { body } = require('express-validator');

const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const reservationValidation = [
  body('reservationDate')
    .notEmpty()
    .withMessage('Reservation date is required'),
  body('timeSlot')
    .notEmpty()
    .withMessage('Time slot is required')
    .isIn([
      '10:00 AM',
      '11:00 AM',
      '12:00 PM',
      '1:00 PM',
      '2:00 PM',
      '3:00 PM',
      '4:00 PM',
      '5:00 PM',
      '6:00 PM',
      '7:00 PM',
      '8:00 PM',
      '9:00 PM',
    ])
    .withMessage('Invalid time slot'),
  body('guests')
    .notEmpty()
    .withMessage('Number of guests is required')
    .isInt({ min: 1, max: 20 })
    .withMessage('Guests must be between 1 and 20'),
];

const tableValidation = [
  body('tableNumber')
    .notEmpty()
    .withMessage('Table number is required')
    .isInt({ min: 1 })
    .withMessage('Table number must be a positive integer'),
  body('capacity')
    .notEmpty()
    .withMessage('Capacity is required')
    .isInt({ min: 1, max: 20 })
    .withMessage('Capacity must be between 1 and 20'),
];

module.exports = {
  registerValidation,
  loginValidation,
  reservationValidation,
  tableValidation,
};
