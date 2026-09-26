import express from 'express';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { cveRouter } from './routes/cves.routes.js';
import { logger } from './utils/logger.js';
import { errorHandlerMiddleware } from './middleware/errorHandler.middleware.js';
import { database } from './utils/database.js';

const app = express();
const port = 3000;

app.use(express.json());

// --- swagger config ---
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'HACKYBARA-API CVEs Documentation',
            version: '0.0.1',
            description: 'API documentation for the CVEs backend',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Local server',
            },
        ],
    },
    apis: ['./routes/*.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// -----------------------------

app.use('/api/v1/cves', cveRouter);

// if adding more middleware, this should remain last
app.use(errorHandlerMiddleware);

const config = {
    appName: 'CvesAPI',
    database: 'arca',
    url: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017',
    minPoolSize: 2,
    maxPoolSize: 10
};

await database.setup(config);

app.listen(port, () => {
    logger.info(`Example app listening at http://localhost:${port}`);
    logger.info(`Swagger docs available at http://localhost:${port}/api-docs`);
});