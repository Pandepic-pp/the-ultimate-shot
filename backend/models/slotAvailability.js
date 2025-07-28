// models/slotAvailability.js
const mongoose = require('mongoose');

const slotAvailabilitySchema = new mongoose.Schema({
  place: String,
  date: String,
  slot: String,
  count: { type: Number, default: 0 },
}, {
  timestamps: true
});

slotAvailabilitySchema.index({ place: 1, date: 1, slot: 1 }, { unique: true });

module.exports = mongoose.model('SlotAvailability', slotAvailabilitySchema);
