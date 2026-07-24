// Packages
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const helmet = require("helmet");

const PORT = process.env.PORT || 3000;

// util
const generateToken = require("./utils/jwt");
const ExpressError = require("./utils/ExpressError");

// Models
const User = require("./models/userSchema");
const Project = require("./models/projectSchema");

// Routes
const proposalRoutes = require("./routes/proposalRoutes");
const projectRoutes = require("./routes/projectRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
const {authenticateToken, authorizeRoles} = require("./middleware/auth");


main().then(() => console.log("connected to mongodb")).catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}

app.get("/api", (req, res) => {
    res.send("This is home page.");
});

// Mounting routers
app.use("/api/proposals", proposalRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.get('/{*splat}', (req, res, next) => {
    next(new ExpressError("Page not found!", 404));
});

app.use((err, req, res, next) => {
    let { error = "Something went wrong!", status = 500 } = err;
    res.status(status).json({ error });
})

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});