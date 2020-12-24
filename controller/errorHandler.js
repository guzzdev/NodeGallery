const error = async (res, message, error) => {
  res.render('error', {message: message, error: error});
}

module.exports = error;