import { Op } from 'sequelize';

export default async function isSearchableMiddleware(req, res, next) {
  if (req.query && req.query.query && req.query.queryParam) {
    const { query, queryParam } = req.query;
    req.locals = req.locals || {};
    req.locals.query = {
      [queryParam]: isNaN(query) ? { [Op.iLike]: `%${query}%` } : query,
    };
  }

  next();
}
