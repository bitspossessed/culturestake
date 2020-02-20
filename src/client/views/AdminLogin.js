import Joi from '@hapi/joi';
import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, useField, splitFormProps } from 'react-form';

import Footer from '~/client/components/Footer';
import Header from '~/client/components/Header';
import View from '~/client/components/View';
import { requestToken, TOKEN_REQUEST_ID } from '~/client/store/app/actions';

const validationOptions = {
  errors: {
    label: false,
  },
};

// eslint-disable-next-line react/display-name
const InputField = React.forwardRef((props, ref) => {
  const [field, fieldOptions, rest] = splitFormProps(props);

  const {
    meta: { error, isTouched, isValidating },
    getInputProps,
  } = useField(
    field,
    Object.assign({}, fieldOptions, {
      defaultValue: fieldOptions.defaultValue || '',
      validate: value => {
        const { error } = schema[field].validate(value, validationOptions);

        if (error) {
          return error.message;
        }

        return false;
      },
    }),
  );

  // Build the field
  return (
    <Fragment>
      <input {...getInputProps({ ref, ...rest })} />{' '}
      {isValidating ? (
        <em>Validating...</em>
      ) : isTouched && error ? (
        <em>{error}</em>
      ) : null}
    </Fragment>
  );
});

const schema = {
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().required(),
};

const AdminLogin = () => {
  const dispatch = useDispatch();

  const {
    isError = false,
    isSuccess = false,
    isPending = false,
    error,
  } = useSelector(state => {
    return state.api.requests[TOKEN_REQUEST_ID] || {};
  });

  useEffect(() => {
    if (isError) {
      window.alert(error.message);
    } else if (isSuccess) {
      window.alert('Success!');
    }
  }, [isError, isSuccess]);

  const {
    Form,
    meta: { canSubmit },
  } = useForm({
    onSubmit: async values => {
      const { value: sanitizedValues } = Joi.object(schema).validate(values);
      const { email, password } = sanitizedValues;

      dispatch(requestToken(email, password));
    },
  });

  const isDisabled = !canSubmit || isPending;

  return (
    <Fragment>
      <Header />

      <View>
        <h1>Login</h1>

        <Form>
          <InputField field="email" type="email" />
          <InputField field="password" type="password" />

          <button disabled={isDisabled} type="submit">
            Login
          </button>
        </Form>
      </View>

      <Footer />
    </Fragment>
  );
};

export default AdminLogin;
