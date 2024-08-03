// const express = require("express");
// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const bodyParser = require("body-parser");
// const nodemailer = require("nodemailer");
// const bcrypt = require("bcryptjs");

// const app = express();
// const port = process.env.PORT || 3000;
// const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// // Connect to MongoDB
// mongoose
//   .connect(
//     process.env.MONGODB_URI ||
//       "mongodb+srv://hello:hello@cluster0.qycsv5m.mongodb.net/play?retryWrites=true&w=majority&appName=Cluster0"
//   )
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Could not connect to MongoDB", err));

// // Schemas
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, required: true },
// });

// const assignmentSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: String,
//   dueDate: Date,
//   totalScore: Number,
//   teacherId: String,
// });

// const submissionSchema = new mongoose.Schema({
//   assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
//   studentId: String,
//   content: String,
//   score: Number,
//   feedback: String,
//   submittedAt: { type: Date, default: Date.now },
// });

// const User = mongoose.model("User", userSchema);
// const Assignment = mongoose.model("Assignment", assignmentSchema);
// const Submission = mongoose.model("Submission", submissionSchema);

// app.use(bodyParser.json());

// // Register user
// app.post("/register", async (req, res) => {
//   const { username, password, role } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username, password: hashedPassword, role });
//     await user.save();
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Login
// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await User.findOne({ username });
//     if (!user) return res.status(401).json({ message: "Invalid username or password" });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(401).json({ message: "Invalid username or password" });

//     const accessToken = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY);
//     res.json({ accessToken });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Middleware to authenticate JWT
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (token == null) return res.sendStatus(401);
//   jwt.verify(token, SECRET_KEY, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };

// // Create assignment
// app.post("/assignments", authenticateToken, async (req, res) => {
//   if (req.user.role !== "teacher") {
//     return res
//       .status(403)
//       .json({ message: "Only teachers can create assignments" });
//   }
//   try {
//     const assignment = new Assignment({
//       ...req.body,
//       teacherId: req.user.username,
//     });
//     await assignment.save();

//     // Send email notification to students (mock implementation)
//     const transporter = nodemailer.createTransport({
//       host: "smtp.example.com",
//       port: 587,
//       auth: {
//         user: "your_email@example.com",
//         pass: "your_email_password",
//       },
//     });

//     await transporter.sendMail({
//       from: "your_email@example.com",
//       to: "student@example.com",
//       subject: "New Assignment Created",
//       text: `A new assignment "${assignment.title}" has been created. Due date: ${assignment.dueDate}`,
//     });

//     res.status(201).json(assignment);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Get all assignments with filtering and sorting
// app.get("/assignments", authenticateToken, async (req, res) => {
//   try {
//     let query = {};
//     let sort = {};

//     // Filtering
//     if (req.query.dueDate) {
//       query.dueDate = new Date(req.query.dueDate);
//     }
//     if (req.query.totalScore) {
//       query.totalScore = req.query.totalScore;
//     }

//     // Sorting
//     if (req.query.sort) {
//       sort[req.query.sort] = req.query.order === "desc" ? -1 : 1;
//     }

//     const assignments = await Assignment.find(query).sort(sort);
//     res.json(assignments);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Update assignment
// app.put("/assignments/:id", authenticateToken, async (req, res) => {
//   if (req.user.role !== "teacher") {
//     return res
//       .status(403)
//       .json({ message: "Only teachers can update assignments" });
//   }
//   try {
//     const assignment = await Assignment.findOneAndUpdate(
//       { _id: req.params.id, teacherId: req.user.username },
//       req.body,
//       { new: true }
//     );
//     if (!assignment)
//       return res.status(404).json({
//         message: "Assignment not found or you're not authorized to update it",
//       });
//     res.json(assignment);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Delete assignment
// app.delete("/assignments/:id", authenticateToken, async (req, res) => {
//   if (req.user.role !== "teacher") {
//     return res
//       .status(403)
//       .json({ message: "Only teachers can delete assignments" });
//   }
//   try {
//     const assignment = await Assignment.findOneAndDelete({
//       _id: req.params.id,
//       teacherId: req.user.username,
//     });
//     if (!assignment)
//       return res.status(404).json({
//         message: "Assignment not found or you're not authorized to delete it",
//       });
//     res.json({ message: "Assignment deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Submit assignment
// app.post("/submissions", authenticateToken, async (req, res) => {
//   if (req.user.role !== "student") {
//     return res
//       .status(403)
//       .json({ message: "Only students can submit assignments" });
//   }
//   try {
//     const submission = new Submission({
//       ...req.body,
//       studentId: req.user.username,
//     });
//     await submission.save();
//     res.status(201).json(submission);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Grade submission
// app.post("/grade/:submissionId", authenticateToken, async (req, res) => {
//   if (req.user.role !== "teacher") {
//     return res
//       .status(403)
//       .json({ message: "Only teachers can grade submissions" });
//   }
//   try {
//     const submission = await Submission.findByIdAndUpdate(
//       req.params.submissionId,
//       { score: req.body.score, feedback: req.body.feedback },
//       { new: true }
//     );
//     if (!submission)
//       return res.status(404).json({ message: "Submission not found" });
//     res.json(submission);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Get student report
// app.get("/report/:studentId", authenticateToken, async (req, res) => {
//   if (
//     req.user.role !== "teacher" &&
//     req.user.username !== req.params.studentId
//   ) {
//     return res
//       .status(403)
//       .json({ message: "You're not authorized to view this report" });
//   }
//   try {
//     const submissions = await Submission.find({
//       studentId: req.params.studentId,
//     }).populate("assignmentId");
//     res.json(submissions);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// // Setup and Testing Guide:

// // 1. Install dependencies:
// //    npm init -y
// //    npm install express mongoose jsonwebtoken body-parser nodemailer bcryptjs

// // 2. Ensure MongoDB is installed and running on your system.

// // 3. Set environment variables (optional but recommended for production):
// //    export MONGODB_URI=your_mongodb_connection_string
// //    export JWT_SECRET=your_jwt_secret_key

// // 4. Run the application:
// //    node app.js

// // 5. Test the API using curl or Postman:

// // a. Register user:
// // curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"username":"testuser","password":"testpass","role":"teacher"}'

// // b. Login (get the token):
// // curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"username":"testuser","password":"testpass"}'

// // c. Use the token for authenticated routes as previously outlined
// app.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/submissions", submissionRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
