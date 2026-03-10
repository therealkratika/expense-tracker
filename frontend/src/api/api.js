import axios from 'axios';
import { auth } from '../firebase';

const api = axios.create({
  baseURL: 'https://expense-tracker-4v4b.onrender.com',
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    console.log('Sending token:', token);
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
