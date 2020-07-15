export default function debounce(callback, delay = 250) {
  console.log('called debounce vjgfjyf'); // eslint-disable-line

  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), delay);
  };
}
