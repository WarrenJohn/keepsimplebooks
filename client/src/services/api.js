// import axios from 'axios';
// import store from '../store';
//
// export default () => {
//     return axios.create({
//         baseURL: '/API/',
//         headers: {'Authorization': `Bearer ${store.state.token}`}
//     });
// };
import axios from 'axios'; import store from '../store';

let api = axios.create({
    baseURL: '/API/',
    headers: {'Authorization': `Bearer ${store.state.token}`}
});

export default api;
