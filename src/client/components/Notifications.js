import PropTypes from 'prop-types';
import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import styles from '~/client/styles/variables';
import { HeadingPrimaryStyle } from '~/client/styles/typography';
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
    <NotificationsItemStyle
      color={NOTIFICATIONS_COLORS[type]}
      onClick={onRemove}
    >
      <NotificationItemTextStyle>{text}</NotificationItemTextStyle>
    </NotificationsItemStyle>
  );
};

const NotificationsStyle = styled.ul`
  position: fixed;

  top: 0;
  right: 0;
  left: 0;

  z-index: ${styles.layers.Notifications};

  margin: 0 auto;
  padding: 0;

  list-style: none;
`;

const NotificationsItemStyle = styled.li`
  display: block;

  color: ${styles.colors.white};

  background-color: ${(props) => {
    return props.color;
  }};

  text-align: center;

  cursor: pointer;
`;

const NotificationItemTextStyle = styled(HeadingPrimaryStyle)`
  padding: 2rem;
  padding-top: 4rem;
  padding-bottom: 4rem;

  text-align: center;
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
