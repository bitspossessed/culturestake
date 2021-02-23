import Joi from 'joi';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  useField as useReactFormField,
  useForm as useReactForm,
} from 'react-form';

import translate from '~/common/services/i18n';
import ButtonOutline from '~/client/components/ButtonOutline';
import {
  destroyRequest,
  postRequest,
  putRequest,
} from '~/client/store/api/actions';
import { addPendingTransaction } from '~/client/store/ethereum/actions';
import { usePendingTransaction } from '~/client/hooks/ethereum';
import { useRequestId, useResource, useRequest } from '~/client/hooks/requests';

const joiOptions = {
  errors: {
    label: false,
  },
};

export const useField = (
  fieldName,
  { validate: schema, defaultValue = undefined, ...fieldOptions },
) => {
  return useReactFormField(
    fieldName,
    Object.assign({}, fieldOptions, {
      // Set a default value to prevent component to be disconnected when mounted
      defaultValue: typeof defaultValue === 'undefined' ? '' : defaultValue,

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

const useForm = ({ onSubmit, schema, ...rest }) => {
  // Wrap our custom validation method around react-form API
  return useReactForm({
    ...rest,
    onSubmit: async (values, instance) => {
      const { value: sanitizedValues } = Joi.object(schema).validate(values);
      await onSubmit(sanitizedValues, instance);
    },
  });
};

export const useRequestForm = ({
  onError,
  onSubmit,
  onSuccess,
  requestId,
  schema,
  ...rest
}) => {
  const formApi = useForm({
    ...rest,
    onSubmit,
    schema,
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

  // Handle callbacks for request state changes
  return {
    ...formApi,
    meta: {
      ...formApi.meta,
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

  const { Form, setFieldValue, values } = useRequestForm({
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

  return {
    Form,
    setFieldValue,
    values,
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

  const [resource, isResourceLoading] = useResource(resourcePath, {
    onError: () => {
      if (onNotFound) {
        onNotFound();
      }

      history.push(returnUrl);
    },
  });

  const {
    Form,
    meta: { canSubmit },
  } = useRequestForm({
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

      history.push(returnUrl);
    },
    onError: () => {
      if (onDeleteError) {
        onDeleteError(resource);
      }
    },
  });

  const onClickDestroy = (event) => {
    event.preventDefault();

    if (!window.confirm(translate('default.areYouSure'))) {
      return;
    }

    dispatch(
      destroyRequest({
        id: requestIdDelete,
        path: resourcePath,
      }),
    );
  };

  const ButtonDelete = () => {
    return (
      <ButtonOutline disabled={!canSubmit} isDanger onClick={onClickDestroy}>
        {translate('default.buttonDestroy')}
      </ButtonOutline>
    );
  };

  return {
    ButtonDelete,
    Form,
    isResourceLoading,
    resource,
  };
};

export const useContractsForm = ({ onSubmit }) => {
  const dispatch = useDispatch();
  const [txMethod, setTxMethod] = useState();
  const [txParams, setTxParams] = useState({});

  const formApi = useForm({
    onSubmit: async (params) => {
      // Execute transaction ...\
      try {
        const result = await onSubmit(params);

        // ... and add to pending transactions list
        dispatch(
          addPendingTransaction({
            txMethod: result.txMethod,
            txHash: result.txHash,
            params,
          }),
        );

        setTxMethod(result.txMethod);
        setTxParams(params);
      } catch {
        // Do nothing ...
      }
    },
  });

  // Get current transaction state
  const request = usePendingTransaction({ txMethod, params: txParams });

  // Handle callbacks for request state changes
  return {
    ...formApi,
    meta: {
      ...formApi.meta,
      request,
    },
  };
};
