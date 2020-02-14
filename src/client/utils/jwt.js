import decode from 'jwt-decode';

export default function decodeToken(token) {
  try {
    return decode(token);
  } catch {
    return null;
  }
}
