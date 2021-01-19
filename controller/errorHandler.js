/**
 * Renders the error page
 * @constructor
 * @param {any} req - The express request
 * @param {string} message - The error message
 * @param {string} error - The error
 */
function errorHandler(res, message, error) {
  res.render('error', { message, error });
}

module.exports = errorHandler;
