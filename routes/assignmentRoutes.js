// routes/assignmentRoutes.js
const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");
const { authenticateToken, isTeacher } = require("../middleware/auth");

router.post("/", authenticateToken, isTeacher, assignmentController.createAssignment);
router.get("/", authenticateToken, assignmentController.getAssignments);
router.put("/:id", authenticateToken, isTeacher, assignmentController.updateAssignment);
router.delete("/:id", authenticateToken, isTeacher, assignmentController.deleteAssignment);

module.exports = router;