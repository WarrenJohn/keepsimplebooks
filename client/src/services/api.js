import axios from 'axios';
import store from '../store';

export default () => {
    return axios.create({
        baseURL: '/API/',
        headers: {'Authorization': `Bearer ${store.state.token}`}
    });
};
