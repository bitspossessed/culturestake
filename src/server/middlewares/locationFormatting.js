export default async function locationFormatting(req, res, next) {
  if (req.body && req.body.latitude && req.body.longitude) {
    req.body.location = {
      type: 'Point',
      coordinates: [req.body.longitude, req.body.latitude],
    };
  }
  if (req.body && req.body.radius) {
    req.body.radius = req.body.radius * 1000;
  }
  next();
}
