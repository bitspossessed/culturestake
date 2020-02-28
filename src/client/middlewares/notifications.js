import notify from '~/client/store/notifications/actions';

export const NOTIFICATION = Symbol('notification');

const notificationsMiddleware = store => next => async action => {
  if (NOTIFICATION in action) {
    store.dispatch(notify(action[NOTIFICATION]));
  }

  return next(action);
};

export default notificationsMiddleware;
