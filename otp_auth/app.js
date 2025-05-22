require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const sequelize = require('./config/database');

const swaggerSpec = require('./utils/swagger');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Swagger Docs
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OTP Authentication API',
      version: '1.0.0',
      description: 'API for OTP-based authentication with profile management'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./controllers/*.js', './routes/*.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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