import winston from 'winston';
import fs from 'fs';
import path from 'path';
import config from '../config'

const isDev = config.NODE_ENV === 'development';
const logDir = config.logDir;

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define log formats
const logFormat = winston.format.combine(
	winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
	winston.format.splat(),
	winston.format.errors({ stack: true }),
	winston.format.json()
);

const consoleFormat = winston.format.combine(
	winston.format.colorize(),
	winston.format.timestamp({ format: 'HH:mm:ss' }),
	winston.format.splat(),
	winston.format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `[${timestamp}] ${level}: ${message}\n${stack}`
      : `[${timestamp}] ${level}: ${message}`;
  })
);

// Create Winston logger instance
const logger = winston.createLogger({
	level: isDev ? 'debug' : 'info',
	format: logFormat,
	transports: [
    new winston.transports.Console({
      format: consoleFormat,
      level: isDev ? 'debug' : 'info',
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'info.log'),
      level: 'info',
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'errors.log'),
      level: 'error',
    }),
  	],
});

export default logger;