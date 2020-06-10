import httpStatus from 'http-status';

import requestGraph from '~/common/services/subgraph';
import APIError from '~/server/helpers/errors';

export default function (queryBuilder, paramName) {
  return async (req, res, next) => {
    const query = queryBuilder(req.params[paramName]);
    try {
      req.locals = req.locals || {};
      const graphData = await requestGraph(query);
      req.locals.graphData = graphData.answers;
      next();
    } catch (err) {
      next(new APIError(httpStatus.BAD_REQUEST));
    }
  };
}
