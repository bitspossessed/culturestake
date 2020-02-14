import locales from '../locales';

function keyToString(key) {
  if (Object.prototype.toString.call(key) === '[object Array]') {
    return key.join('.');
  }

  return key;
}

function keyToArray(key) {
  if (typeof key === 'string') {
    return key.split('.');
  }

  return key;
}

function countToKey(count) {
  if (count === undefined) {
    return [];
  }

  switch (count) {
    case 0:
      return ['zero'];
    case 1:
      return ['one'];
    default:
      return ['other'];
  }
}

function capitalizeWord(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function titleize(sentence) {
  const result = [];

  sentence.split(' ').forEach(word => {
    result.push(capitalizeWord(word));
  });

  return result.join(' ');
}

function errorMessage(key) {
  if (process.env.NODE_ENV === 'development') {
    const message = `Translation "${keyToString(key)}" is missing.`;
    console.warn(message); // eslint-disable-line no-console
    return message;
  }

  return titleize(keyToArray(key).pop());
}

function interpolate(translation, params) {
  if (!translation || !params || Object.keys(params).length === 0) {
    return translation;
  }

  return translation.replace(/{([^{}]*)}/g, (match, key) => {
    const val = params[key];
    return typeof val === 'string' || typeof val === 'number' ? val : match;
  });
}

function findTranslation(key, params) {
  const path = keyToArray(key).concat(countToKey(params.count));

  const translation = path.reduce((prev, current) => {
    return prev ? prev[current] : undefined;
  }, locales || self);

  return interpolate(translation, params);
}

export default function translate(key, params = {}) {
  const translation = findTranslation(key, params);
  return translation ? translation : errorMessage(key);
}
