import pino, { Logger } from 'pino'

export let LOGGER: Logger;

const initLogger = (enableLogging: boolean): Logger => {
    if (LOGGER) return LOGGER;
    
    return LOGGER = pino({
        enabled: enableLogging,
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true
            }
        }
    });
};

export default initLogger;