const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OTP Authentication API',
      version: '1.0.0',
      description: 'API for Email OTP-based authentication'
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
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./controllers/*.js']
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;