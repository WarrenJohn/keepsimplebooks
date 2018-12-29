import api from '@/services/api';

export default {
    register (creds){
        return api().post('register', creds);
    }
};
