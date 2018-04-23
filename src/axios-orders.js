import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-app-zhu1991.firebaseio.com/'
});

export default instance;
