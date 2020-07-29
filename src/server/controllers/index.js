import httpStatus from 'http-status';
import { UniqueConstraintError, Op } from 'sequelize';

import APIError from '~/server/helpers/errors';
import { filterResponse, respondWithSuccess } from '~/server/helpers/respond';
import {
  singularize,
  pluralize,
  uppercaseFirst,
} from '~/common/helpers/strings';

const DEFAULT_LIMIT = 20;
const DEFAULT_ORDER_DIRECTION = 'asc';
const DEFAULT_ORDER_KEY = 'id';

// The base controller handles basic CRUD requests for all types of resources.
// It manages API responses (what is publicly visible and what not), errors,
// pagination, and updates associations accordingly. All of this can be
// configured via the `options` object.

// Filters response accordingly to only expose certain fields to the public API
export function filterResponseFields(req, data, options) {
  // Filter association responses as well
  if (options.associations) {
    options.associations.forEach(
      ({
        association,
        fields = [],
        fieldsProtected = [],
        associations = [],
      }) => {
        const { as } = association;

        if (as in data && data[as]) {
          let newData;

          if (Array.isArray(data[as])) {
            newData = data[as].reduce((acc, item) => {
              acc.push(
                filterResponseFields(req, item, {
                  fields,
                  fieldsProtected,
                  associations,
                }),
              );

              return acc;
            }, []);
          } else {
            newData = filterResponseFields(req, data[as], {
              fields,
              fieldsProtected,
              associations,
            });
          }

          data.set(as, newData, {
            raw: true,
          });
        }
      },
    );
  }

  // Show protected fields when user is authenticated
  const fields =
    req.locals && req.locals.user
      ? options.fields.concat(options.fieldsProtected)
      : options.fields;

  return filterResponse(data, fields);
}

export function filterResponseFieldsAll(req, arr, options) {
  return arr.map((data) => {
    return filterResponseFields(req, data, options);
  });
}

// Helper method to handle associations of resources, removing or adding them
// when needed
async function handleAssociation(instance, options, items) {
  // Prepare names for different operations
  const name = singularize(options.association.target.name);
  const nameUppercase = uppercaseFirst(name);
  const namePlural = pluralize(name);
  const namePluralUppercase = uppercaseFirst(namePlural);

  // Collect ids of all items to be associated to instance
  const ids = [];
  items.forEach((item) => {
    if (typeof item === 'number') {
      ids.push(item);
    } else if (!('id' in item)) {
      throw new Error('`id` missing in association items');
    } else {
      ids.push(item.id);
    }
  });

  // Get items we want to be associated with
  const futureItems = await options.association.target.findAll({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  });

  // Get already existing associations of that kind
  const currentItems = await instance[`get${namePluralUppercase}`]();

  const currentIds = currentItems.map((item) => {
    return item.id;
  });

  // Check for to-be-removed associations
  const removePromises = currentItems
    .filter((item) => {
      return !ids.includes(item.id);
    })
    .reduce((acc, item) => {
      acc.push(instance[`remove${nameUppercase}`](item));

      // Remove item itself when cascade is enabled
      if (options.destroyCascade) {
        acc.push(item.destroy());
      }

      return acc;
    }, []);

  // Check for to-be-added / new associations
  const addPromises = futureItems
    .filter((futureItem) => {
      return !currentIds.includes(futureItem.id);
    })
    .map((item) => {
      return instance[`add${nameUppercase}`](item);
    });

  return Promise.all([...removePromises, ...addPromises]);
}

async function handleAssociations(instance, associations, data) {
  if (!associations) {
    return;
  }

  const promises = associations.map((association) => {
    if (!('association' in association)) {
      throw new Error('`association` required in association');
    }

    const { as = association.as } = association.association;

    if (!(as in data)) {
      throw new Error(
        'Invalid `as` key, cant find association data in instance',
      );
    }

    return handleAssociation(instance, association, data[as]);
  }, []);

  return Promise.all(promises);
}

// Remove all associations by passing on an empty array to handler
async function destroyAssociations(instance, associations) {
  if (!associations) {
    return;
  }

  const promises = associations.map((association) => {
    if (!('association' in association)) {
      throw new Error('`association` required in association');
    }

    return handleAssociation(instance, association, []);
  }, []);

  return Promise.all(promises);
}

function create(options) {
  return async (req, res, next) => {
    try {
      const instance = await options.model.create(req.body);

      await handleAssociations(instance, options.associations, req.body);

      respondWithSuccess(
        res,
        filterResponseFields(req, instance, options),
        httpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        next(new APIError(httpStatus.CONFLICT));
      } else {
        next(error);
      }
    }
  };
}

function readAll(options) {
  return async (req, res, next) => {
    const {
      limit = DEFAULT_LIMIT,
      offset = 0,
      orderDirection = DEFAULT_ORDER_DIRECTION,
      orderKey = DEFAULT_ORDER_KEY,
    } = req.query;

    try {
      const response = await options.model.findAndCountAll({
        limit,
        offset,
        order: [[orderKey, orderDirection.toUpperCase()]],
        include: options.include,
        distinct: true,
      });

      respondWithSuccess(res, {
        results: filterResponseFieldsAll(req, response.rows, options),
        pagination: {
          limit: parseInt(limit, 10),
          offset: parseInt(offset, 10),
          orderDirection,
          orderKey,
          total: response.count,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

function read(options) {
  return async (req, res, next) => {
    try {
      const instance = await options.model.findOne({
        rejectOnEmpty: true,
        where: {
          id: req.locals.resource.id,
        },
        include: options.include,
      });

      const filter = options.customFilter
        ? options.customFilter
        : filterResponseFields;

      const filteredResults = filter(req, instance, options);

      respondWithSuccess(res, filteredResults);
    } catch (error) {
      next(error);
    }
  };
}

function update(options) {
  return async (req, res, next) => {
    try {
      const instance = await options.model.update(req.body, {
        where: {
          id: req.locals.resource.id,
        },
        individualHooks: true,
        include: options.include,
      });

      await handleAssociations(instance[1][0], options.associations, req.body);

      respondWithSuccess(res, null, httpStatus.NO_CONTENT);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        next(new APIError(httpStatus.CONFLICT));
      } else {
        next(error);
      }
    }
  };
}

function destroy(options) {
  return async (req, res, next) => {
    try {
      const instance = await options.model.findOne({
        rejectOnEmpty: true,
        where: {
          id: req.locals.resource.id,
        },
      });

      if (options.associations) {
        await destroyAssociations(instance, options.associations);
      }

      await instance.destroy();

      respondWithSuccess(res, null, httpStatus.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  };
}

export default {
  create,
  read,
  readAll,
  update,
  destroy,
};
