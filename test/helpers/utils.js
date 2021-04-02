export const delay = (ms, value) => {
  let cancel;

  const thunk = new Promise((resolve, reject) => {
    let timeOut = setTimeout(() => resolve(value), ms);
    cancel = () => {
      if (timeOut) {
        clearTimeout(timeOut);
        timeOut = null;
      }
      reject(new Error('Promise canceled'));
    };
  });
  thunk.cancel = cancel;
  return thunk;
};
