import fs from 'fs';
import path from 'path';

import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import methodOverride from 'method-override';
import morgan from 'morgan';

dotenv.config();

import { checkConnection } from '~/common/services/web3';
import db from '~/server/database';
import errorsMiddleware from '~/server/middlewares/errors';
import logger from '~/server/helpers/logger';
import passport from '~/server/services/passport';

const ASSETS_FOLDER_NAME = 'static';
const ASSETS_MANIFESTO_FILE = 'webpack-assets.json';
const ASSETS_MAX_AGE = '14d';

const DEFAULT_PORT = 3000;

function getPath(filePath) {
  if (process.env.NODE_ENV === 'production') {
    return path.resolve(__dirname, filePath);
  }

  return path.resolve(__dirname, '..', '..', 'build', filePath);
}

const assetsManifestoPath = getPath(ASSETS_MANIFESTO_FILE);

// Check if assets exist
if (!fs.existsSync(assetsManifestoPath)) {
  logger.error(
    `"${ASSETS_MANIFESTO_FILE}" was not found, please bundle assets first`,
  );
  process.exit(1);
}

// Check database connection
db.authenticate()
  .then(() => {
    logger.info('Database connection has been established successfully');
  })
  .catch(() => {
    logger.error('Unable to connect to database');
    process.exit(1);
  });

// Check blockchain connection
checkConnection()
  .then(num => {
    logger.info(`Blockchain connection established, block height is ${num}`);
  })
  .catch(() => {
    logger.error('Unable to connect to blockchain');
    process.exit(1);
  });

// Initialize express instance
const app = express();
app.set('port', process.env.PORT || DEFAULT_PORT);

// Configure view engine
app.set('view engine', 'pug');
app.set('views', __dirname);

// Use HTTP middlewares
app.use(compression());
app.use(methodOverride());
app.use(bodyParser.json());

// Use CORS and security middlewares
app.use(cors());
app.use(helmet());

// Passport authentication middleware
app.use(passport.initialize());

// Log HTTP requests and route them to winston
app.use(
  morgan('dev', {
    stream: {
      write: message => logger.verbose(message.replace('\n', '')),
    },
  }),
);

// Static assets hosting
app.use(
  `/${ASSETS_FOLDER_NAME}`,
  express.static(getPath(ASSETS_FOLDER_NAME), {
    index: false,
    redirect: false,
    maxAge: ASSETS_MAX_AGE,
  }),
);

// Mount all API routes
app.use('/api', require('~/server/routes'));

// Handle every other route with index.html
app.get('*', (req, res) => {
  res.render('index', {
    assets: require(assetsManifestoPath),
  });
});

// Use middleware to handle all thrown errors
app.use(errorsMiddleware);

// Start server
if (process.env.NODE_ENV !== 'test') {
  const env = app.get('env');
  const port = app.get('port');

  app.listen(port, () => {
    logger.info(`Server is listening at port ${port} in ${env} mode`);
  });
}

export default app;
