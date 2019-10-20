import express from 'express';
import logger from 'morgan';
import Debug from 'debug';
import dotenv from 'dotenv';

import connectToDB from './db/config';
import ServerResponseModule from './modules/ServerResponse';

dotenv.config();

const PORT = process.env.PORT || 5000;
const debug = Debug('dev');
const {
  resourceNotFound,
  serverError,
  serverErrorWithStackTrace
} = ServerResponseModule;
const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) =>
  res.status(200).json({ status: 'success', message: 'Welcome to Mock-Eats' })
);

app.use(resourceNotFound);

if (!isProduction) app.use(serverErrorWithStackTrace);

app.use(serverError);

(async () => {
  try {
    await connectToDB();
  } catch (err) {
    debug(err);
  }
})();

app.listen(PORT, () => {
  debug(`Server running on port:${PORT}`);
});
