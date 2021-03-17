import { filterResponseFields } from '~/server/controllers';

export function locationFilter(req, data, options) {
  if (!data.dataValues.location) {
    return filterResponseFields(req, data, {
      ...options,
      associations: [],
    });
  }

  const longitude = data.dataValues.location.coordinates[0];
  const latitude = data.dataValues.location.coordinates[1];
  const radius = data.dataValues.radius / 1000;

  data.set('latitude', latitude, {
    raw: true,
  });

  data.set('longitude', longitude, {
    raw: true,
  });

  data.set('radius', radius);

  return filterResponseFields(req, data, {
    ...options,
    associations: [],
  });
}
