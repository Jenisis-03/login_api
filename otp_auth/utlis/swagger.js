const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Email OTP Authentication API',
      version: '1.0.0',
      description: 'API for Email OTP-based authentication'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ]
  },
  apis: ['./controllers/*.js'] // Path to controller files containing JSDoc
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;