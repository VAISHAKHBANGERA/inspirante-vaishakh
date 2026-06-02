const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { authMiddleware, studentOnly } = require('../middleware/auth');

const router = express.Router();

// POST /api/register — register for an event (student only)
router.post('/register', authMiddleware, studentOnly, async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    // Find event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check capacity
    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Check duplicate
    const existing = await Registration.findOne({
      student: req.user.userId,
      event: eventId
    });
    if (existing) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Create registration
    const registration = await Registration.create({
      student: req.user.userId,
      event: eventId,
      registeredAt: new Date()
    });

    // Atomically increment registered count
    await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });

    res.status(201).json({
      message: 'Successfully registered for the event',
      registration: {
        id: registration._id,
        event: event.name,
        registeredAt: registration.registeredAt
      }
    });
  } catch (error) {
    // Handle duplicate key error from unique index
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/registrations/my — student's own registrations
router.get('/registrations/my', authMiddleware, studentOnly, async (req, res) => {
  try {
    const registrations = await Registration.find({ student: req.user.userId })
      .populate('event')
      .sort({ 'event.date': 1 });

    res.json(
      registrations.map(r => ({
        id: r._id,
        registeredAt: r.registeredAt,
        event: {
          id: r.event._id,
          name: r.event.name,
          date: r.event.date,
          venue: r.event.venue,
          capacity: r.event.capacity,
          registeredCount: r.event.registeredCount
        }
      }))
    );
  } catch (error) {
    console.error('Get my registrations error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
