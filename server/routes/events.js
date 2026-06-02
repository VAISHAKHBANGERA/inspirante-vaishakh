const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/events — all events sorted by date ascending
router.get('/', authMiddleware, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/events — create event (admin only)
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, date, venue, capacity } = req.body;

    // Validate
    if (!name || !date || !venue || !capacity) {
      return res.status(400).json({ message: 'All fields are required: name, date, venue, capacity' });
    }

    if (typeof capacity !== 'number' || capacity < 1) {
      return res.status(400).json({ message: 'Capacity must be a positive number' });
    }

    const event = await Event.create({
      name: name.trim(),
      date: new Date(date),
      venue: venue.trim(),
      capacity,
      registeredCount: 0
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/events/:id — single event
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Get event error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/events/:id/registrations — registrations for an event (admin only)
router.get('/:id/registrations', authMiddleware, adminOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const registrations = await Registration.find({ event: req.params.id })
      .populate('student', 'name username')
      .sort({ registeredAt: 1 });

    res.json({
      event: {
        id: event._id,
        name: event.name,
        date: event.date,
        venue: event.venue,
        capacity: event.capacity,
        registeredCount: event.registeredCount
      },
      registrations: registrations.map(r => ({
        id: r._id,
        studentName: r.student.name,
        studentUsername: r.student.username,
        registeredAt: r.registeredAt
      }))
    });
  } catch (error) {
    console.error('Get event registrations error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
