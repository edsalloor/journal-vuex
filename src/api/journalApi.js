import axios from 'axios';

const journalApi = axios.create({
  baseURL: 'https://vue-demos-226ef-default-rtdb.firebaseio.com'
});

export default journalApi;
