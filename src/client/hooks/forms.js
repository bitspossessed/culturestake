import Joi from '@hapi/joi';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import {
  useField as useReactFormField,
  useForm as useReactForm,
} from 'react-form';

const joiOptions = {
  errors: {
    label: false,
  },
};

export const useField = (fieldName, { validate: schema, ...fieldOptions }) => {
  return useReactFormField(
    fieldName,
    Object.assign({}, fieldOptions, {
      // Set a default value to prevent component to be disconnected when mounted
      defaultValue: fieldOptions.defaultValue || '',

      // Validate via Joi schema and take ValidationError message from it
      validate: value => {
        const { error } = schema.validate(value, joiOptions);

        if (error) {
          return error.message;
        }

        return false;
      },
    }),
  );
};

export const useForm = ({
  onError,
  onSubmit,
  onSuccess,
  requestId,
  schema,
  ...rest
}) => {
  // Check for state of the current request
  const {
    isError = false,
    isSuccess = false,
    isPending = false,
    error,
  } = useSelector(state => {
    return state.api.requests[requestId] || {};
  });

  // Handle callbacks for request state changes
  useEffect(() => {
    if (isError && onError) {
      onError(error);
    } else if (isSuccess && onSuccess) {
      onSuccess();
    }
  }, [isError, isSuccess]);

  // Wrap our custom validation method around react-form API
  const formApi = useReactForm({
    ...rest,
    onSubmit: async (values, instance) => {
      const { value: sanitizedValues } = Joi.object(schema).validate(values);
      onSubmit(sanitizedValues, instance);
    },
  });

  return {
    ...formApi,
    meta: {
      ...formApi.meta,
      canSubmit: formApi.meta.canSubmit && !isPending,
      request: {
        isError,
        isPending,
        isSuccess,
      },
    },
  };
};
