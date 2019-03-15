import axios from 'axios';
import store from '../store';

class ApplicationAPI {
    constuctor()
    {
        this._axios = axios.create({
            baseURL: '/API/',
        });
    }

    _getAuthHeader()
    {
     return {'Authorization': `Bearer ${store.state.token}`};
    }

    uploadTransaction(transactionData)
    {
        return axios({
            method: 'post',
            url:'/API/transactions/upload',
            headers: this._getAuthHeader(),
            data: transactionData
        });
    }
    getRoute(url)
    {
        return axios({
            method: 'get',
            url:`/API/${url}`,
            headers: this._getAuthHeader()
        });
    }
    deleteTransaction(id){
        return axios({
            method: 'delete',
            url:`/API/transactions${id}`,
            headers: this._getAuthHeader()
        });
    }
    deleteTag(id){
        return axios({
            method: 'delete',
            url:`/API/tags/${id}`,
            headers: this._getAuthHeader()
        });
    }
    deleteCategory(id){
        return axios({
            method: 'delete',
            url:`/API/categories/${id}`,
            headers: this._getAuthHeader()
        });
    }
    deleteAllTransactions(){
        return axios({
            method: 'delete',
            url:`/API/transactions/all`,
            headers: this._getAuthHeader()
        });
    }
}

export default new ApplicationAPI();
