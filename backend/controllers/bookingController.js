const Booking = require('../models/booking');

exports.createBooking = async (req, res) => {
  const booking = new Booking(req.body);

  try {
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ message: "Phone or Email already booked." });
    } else {
      res.status(400).json({ message: err.message });
    }
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
