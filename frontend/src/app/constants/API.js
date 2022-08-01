export const API_PORT = window?.___env_vars___?.API_PORT || 8000;

export const ABSOLUTE_API_HOSTNAME = window?.___env_vars___?.ABSOLUTE_API_HOSTNAME || 'localhost';

export const API_PROTOCOL = window?.___env_vars___?.API_PROTOCOL || 'http';

export const ABSOLUTE_API_HOST = `${API_PROTOCOL}://${ABSOLUTE_API_HOSTNAME}:${API_PORT}`;
