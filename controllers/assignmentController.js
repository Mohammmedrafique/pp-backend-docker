// controllers/assignmentController.js
const Assignment = require("../models/Assignment");
const nodemailer = require("nodemailer");

exports.createAssignment = async (req, res) => {
  try {
    const assignment = new Assignment({
      ...req.body,
      teacherId: req.user.username,
    });
    await assignment.save();

    // Send email notification to students (mock implementation)
    const transporter = nodemailer.createTransport({
      host: "smtp.example.com",
      port: 587,
      auth: {
        user: "your_email@example.com",
        pass: "your_email_password",
      },
    });

    await transporter.sendMail({
      from: "your_email@example.com",
      to: "student@example.com",
      subject: "New Assignment Created",
      text: `A new assignment "${assignment.title}" has been created. Due date: ${assignment.dueDate}`,
    });

    res.status(201).json(assignment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    let query = {};
    let sort = {};

    // Filtering
    if (req.query.dueDate) {
      query.dueDate = new Date(req.query.dueDate);
    }
    if (req.query.totalScore) {
      query.totalScore = req.query.totalScore;
    }

    // Sorting
    if (req.query.sort) {
      sort[req.query.sort] = req.query.order === "desc" ? -1 : 1;
    }

    const assignments = await Assignment.find(query).sort(sort);
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.id, teacherId: req.user.username },
      req.body,
      { new: true }
    );
    if (!assignment)
      return res.status(404).json({
        message: "Assignment not found or you're not authorized to update it",
      });
    res.json(assignment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndDelete({
      _id: req.params.id,
      teacherId: req.user.username,
    });
    if (!assignment)
      return res.status(404).json({
        message: "Assignment not found or you're not authorized to delete it",
      });
    res.json({ message: "Assignment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
