const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Table = require('../models/Table');
const Reservation = require('../models/Reservation');

dotenv.config({ path: require('path').join(__dirname, '..', '.env') });

const tables = [
  { tableNumber: 1, capacity: 2 },
  { tableNumber: 2, capacity: 2 },
  { tableNumber: 3, capacity: 4 },
  { tableNumber: 4, capacity: 4 },
  { tableNumber: 5, capacity: 6 },
  { tableNumber: 6, capacity: 8 },
];

const adminUser = {
  name: 'Admin',
  email: 'admin@restaurant.com',
  password: 'Admin@123',
  role: 'admin',
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await Reservation.deleteMany({});
    await Table.deleteMany({});
    await User.deleteMany({});
    console.log('Existing data cleared.');

    // Seed tables
    await Table.insertMany(tables);
    console.log(`${tables.length} tables seeded.`);

    // Seed admin user (password hashed via pre-save hook)
    await User.create(adminUser);
    console.log('Admin user seeded: admin@restaurant.com / Admin@123');

    console.log('\nDatabase seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
