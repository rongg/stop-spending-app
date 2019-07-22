import {apiEndpoint} from '../api';
import http from './httpService';
import Joi from "joi-browser";

const apiUrl = apiEndpoint + '/users';

export function register(user){
    return http.request({
        method: 'post',
        url: apiUrl,
        headers: {
            'Content-Type': 'application/json'
        },
        data: user
    });
}

export function update(user){
    return http.request({
        method: 'put',
        url: apiUrl + '/' + user._id,
        headers: {
            'Content-Type': 'application/json'
        },
        data: user
    });
}

export function verifyAccount(token){
    return http.request({
        method: 'post',
        url: apiUrl + '/verify/' + token,
    });
}

export function resendVerificationToken(){
    return http.request({
        method: 'post',
        url: apiUrl + '/resend/verification',
    });
}

function requestPasswordReset(email){
    return http.request({
        method: 'post',
        url: apiUrl + '/reset/password',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {email}
    });
}

function resetPassword(userId, password, token){
    return http.request({
        method: 'post',
        url: apiUrl + '/reset/password/' + token,
        headers: {
            'Content-Type': 'application/json'
        },
        data: {userId, password}
    });
}

export const schema = {
    _id: Joi.string().max(25),
    name: Joi.string().min(3).max(50).required().label("Name"),
    email: Joi.string().min(5).max(50).required().email().label("Email"),
    password: Joi.string().min(5).max(25).required().label("Password")
};

export default {register, update, schema, verifyAccount, resendVerificationToken, requestPasswordReset, resetPassword};