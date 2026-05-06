const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
  key: { type: String },
  value: { type: Boolean }
}, { _id: false })

// * modelo
const User = mongoose.model('User', {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  quests: [questSchema],
  streak: {
    current: Number,   // ofensiva atual
    best: Number,      // melhor ofensiva alcançada
    lastCheck: Date    // última vez que o usuário manteve a streak
  }

});

// * exportando modelos
module.exports = { User };
