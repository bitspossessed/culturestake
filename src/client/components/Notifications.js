import PropTypes from 'prop-types';
import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import styles from '~/client/styles/variables';
import {
  NotificationsTypes,
  removeNotification,
} from '~/client/store/notifications/actions';

const NOTIFICATIONS_COLORS = {
  [NotificationsTypes.INFO]: styles.colors.violet,
  [NotificationsTypes.WARNING]: styles.colors.magenta,
  [NotificationsTypes.ERROR]: styles.colors.red,
};

const Notifications = () => {
  const { messages } = useSelector((state) => state.notifications);

  if (messages.length === 0) {
    return null;
  }

  return (
    <NotificationsStyle>
      <NotificationsList items={messages} />
    </NotificationsStyle>
  );
};

const NotificationsList = (props) => {
  return props.items.map((item) => {
    return (
      <NotificationsItem
        id={item.id}
        key={item.id}
        lifetime={item.lifetime}
        text={item.text}
        type={item.type}
      />
    );
  });
};

const NotificationsItem = ({ id, lifetime, text, type }) => {
  const dispatch = useDispatch();

  const onRemove = useCallback(() => {
    dispatch(removeNotification(id));
  }, [dispatch, id]);

  useEffect(() => {
    let timeout;

    if (lifetime > 0) {
      timeout = window.setTimeout(() => {
        onRemove();
      }, lifetime);
    }

    return () => {
      if (timeout) {
        window.clearTimeout(timeout);
      }
    };
  }, [onRemove, lifetime]);

  return (
    <NotificationsItemStyle type={type} onClick={onRemove}>
      {text}
    </NotificationsItemStyle>
  );
};

const NotificationsStyle = styled.ul`
  position: fixed;

  top: 10rem;
  right: ${styles.layout.spacing};
  left: ${styles.layout.spacing};

  z-index: ${styles.layers.Notifications};

  max-width: ${styles.layout.maxWidth};

  margin: 0 auto;
  padding: 0;

  list-style: none;
`;

const NotificationsItemStyle = styled.li`
  padding: 1rem;

  border: 1.5px solid;
  border-color: ${(props) => {
    return NOTIFICATIONS_COLORS[props.type];
  }};

  color: ${(props) => {
    return NOTIFICATIONS_COLORS[props.type];
  }};

  cursor: pointer;

  & + & {
    margin-top: 1rem;
  }
`;

NotificationsList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      lifetime: PropTypes.number,
      text: PropTypes.string,
      type: PropTypes.symbol,
    }),
  ).isRequired,
};

NotificationsItem.propTypes = {
  id: PropTypes.number.isRequired,
  lifetime: PropTypes.number,
  text: PropTypes.string.isRequired,
  type: PropTypes.symbol.isRequired,
};

export default Notifications;
