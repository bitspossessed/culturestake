export default async function locationFormatting(req, res, next) {
  if (req.body && req.body.location) {
    req.body.location = {
      type: 'Point',
      coordinates: [req.body.location.latitude, req.body.location.longitude],
    };
  }
  next();
}
