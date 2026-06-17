/** Decodifica el payload del JWT almacenado en localStorage sin verificar la firma. */
export const getTokenPayload = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const decoded = atob(padded);
    const json = decodeURIComponent(
      decoded
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(json);
  } catch (error) {
    console.error('Error decoding token payload:', error);
    return null;
  }
};

/** Extrae el rol del usuario desde el token JWT. */
export const getRoleFromToken = () => {
  const payload = getTokenPayload();
  if (!payload) return null;
  return payload.rol || payload.role || null;
};

/** Extrae el nombre del usuario desde el token JWT. */
export const getUserNameFromToken = () => {
  const payload = getTokenPayload();
  if (!payload) return null;
  return payload.nombre || payload.name || null;
};
