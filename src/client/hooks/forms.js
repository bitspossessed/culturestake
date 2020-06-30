import Joi from '@hapi/joi';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  useField as useReactFormField,
  useForm as useReactForm,
} from 'react-form';

import translate from '~/common/services/i18n';

import ButtonOutline from '~/client/components/ButtonOutline';
import ButtonSubmitDefault from '~/client/components/ButtonSubmit';
import {
  destroyRequest,
  postRequest,
  putRequest,
} from '~/client/store/api/actions';
import { useRequestId, useRequest } from '~/client/hooks/requests';
import { useResource } from '~/client/hooks/resources';

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
      validate: (value) => {
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

export const useNewForm = ({
  fields,
  onError,
  onSuccess,
  resourcePath,
  returnUrl,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const requestId = useRequestId();

  const {
    Form,
    meta: {
      canSubmit,
      request: { isPending },
    },
  } = useForm({
    requestId,
    onSubmit: (values) => {
      dispatch(
        putRequest({
          id: requestId,
          path: resourcePath,
          body: fields.reduce((acc, key) => {
            acc[key] = values[key];
            return acc;
          }, {}),
        }),
      );
    },
    onSuccess: (resource) => {
      if (onSuccess) {
        onSuccess(resource);
      }

      history.push(returnUrl);
    },
    onError: () => {
      if (onError) {
        onError();
      }
    },
  });

  const ButtonSubmit = () => {
    return (
      <ButtonSubmitDefault disabled={!canSubmit} isPending={isPending}>
        {translate('default.buttonSubmitNew')}
      </ButtonSubmitDefault>
    );
  };

  return {
    ButtonSubmit,
    Form,
  };
};

export const useEditForm = ({
  fields,
  onDeleteError,
  onDeleteSuccess,
  onNotFound,
  onUpdateError,
  onUpdateSuccess,
  resourcePath,
  returnUrl,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const requestId = useRequestId();
  const requestIdDelete = useRequestId();

  const [isLoading, setIsLoading] = useState(false);

  const [resource, isLoadingResource] = useResource(resourcePath, {
    onError: () => {
      if (onNotFound) {
        onNotFound();
      }

      history.push(returnUrl);
    },
  });

  const {
    Form,
    meta: {
      canSubmit,
      request: { isPending },
    },
  } = useForm({
    requestId,
    defaultValues: resource,
    onSubmit: (values) => {
      dispatch(
        postRequest({
          id: requestId,
          path: resourcePath,
          body: fields.reduce((acc, key) => {
            acc[key] = values[key];
            return acc;
          }, {}),
        }),
      );
    },
    onSuccess: () => {
      if (onUpdateSuccess) {
        onUpdateSuccess(resource);
      }

      history.push(returnUrl);
    },
    onError: () => {
      if (onUpdateError) {
        onUpdateError(resource);
      }
    },
  });

  useRequest(requestIdDelete, {
    onSuccess: () => {
      if (onDeleteSuccess) {
        onDeleteSuccess(resource);
      }

      setIsLoading(false);

      history.push(returnUrl);
    },
    onError: () => {
      if (onDeleteError) {
        onDeleteError(resource);
      }

      setIsLoading(false);
    },
  });

  const onClickDestroy = () => {
    if (!window.confirm(translate('default.areYouSure'))) {
      return;
    }

    dispatch(
      destroyRequest({
        id: requestIdDelete,
        path: resourcePath,
      }),
    );

    setIsLoading(true);
  };

  const isDisabled = !canSubmit || isLoading || isLoadingResource;

  const ButtonSubmit = () => {
    return (
      <ButtonSubmitDefault disabled={isDisabled} isPending={isPending}>
        {translate('default.buttonSubmitEdit')}
      </ButtonSubmitDefault>
    );
  };

  const ButtonDelete = () => {
    return (
      <ButtonOutline disabled={!canSubmit} isDangerous onClick={onClickDestroy}>
        {translate('default.buttonDestroy')}
      </ButtonOutline>
    );
  };

  return {
    ButtonDelete,
    ButtonSubmit,
    Form,
  };
};
