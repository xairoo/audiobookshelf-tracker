// Joi options
const options = {
  abortEarly: false, // include all errors
  allowUnknown: false, // unknown props are not welcome
  stripUnknown: true, // remove unknown props
  errors: {
    wrap: {
      label: "'", // replace double quotes with single quotes from the key
    },
  },
};

/**
 * Validate params
 */
export const validateParams = (schema) => {
  return (req, res, next) => {
    createValidateParams(req, next, schema);
  };
};

function createValidateParams(req, next, schema) {
  const { error, value } = schema.validate(req.params, options);

  if (error) {
    next({
      status: 400,
      error: error.details.map((x) => x.message).join(', '),
    });
  } else {
    req.params = value;
    next();
  }
}

/**
 * Validate query
 */
export const validateQuery = (schema) => {
  return (req, res, next) => {
    createValidateQuery(req, next, schema);
  };
};

function createValidateQuery(req, next, schema) {
  const { error, value } = schema.validate(req.query, options);

  if (error) {
    next({
      status: 400,
      error: error.details.map((x) => x.message).join(', '),
    });
  } else {
    req.query = value;
    next();
  }
}

/**
 * Validate body
 */
export const validateBody = (schema) => {
  return (req, res, next) => {
    createValidateBody(req, next, schema);
  };
};

function createValidateBody(req, next, schema) {
  const { error, value } = schema.validate(req.body, options);

  if (error) {
    next({
      status: 400,
      error: error.details.map((x) => x.message).join(', '),
    });
  } else {
    req.body = value;
    next();
  }
}
