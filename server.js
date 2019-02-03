const bodyParser = require('body-parser');
const config = require('./config/config.js').getProperties();
const exec = require('child-process-promise').exec;
const express = require('express');
const expressLogger = require('express-pino-logger')();
const middleware = require('webpack-dev-middleware');
const pinoMod = require('pino');
const pino = require('pino')();
const webpack = require('webpack');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

const app = express();
const webpackConfig = ['production', 'sandbox'].includes(process.env.NODE_ENV)
  ? require('./webpack.production.config.js')
  : require('./webpack.config');
const compiler = webpack(webpackConfig);

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
db.serialize(function () {
  db.run('CREATE TABLE lorem (info TEXT)');

  const stmt = db.prepare('INSERT INTO lorem VALUES (?)');
  for (let i = 0; i < 10; i++) {
    stmt.run('Ipsum ' + i);
  }
  stmt.finalize();

  db.each('SELECT rowid AS id, info FROM lorem', function (err, row) {
    console.log(row.id + ': ' + row.info);
  });
});
db.close();

passport.use(
  new GoogleStrategy(
    {
      clientID: '',
      clientSecret: '',
      callbackURL: 'http://localhost:8071/auth'
    },
    function (accessToken, refreshToken, profile, cb) {
      return cb(null, { id: profile.id });
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

const ctx = {
  app: null,
  CFG: {
    PORT: config.express_port,
    BIND_ADDRESS: config.bind_address
  }
};

/**
 * Load configuration.
 * @param {Object} ctx Server context
 * @returns {Promise}
 */
function loadConfiguration (ctx) {
  return new Promise(function (resolve) {
    resolve(ctx);
  });
}

/**
 * Create express application.
 * See discussion on upload size limit here https://stackoverflow.com/questions/19917401/error-request-entity-too-large
 * @param {Object} ctx Server context
 * @returns {Promise}
 */
function createApplication (ctx) {
  ctx.app = express();
  ctx.app.use(cookieParser());
  ctx.app.use(bodyParser.json());
  ctx.app.use(bodyParser.urlencoded({ extended: true }));
  ctx.app.use(expressLogger);
  ctx.app.use(
    expressSession({
      secret: 'satoshi nakamoto albus dumbledore',
      resave: false,
      saveUninitialized: false
    })
  );
  ctx.app.set('view engine', 'ejs');
  ctx.app.use(passport.initialize());
  ctx.app.use(passport.session());
  return ctx;
}

/**
 * Create application shutdown handlers.
 * @param {Object} ctx Server context
 * @returns {Promise}
 */
function createShutdownHandlers (ctx) {
  function handleShutdown (sig) {
    pino.info('Received %s shutdown signal', sig);
    process.exit(0);
  }

  process.on('SIGINT', function () {
    handleShutdown('SIGINT');
  });

  process.on('SIGTERM', function () {
    handleShutdown('SIGTERM');
  });

  return ctx;
}

function startApplication (ctx) {
  ctx.app.use(
    middleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      historyApiFallback: true,
      watch: true,
      quiet: false,
      noInfo: false,
      lazy: false,
      watchOptions: {
        poll: true
      },
      stats: {
        // Config for minimal console.log mess.
        assets: false,
        colors: true,
        version: false,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false
      }
    })
  );

  ctx.app.listen(ctx.CFG.PORT, ctx.CFG.BIND_ADDRESS, () =>
    pino.info(
      `growl-ui with ENV: ${config.env}, listening at ${
        ctx.CFG.BIND_ADDRESS
      } on ${ctx.CFG.PORT}. Using API url ${config.api_server_url}.`
    )
  );
}

/**
 * Get current commit SHA.
 * @param {Object} ctx Server context
 * @returns {Promise}
 */
function getCommitSha (ctx) {
  return new Promise(function (resolve, reject) {
    try {
      exec('git rev-parse HEAD')
        .then(function (sha) {
          ctx.app.locals.releaseSha = sha.stdout.substring(0, 8);
          pino.info('ok');
          resolve(ctx);
        })
        .catch(function (err) {
          reject(error);
        });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Define application routes.
 * @param {Object} ctx Context
 * @returns {Promise}
 */
function defineRoutes (ctx) {
  const routes = ['./server/routes/api/v1/index.js'];

  return new Promise(function (resolve) {
    routes.forEach(function (route) {
      pino.info('Adding routes from %s module', route);
      require(route)(ctx.app);
    });
    resolve(ctx);
  });
}

loadConfiguration(ctx)
  .then(createApplication)
  .then(defineRoutes)
  .then(createShutdownHandlers)
  .then(getCommitSha)
  .then(startApplication)
  .catch(err => {
    finalLogger = pinoMod.final(pino);
    finalLogger.error(err);
    process.exit(1);
  });
