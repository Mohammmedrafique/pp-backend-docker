// models/Assignment.js
const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  totalScore: Number,
  teacherId: String,
});

module.exports = mongoose.model("Assignment", assignmentSchema);