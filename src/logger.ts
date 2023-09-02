//Manual implementation of a logger
// logger.type("message");

/**
 * A class representing a logger that can log messages with different levels of severity.
 */
export default class Logger {
    /**
     * Logs an informational message to the console with a blue color.
     * @param message - The message to log.
     */
    static info(message: string) {
        console.log("%c [INFO] " + message, "color: rgb(46,46,254)54,54,187)");
    }
    /**
     * Logs an error message to the console with a red color.
     * @param message - The error message to log.
     */
    static error(message: string) {
        console.error("%c [ERROR] " + message, "color: rgb(133,25,25)");
    }
    /**
     * Logs a warning message to the console with a custom color.
     * @param message - The message to log.
     */
    static warn(message: string) {
        console.warn("%c [WARN] " + message, "color: rgb(141,84,14)");
    }
    /**
     * Logs a debug message to the console with a green color.
     * @param message - The message to log.
     */
    static debug(message: string) {
        console.debug("%c [DEBUG] " + message, "color: rgb(11,85,11)");
    }
}