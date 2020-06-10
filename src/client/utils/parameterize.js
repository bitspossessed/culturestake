function encode(str) {
  return encodeURIComponent(str);
}

export default function parameterize(obj) {
  if (Object.keys(obj).length === 0) {
    return '';
  }

  return (
    '?' +
    Object.keys(obj)
      .reduce((acc, key) => {
        if (Array.isArray(obj[key])) {
          if (obj[key].length === 0) {
            return acc;
          }

          const merged = obj[key]
            .map((item) => {
              return `${encode(key)}[]=${encode(item)}`;
            })
            .join('&');

          acc.push(merged);
          return acc;
        }

        acc.push(`${encode(key)}=${encode(obj[key])}`);
        return acc;
      }, [])
      .join('&')
  );
}
