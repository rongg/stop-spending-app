import {apiEndpoint} from '../api';
import http from './httpService';
import jwtDecode from "jwt-decode";

const apiUrl = apiEndpoint + '/auth';

http.setJwt(getJwt());

export function login(email, password){
    return http.request({
        method: 'post',
        url: apiUrl,
        headers: {
            'Content-Type': 'application/json'
        },
        data: {email, password}
    });
}

export function loginWithJwt(jwt){
    localStorage.setItem("token", jwt);
}

export function logout(){
    localStorage.removeItem("token");
}

export function getCurrentUser(){
    try {
        const jwt = localStorage.getItem('token');
        return jwtDecode(jwt);
    }catch(ex){
        return null;
    }
}

export function getJwt(){
    return localStorage.getItem('token');
}


export default {
    login, logout, getCurrentUser, loginWithJwt, getJwt
}