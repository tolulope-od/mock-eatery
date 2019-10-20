import Debug from 'debug';

const debug = Debug('dev');

class ServerResponseModule {
  static success(res, statusCode, key, data) {
    return res.status(statusCode).json({
      status: 'success',
      [key]: data
    });
  }

  static error(res, statusCode, error) {
    return res.status(statusCode).json({
      status: 'error',
      errors: error
    });
  }

  static resourceNotFound(req, res) {
    return res.status(404).json({
      status: 'error',
      errors: {
        message: 'Requested resource unavailable'
      }
    });
  }

  static serverError(err, req, res, next) {
    return res.status(err.status || 500).json({
      status: 'error',
      errors: {
        message:
          'Something went wrong while processing your request, please try again'
      }
    });
  }

  static serverErrorWithStackTrace(err, req, res, next) {
    debug(err.stack);
    return res.status(err.status || 500).json({
      status: 'error',
      errors: {
        message: `${err.message}. Check console for more info`,
        error: err
      }
    });
  }
}

export default ServerResponseModule;
