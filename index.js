import express from 'express';
import logger from 'morgan';
import Debug from 'debug';

const PORT = process.env.PORT || 5000;
const debug = Debug('dev');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send({ status: 'success', message: 'Base route' }));

app.listen(PORT, () => debug(`Server running on port:${PORT}`));
