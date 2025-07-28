const Booking = require('../models/booking');
const mongoose = require('mongoose');

exports.createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { place, slot, date, email, phone, fullName, cost, overs, status } = req.body;

    const slotKey = { place, slot, date };
    const updatedSlot = await SlotAvailability.findOneAndUpdate(
      {
        ...slotKey,
        count: { $lt: 2 } // only increment if less than 2
      },
      { $inc: { count: 1 } },
      {
        new: true,
        upsert: true,
        session
      }
    );

    if (!updatedSlot) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ message: 'Slot fully booked' });
    }

    const booking = new Booking({ place, slot, date, email, phone, fullName, cost, overs, status });
    const savedBooking = await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(savedBooking);
  } catch (err) {
    // If any error, rollback
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ message: 'Booking failed. Please try again.' });
  }
};

exports.getUserBookings = async (req, res) => {
  const { email, phone } = req.body;

  if (!email || !phone) {
    return res.status(400).json({ message: "Email and phone are required" });
  }

  const booking = await Booking.find({ email, phone });
  if (!booking) return res.status(404).json({ message: "No bookings found" });

  res.json(booking);
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}, 'place slot overs');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
