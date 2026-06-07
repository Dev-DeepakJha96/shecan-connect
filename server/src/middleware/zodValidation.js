const { ZodError } = require('zod');

const validate = (schemas = {}) => async (req, res, next) => {
  try {
    if (schemas.params) {
      const parsed = await schemas.params.parseAsync(req.params || {});
      req.params = parsed;
    }

    if (schemas.query) {
      const parsed = await schemas.query.parseAsync(req.query || {});
      req.query = parsed;
    }

    if (schemas.body) {
      const parsed = await schemas.body.parseAsync(req.body || {});
      req.body = parsed;
    }

    return next();
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.errors.map(e => ({
        field: e.path.join('.') || '(root)',
        message: e.message
      }));
      return res.status(400).json({ success: false, errors });
    }
    return next(err);
  }
};

module.exports = { validate };
