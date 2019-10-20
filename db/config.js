import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Debug from 'debug';

dotenv.config();
const debug = Debug('dev');

const env = process.env.NODE_ENV || 'dev';

const environment = {
  dev: {
    use_env_variable: 'DATABASE_URL'
  },
  test: {
    use_env_variable: 'TEST_DATABASE_URL'
  },
  production: {
    use_env_variable: 'DATABASE_URL'
  }
};

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env[environment[env].use_env_variable], {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    return debug('Database connected!');
  } catch (err) {
    return debug(err);
  }
};

export default connectToDB;
