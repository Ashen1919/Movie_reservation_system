import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Movie Reservation API',
            version: '1.0.0',
            description: 'REST API for browsing movies, reserving seats, and managing bookings.'
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Local dev server' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Paste your access token here (without "Bearer " prefix)'
                }
            },
            schemas: {
                AuthTokens: {
                    type: 'object',
                    properties: {
                        accessToken: { type: 'string' }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['src/modules/**/*.docs.ts']
};

export const swaggerSpec = swaggerJSDoc(options);