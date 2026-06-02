const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Event = require('./models/Event');
const Registration = require('./models/Registration');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Registration.deleteMany({});
    await Event.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data.');

    // Hash passwords
    const adminHash = await bcrypt.hash('inspirante2026', 10);
    const studentHash = await bcrypt.hash('student123', 10);

    // Insert admin
    const admin = await User.create({
      name: 'Admin',
      username: 'admin',
      password: adminHash,
      role: 'admin'
    });
    console.log('Admin user created.');

    // Insert students
    const studentData = [
      { name: 'Asha Rao', username: 'asha.rao' },
      { name: 'Ravi Shetty', username: 'ravi.shetty' },
      { name: 'Meera Nair', username: 'meera.nair' },
      { name: 'Kiran Bhat', username: 'kiran.bhat' },
      { name: 'Divya Kamath', username: 'divya.kamath' },
      { name: 'Suresh Pai', username: 'suresh.pai' },
      { name: 'Ananya Hegde', username: 'ananya.hegde' },
      { name: 'Rohan Shenoy', username: 'rohan.shenoy' },
      { name: 'Nisha Prabhu', username: 'nisha.prabhu' },
      { name: 'Tejas Mallya', username: 'tejas.mallya' },
      { name: 'Priya Bangera', username: 'priya.bangera' }
    ];

    const students = await User.insertMany(
      studentData.map(s => ({
        ...s,
        password: studentHash,
        role: 'student'
      }))
    );
    console.log(`${students.length} student users created.`);

    // Insert events
    const events = await Event.insertMany([
      {
        name: 'Tech Symposium 2026',
        date: new Date('2026-07-10'),
        venue: 'Main Auditorium',
        capacity: 120,
        registeredCount: 0
      },
      {
        name: 'Hackathon',
        date: new Date('2026-07-15'),
        venue: 'Lab Block C',
        capacity: 40,
        registeredCount: 0
      },
      {
        name: 'Cultural Fest',
        date: new Date('2026-07-20'),
        venue: 'Open Amphitheatre',
        capacity: 300,
        registeredCount: 0
      },
      {
        name: 'Workshop: React Basics',
        date: new Date('2026-07-22'),
        venue: 'Seminar Hall 2',
        capacity: 30,
        registeredCount: 0
      },
      {
        name: 'Placement Prep Talk',
        date: new Date('2026-07-25'),
        venue: 'Main Auditorium',
        capacity: 200,
        registeredCount: 0
      }
    ]);
    console.log(`${events.length} events created.`);

    console.log('\nSeed completed successfully!');
    console.log(`  - 1 admin user`);
    console.log(`  - ${students.length} student users`);
    console.log(`  - ${events.length} events`);

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedDB();
