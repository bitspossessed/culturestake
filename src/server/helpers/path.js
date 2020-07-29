import path from 'path';

export function getBuildPath(filePath) {
  if (process.env.NODE_ENV === 'production') {
    return path.resolve(__dirname, '..', filePath);
  }

  return path.resolve(__dirname, '..', '..', '..', 'build', filePath);
}

export function getPath(filePath) {
  return path.resolve(__dirname, '..', '..', '..', filePath);
}
