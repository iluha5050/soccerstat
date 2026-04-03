
import axios from 'axios';

console.log('API Key from env:', import.meta.env.VITE_FOOTBALL_API_KEY);

const client = axios.create({
  baseURL: '/api', // запрос идёт через прокси
  headers: {
    'X-Auth-Token': import.meta.env.VITE_FOOTBALL_API_KEY,
  },
});

export default client;