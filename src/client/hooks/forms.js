import Joi from '@hapi/joi';

import {
  useField as useReactFormField,
  useForm as useReactForm,
} from 'react-form';

import { useRequest } from '~/client/hooks/requests';

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
  // Wrap our custom validation method around react-form API
  const formApi = useReactForm({
    ...rest,
    onSubmit: async (values, instance) => {
      const { value: sanitizedValues } = Joi.object(schema).validate(values);
      onSubmit(sanitizedValues, instance);
    },
  });

  // Check for state of the current request
  const request = useRequest(requestId, {
    onError,
    onSuccess: () => {
      if (onSuccess) {
        onSuccess(formApi.values);
      }
    },
  });

  // Give option to manually set isPending state in meta if
  // we need to indicate that something is loading before we
  // can submit
  const isPending = 'isPending' in formApi.meta && formApi.meta.isPending;

  // Handle callbacks for request state changes
  return {
    ...formApi,
    meta: {
      ...formApi.meta,
      canSubmit: formApi.meta.canSubmit && !request.isPending && !isPending,
      request,
    },
  };
};
