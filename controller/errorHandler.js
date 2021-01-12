/**
 * Renders the error page
 * @constructor
 * @param {any} req - The express request 
 * @param {string} message - The error message
 * @param {string} error - The error
 */
const error = async (res, message, error) => {
  res.render('error', {message: message, error: error});
}

module.exports = error;