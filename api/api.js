import axios from 'axios';
import { API_URL, Access, Authorization } from '@env';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Access': Access,
    'Authorization': Authorization,
    'Content-Type': 'application/json'
  }
});

export default api;
