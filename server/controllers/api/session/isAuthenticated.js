/**
 * Is authenticated
 * @param {Request} req Request
 * @param {Response} res Response
 */
function isAuthenticated (req, res) {
  res.send({authenticated: req.isAuthenticated()});
}

module.exports = isAuthenticated;

