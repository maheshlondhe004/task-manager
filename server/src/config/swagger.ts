import swaggerJSDoc, { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Task Manager API',
    version: '1.0.0',
    description: 'API documentation for the Task Manager service.',
  },
  servers: [
    {
      url: '/api',
      description: 'Base API path',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

export const swaggerSpec = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: [
    'src/routes.ts',
    'src/modules/**/*.ts',
  ],
});


