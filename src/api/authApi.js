import axios from 'axios';

const authApi = axios.create({
  baseURL: 'https://identitytoolkit.googleapis.com/v1',
  params: {
    key: '<api_key>'
  }
});

export default authApi;
