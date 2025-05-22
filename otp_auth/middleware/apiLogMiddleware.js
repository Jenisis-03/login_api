const { ApiLog } = require('../models');

const apiLogMiddleware = async (req, res, next) => {
  const startTime = Date.now();
  const oldSend = res.send;

  // Capture request data
  const requestData = {
    headers: req.headers,
    body: req.body,
    query: req.query,
    params: req.params
  };

  res.send = function (data) {
    const responseData = {
      body: JSON.parse(data),
      status: res.statusCode,
      headers: res.getHeaders()
    };

    const duration = Date.now() - startTime;

    // Store log with JSON data
    ApiLog.create({
      method: req.method,
      path: req.path,
      requestData,
      responseData,
      userId: req.user?.id,
      duration,
      timestamp: new Date()
    });

    oldSend.apply(res, arguments);
  };

  next();
};

module.exports = apiLogMiddleware;