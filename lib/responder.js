var
  paramFilter = require('./param_filter');

module.exports = {
  handleResponse: handleResponse,
  handleError: handleError,
  handleDeferred: handleDeferred
};

function handleResponse(res, status, customResponseData) {
  status = status || 200;

  return sendResponse;

  function sendResponse(data) {
    data = customizeData(data, customResponseData);

    res.json(status, data || 'Success');
  }
}

function handleError(res, status, customResponseData) {
  status = status || 500;

  return sendResponse;

  function sendResponse(data) {
    data = data || {};
    console.log(data.stack);
    data = customizeData(data, customResponseData);

    res.json(status, data || 'There was an unexpected error. Please try again.');
  }
}

function handleDeferred(resolve, reject) {
  return resolver;

  function resolver(err, res) {
    if (err) { reject(err); }
    else { resolve(res); }
  }
}

function customizeData(data, config) {
  if (config) {
    data = Array.isArray(config) ? paramFilter(config, data) : config;
  }

  return data;
}