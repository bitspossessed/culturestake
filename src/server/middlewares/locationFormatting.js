export default async function locationFormatting(req, res, next) {
  if (req.body && req.body.latitude && req.body.longitude) {
    req.body.location = {
      type: 'Point',
      coordinates: [req.body.latitude, req.body.longitude],
    };
  }
  next();
}
