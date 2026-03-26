/* import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api`
  : '/api';

const api = axios.create({ baseURL });

api.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('sovereignUser') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sovereignUser');
      window.location.href = '/inner-circle/login';
    }
    return Promise.reject(err);
  }
);

export default api;
*/

import axios from 'axios';

// Hardcoded for production — change this if your Render URL changes
const PRODUCTION_API = 'https://sovranty-gems.onrender.com';

const baseURL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api`
  : process.env.NODE_ENV === 'production'
  ? `${PRODUCTION_API}/api`
  : '/api';

const api = axios.create({ baseURL });

api.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('sovereignUser') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sovereignUser');
      window.location.href = '/inner-circle/login';
    }
    return Promise.reject(err);
  }
);

export default api;