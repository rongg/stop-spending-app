import {apiEndpoint} from '../api';
import http from './httpService';
import Joi from "joi-browser";

const apiUrl = apiEndpoint + '/expenses';

export function create(expense){
    return http.request({
        method: 'post',
        url: apiUrl,
        headers: {
            'Content-Type': 'application/json'
        },
        data: expense
    });
}

export function update(expense){
    return http.request({
        method: 'put',
        url: apiUrl + '/' + expense._id,
        headers: {
            'Content-Type': 'application/json'
        },
        data: expense
    });
}

export function deleteExpense(id){
    return http.request({
        method: 'delete',
        url: apiUrl + '/' + id,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export function get(){
    return http.request({
        method: 'get',
        url: apiUrl
    });
}

export function getForId(id){
    return http.request({
        method: 'get',
        url: apiUrl + "/" + id
    });
}

export function getForHabit(habitId){
    return http.request({
        method: 'get',
        url: apiUrl + "?habitId=" + habitId
    });
}

export function getDefaultIcon(){
    return 'https://blacklabelagency.com/wp-content/uploads/2017/08/money-icon.png';
}

const schema = {
    _id: Joi.string().max(25),
        userId: Joi.string().max(25).required(),
    name: Joi.string().min(5).max(50).required(),
    amount: Joi.number().integer().min(1).max(1000000000).required(),
    date: Joi.date(),
    habitId: Joi.string().max(25)
};

export default {
    create, get, getForId, getForHabit, update, deleteExpense, getDefaultIcon, schema
}