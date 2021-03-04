import { filterResponseFields } from '~/server/controllers';

export function locationFilter(req, data, options) {
  if (!data.dataValues.location) {
    return filterResponseFields(req, data, {
      ...options,
      associations: [],
    });
  }

  const latitude = data.dataValues.location.coordinates[0];
  const longitude = data.dataValues.location.coordinates[1];

  data.set('latitude', latitude, {
    raw: true,
  });

  data.set('longitude', longitude, {
    raw: true,
  });

  return filterResponseFields(req, data, {
    ...options,
    associations: [],
  });
}
