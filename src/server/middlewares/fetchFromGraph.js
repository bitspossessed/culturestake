import requestGraph from '~/common/services/subgraph';

export default function fetchFromGraphMiddleware(queryBuilder, params) {
  return async (req, res, next) => {
    const query = queryBuilder({ ...params });
    const graphData = await requestGraph(query);
    console.log(graphData)

    req.locals = req.locals || {};
    req.locals.graphData = graphData;

    next();
  };
}
