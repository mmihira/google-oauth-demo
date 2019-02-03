const passport = require('passport');

/**
 * Add application routes.
 * @param {Object} app Express application
 */
const testController = require('../../../controllers/api/test.js');
const isAuthenticated = require('../../../controllers/api/session/isAuthenticated.js');

module.exports = function (app) {
  'use strict';
  app.get('/api/v1/test', testController);
  app.get('/api/v1/isAuthenticated', isAuthenticated);
  app.get('/api/v1/protected', (req, res) => {
    if (req.isAuthenticated() ) {
      res.status(200).send({msg: 'Protected end point contents'});
    } else {
      res.status(401).send({msg: 'Not authenticated'});
    }
  });
  app.get('/login', passport.authenticate('google', { scope: ['profile'] }));
  app.get(
    '/auth',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    }
  );
};
