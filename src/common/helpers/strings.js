export const isString = (x) => {
  return typeof x === 'string';
};

export function uppercaseFirst(str) {
  return `${str[0].toUpperCase()}${str.substr(1)}`;
}

export function pluralize(str, suffix = 's') {
  if (str[str.length - 1] === suffix) {
    return str;
  }

  return `${str}${suffix}`;
}

export function singularize(str, suffix = 's') {
  if (str[str.length - 1] !== suffix) {
    return str;
  }

  return str.slice(0, -1);
}
