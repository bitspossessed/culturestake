import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';

import Footer from '~/components/Footer';
import Header from '~/components/Header';
import View from '~/components/View';
import { requestToken } from '~/store/app/actions';

const AdminLogin = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onClick = event => {
    event.preventDefault();

    dispatch(requestToken(email, password));
  };

  const onChange = event => {
    const { name, value } = event.target;

    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  return (
    <Fragment>
      <Header />

      <View>
        <h1>Login</h1>

        <form onSubmit={onClick}>
          <fieldset>
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={onChange}
            />
          </fieldset>

          <fieldset>
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={onChange}
            />
          </fieldset>

          <button type="submit" onClick={onClick}>
            Login
          </button>
        </form>
      </View>

      <Footer />
    </Fragment>
  );
};

export default AdminLogin;
