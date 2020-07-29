const cache = {};

export function getCached(key) {
  if (!(key in cache)) {
    return null;
  }

  return cache[key];
}

export function setCached(key, value) {
  cache[key] = value;
}
