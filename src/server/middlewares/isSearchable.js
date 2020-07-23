import { Op } from 'sequelize';

export default async function (req, res, next) {
  let where = {};
  if (req.query) {
    const query = req.query;
    Object.keys(query).map((key) => {
      where[key] = { [Op.iLike]: `%${query[key]}%` };
    });
    req.locals = req.locals || {};
    req.locals.query = where;
  }
  next();
}
