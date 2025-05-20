require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const sequelize = require('./config/database');

const swaggerSpec = require('./utils/swagger');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Test route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to Email OTP Auth API" });
});

// Start server
const PORT = process.env.PORT || 3000;
sequelize.authenticate()
  .then(() => console.log("Database connected"))
  .catch(err => console.error("Database connection failed", err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});