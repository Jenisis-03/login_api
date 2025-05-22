const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {

    info: {
      title: 'OTP Authentication API',

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