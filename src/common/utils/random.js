export function randomRange(min, max) {
  return min + Math.round(Math.random() * (max - min));
}

export function randomFromArray(arr) {
  return arr[randomRange(0, arr.length - 1)];
}
