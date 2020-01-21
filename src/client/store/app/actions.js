import ActionTypes from '~/store/app/types';

export function initializeApp() {
  return {
    type: ActionTypes.APP_INITIALIZE,
  };
}
