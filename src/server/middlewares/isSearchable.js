import { Op } from 'sequelize';

export default async function (req, res, next) {
  let where = {};
  if (req.query && req.query.query) {
    const query = JSON.parse(req.query.query);
    Object.keys(query).map((key) => {
      if (!isNaN(parseInt(query[key]))) {
        where[key] = parseInt(query[key]);
      } else {
        where[key] = { [Op.iLike]: `%${query[key]}%` };
      }
    });
    req.locals = req.locals || {};
    req.locals.query = where;
  }
  next();
}
