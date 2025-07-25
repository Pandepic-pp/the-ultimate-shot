const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    place: {type: String, required: true},
    slot: {type: String, required: true}, 
    overs: {type: Number, required: true}, 
    phone: { type: String, required: true},
    email: { type: String, required: true},
    fullName: { type: String, required: true },
    cost: {type: Number, required: true},
    date: {type: String, required: true}
});

module.exports = mongoose.model('Booking', bookingSchema);
