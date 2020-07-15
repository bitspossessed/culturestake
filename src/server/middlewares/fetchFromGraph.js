import httpStatus from 'http-status';

import APIError from '~/server/helpers/errors';
import requestGraph from '~/common/services/subgraph';

export default function fetchFromGraphMiddleware(queryBuilder, paramName) {
  return async (req, res, next) => {
    const query = queryBuilder(req.params[paramName]);

    try {
      const graphData = await requestGraph(query);

      req.locals = req.locals || {};
      req.locals.graphData = graphData;

      next();
    } catch (err) {
      next(new APIError(httpStatus.BAD_REQUEST));
    }
  };
}
