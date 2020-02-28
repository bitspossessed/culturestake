import ActionTypes from '~/client/store/notifications/types';

const DEFAULT_LIFETIME = 5000;

export const NOTIFY = Symbol('Notifications');

export const NotificationsTypes = {
  INFO: Symbol('NotificationsTypesInfo'),
  WARNING: Symbol('NotificationsTypesWarning'),
  ERROR: Symbol('NotificationsTypesError'),
};

export default function notify({
  text,
  type = NotificationsTypes.INFO,
  lifetime = DEFAULT_LIFETIME,
}) {
  return {
    type: ActionTypes.NOTIFICATIONS_ADD,
    meta: {
      lifetime,
      text,
      type,
    },
  };
}

export function removeNotification(id) {
  return {
    type: ActionTypes.NOTIFICATIONS_REMOVE,
    meta: {
      id,
    },
  };
}

export function removeAllNotifications() {
  return {
    type: ActionTypes.NOTIFICATIONS_REMOVE_ALL,
  };
}
