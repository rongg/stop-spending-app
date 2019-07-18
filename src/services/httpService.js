import axios from 'axios';


axios.interceptors.response.use(null, error => {
    console.log('UNEXPECTED ERROR', error);
    let expectedError = error.response && error.response.status >= 400 && error.response.status < 500;
    if (expectedError) {
        if(error.response.status === 401){
            window.location = "/logout";
            return;
        }
        return Promise.reject(error);
    } else {
        console.log('Log this error', error.response);
        alert('An unexpected error occurred!');
    }

});

function setJwt(jwt){
    axios.defaults.headers.common['x-auth-token'] = jwt;
}

export default {
    request: axios,
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    setJwt
}