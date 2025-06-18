import axios from 'axios';
import url from '../components/Url_api'

const api = axios.create({
  baseURL: url,
  headers: {
    'Access': '3295c76acbf4caaed33c36b1b5fc2cb1',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wIjoiRW1wcmVzYTEiLCJuYW1lIjoiYWRtaW4iLCJpZCI6MX0.Gp1-NqUdH83PVUQIkX1kZy-gL2yG1ntCSlUk_DLOqUQ',
    'Content-Type': 'application/json'
  }
});

export default api;
