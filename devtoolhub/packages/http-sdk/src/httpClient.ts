import axios from 'axios';

export const httpClient = axios.create({
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export function setAuthToken(token: string | null): void {
  if (token) {
    httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete httpClient.defaults.headers.common['Authorization'];
  }
}

httpClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.warn('[http-sdk] 401 Unauthorized — token may be expired');
    }
    return Promise.reject(error);
  }
);
