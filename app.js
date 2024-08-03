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
