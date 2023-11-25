/**
 * src/logger.js
 * 
 * A winston Logger that prints to the console and to a file
 * 
 * by Alex Prosser
 * 11/17/2023
 */

import winston from 'winston';

const LOGGER = winston.createLogger({
    transports: [
        new winston.transports.File({
            filename: 'generate/logs/activity.log', format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
                winston.format.printf(({ level, message, timestamp }) => {
                    return `[${timestamp}] ${level}: ${message}`;
                })
            )
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
                winston.format.printf(({ level, message, timestamp }) => {
                    return `[${timestamp}] ${level}: ${message}`;
                })
            )
        })
    ]
});

export default LOGGER;