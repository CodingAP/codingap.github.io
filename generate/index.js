import express from 'express';
import { generateSite } from './src/build.js';
import LOGGER from './src/logger.js';

const app = express();
const PORT = 1337;
const outputDirectory = './';

generateSite(outputDirectory);

app.use('/', express.static(outputDirectory));

app.listen(PORT, () => {
    LOGGER.info(`codingap.github.io hosted on http://localhost:${PORT}`);
});