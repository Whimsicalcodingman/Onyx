import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.spacexdata.com/v5', // Base API URL
  timeout: 10000, // Optional: Set a timeout to avoid hanging requests
});

export default apiClient;
