import { isString } from '~/common/helpers/strings';

export const dateToTimestamp = (date) => Math.floor(date.getTime() / 1000);

/*
 * Supply the epoch value in seconds.
 */
export const epochToDate = (value) => {
  const epoch = isString(epoch) ? parseInt(value, 10) : value;

  return new Date(epoch * 1000);
};
