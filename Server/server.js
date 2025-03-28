require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./app/models"); // Ensure correct import

const app = express();
const PORT = process.env.PORT || 3016;

// CORS Configuration
const corsOptions = {
  origin: '*', // Be more specific in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware (Optional but helpful)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
const employeeRoutes = require("./app/routes/employee.routes");
app.use("/api", employeeRoutes);

const teamRoutes = require("./app/routes/team.routes");
app.use('/api', teamRoutes);

// Root Route
app.get("/", (req, res) => {
  res.json({ 
    message: "Welcome to your Express Server!",
    status: "Running"
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: "Something went wrong!", 
    error: err.message 
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    message: "Route not found" 
  });
});

const startServer = async () => {
  try {
    // Authenticate database connection
    await db.sequelize.authenticate();
    console.log("Database connected successfully.");

    // Sync database (careful with force: true in production)
    await db.sequelize.sync({ 
      force: false, // Set to true only for development
      alter: true   // Safely alter existing tables
    });
    console.log("Database synced successfully.");

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error("Error initializing server:", error);
    process.exit(1); // Exit process with failure
  }
};

startServer();