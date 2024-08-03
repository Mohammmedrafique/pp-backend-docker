// routes/submissionRoutes.js
const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");
const { authenticateToken, isTeacher, isStudent } = require("../middleware/auth");

router.post("/", authenticateToken, isStudent, submissionController.submitAssignment);
router.post("/grade/:submissionId", authenticateToken, isTeacher, submissionController.gradeSubmission);
router.get("/report/:studentId", authenticateToken, submissionController.getStudentReport);

module.exports = router;