class NotFoundError extends Error {
  constructor(message) {
      super(message);
      this.name = 'NotFoundError';
      this.statusCode = 404;
  }
}

class InvalidCredentialsError extends Error {
  constructor(message) {
      super(message);
      this.name = 'InvalidCredentialsError';
      this.statusCode = 401;
  }
}

module.exports = { NotFoundError, InvalidCredentialsError };