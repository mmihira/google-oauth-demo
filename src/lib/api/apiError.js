class ApiError extends Error {
  constructor ({ msg, res }) {
    super(msg);
    this.res = res;
  }
}

export default ApiError;

