const CircuitBreaker = require('opossum');
const fs = require('fs');
const path = require('path');
const winston = require('winston');

class CircuitBreakerHandler {
  constructor() {
    this.options = {
      timeout: 3000, // time in ms
      errorThresholdPercentage: 50,
      resetTimeout: 30000, // time in ms
    };

    // Configure Winston logger
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        })
      ),
      transports: [
        new winston.transports.File({
          filename: `Logs/log-${new Date().toISOString().split('T')[0]}.log`
        })
      ]
    });
  }

  static createBreaker(func, req) {
    const instance = new CircuitBreakerHandler(); // creating an instance of CircuitBreakerHandler
    const breaker = new CircuitBreaker(func, instance.options);
  
    breaker.fallback(() => {
      instance.logToFile('Circuit open. Using fallback.');
    });
  
    breaker.on('failure', () => {
      instance.logToFile('Action failed.', req);
    });
  
    breaker.on('open', () => {
      instance.logToFile('Circuit has been opened.');
    });
  
    breaker.on('close', () => {
      instance.logToFile('Circuit has been closed.');
    });
  
    breaker.on('halfOpen', () => {
      instance.logToFile('Circuit is half open.');
    });
  
    return breaker;
  }

  logToFile(message, req) {
    this.logger.info(message);
  }
}

module.exports = CircuitBreakerHandler;
