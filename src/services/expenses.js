import {apiEndpoint} from '../api';
import http from './httpService';
import Joi from "joi-browser";
import moment from "moment";

const apiUrl = apiEndpoint + '/expenses';

export function create(expense){
    expense.date = moment(expense.date).utc().toDate();
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
    expense.date = moment(expense.date).utc().toDate();
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

export function get(start, end){
    return http.request({
        method: 'get',
        url: apiUrl + '?start=' + moment(start).utc().toDate() + '&end=' + moment(end).utc().toDate()
    });
}

export function getForId(id){
    return http.request({
        method: 'get',
        url: apiUrl + "/" + id
    });
}

export function getForHabit(habitId, start, end){
    return http.request({
        method: 'get',
        url: apiUrl + "?habitId=" + habitId + "&start=" + start + "&end=" + end
    });
}

export function getDefaultIcon(){
    return 'money_default.svg';
}

const schema = {
    _id: Joi.string().max(25),
        userId: Joi.string().max(25).required(),
    name: Joi.string().min(3).max(50).required(),
    amount: Joi.number().integer().min(1).max(1000000000).required(),
    date: Joi.date(),
    habitId: Joi.string().max(25).allow(''),
    needWant: Joi.string().min(1).max(25).required()
};

export default {
    create, get, getForId, getForHabit, update, deleteExpense, getDefaultIcon, schema
}