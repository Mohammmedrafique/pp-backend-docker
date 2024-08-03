// controllers/submissionController.js
const Submission = require("../models/Submission");

exports.submitAssignment = async (req, res) => {
  try {
    const submission = new Submission({
      ...req.body,
      studentId: req.user.username,
    });
    await submission.save();
    res.status(201).json(submission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const submission = await Submission.findByIdAndUpdate(
      req.params.submissionId,
      { score: req.body.score, feedback: req.body.feedback },
      { new: true }
    );
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });
    res.json(submission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getStudentReport = async (req, res) => {
  try {
    const submissions = await Submission.find({
      studentId: req.params.studentId,
    }).populate("assignmentId");
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};