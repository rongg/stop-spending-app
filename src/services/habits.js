import {apiEndpoint} from '../api';
import http from './httpService';
import Joi from "joi-browser";
import moment from "moment";

const apiUrl = apiEndpoint + '/habits';

export function create(habit) {
    return http.request({
        method: 'post',
        url: apiUrl,
        headers: {
            'Content-Type': 'application/json'
        },
        data: habit
    });
}

export function update(habit) {
    return http.request({
        method: 'put',
        url: apiUrl + '/' + habit._id,
        headers: {
            'Content-Type': 'application/json'
        },
        data: habit
    });
}

export function deleteById(id) {
    return http.request({
        method: 'delete',
        url: apiUrl + '/' + id
    });
}

export function get() {
    return http.request({
        method: 'get',
        url: apiUrl
    });
}

export function getForId(id) {
    return http.request({
        method: 'get',
        url: apiUrl + "/" + id
    });
}

export function createUrge(urge) {
    return http.request({
        method: 'post',
        url: apiUrl + '/' + urge.habitId + '/urge',
        headers: {
            'Content-Type': 'application/json'
        },
        data: urge
    });
}

export function getUrgesForHabit(habitId, start, end) {
    if (!start || !end) {
        throw new Error('start and end params are required!');
    }
    let url = apiUrl + '/' + habitId + '/urges?start=' + moment(start).utc().toDate() + '&end=' + moment(end).utc().toDate();
    return http.request({
        method: 'get',
        url: url,
    });
}

export function getAllUrges(start, end) {
    if (!start || !end) {
        throw new Error('start and end params are required!');
    }
    let url = apiUrl + '/urges/all?start=' + moment(start).utc().toDate() + '&end=' + moment(end).utc().toDate();

    return http.request({
        method: 'get',
        url: url
    });
}

export function getDefaultIcon() {
    return 'money_default.svg';
}


export function createGoal(goal) {
    return http.request({
        method: 'post',
        url: apiUrl + '/' + goal.habitId + '/goal',
        headers: {
            'Content-Type': 'application/json'
        },
        data: goal
    });
}


export function getGoalsForHabit(habitId, params) {
    let url = apiUrl + '/' + habitId + '/goals?';
    if (params.start && params.end) url += 'start=' + params.start + '&end=' + params.end + '&';
    if (params.active !== undefined) url += 'active=' + params.active;
    return http.request({
        method: 'get',
        url: url,
    });
}

export function getAllGoals(params) {
    let url = apiUrl + '/goals/all?';
    if (params.start && params.end) url += 'start=' + params.start + '&end=' + params.end + '&';
    if (params.active !== undefined) url += 'active=' + params.active;
    return http.request({
        method: 'get',
        url: url
    });
}

const schema = {
    _id: Joi.string().max(25),
    userId: Joi.string().max(25).required(),
    name: Joi.string().min(3).max(50).required(),
    budget: Joi.number().integer().min(1).max(1000000000).required(),
    budgetType: Joi.string().min(1).max(25).required(),
    icon: Joi.string().max(255).allow('')
};

const urgeSchema = {
    _id: Joi.string().max(25),
    userId: Joi.string().max(25).required(),
    date: Joi.date().required(),
    habitId: Joi.string().max(25).required()
};

const goalSchema = {
    main: {
        _id: Joi.string().max(25),
        userId: Joi.string().max(25).required(),
        start: Joi.date().required(),
        end: Joi.date().required(),
        habitId: Joi.string().max(25).required(),
        type: Joi.string().max(25).required(),
        period: Joi.string().required(),
        target: Joi.number().min(1).max(100000000000).required(),
        pass: Joi.boolean(),
        active: Joi.boolean()
    },
    abstain: (max) => {
        return {
            _id: Joi.string().max(25),
            userId: Joi.string().max(25).required(),
            start: Joi.date().required(),
            end: Joi.date().required(),
            habitId: Joi.string().max(25).required(),
            type: Joi.string().max(25).required(),
            period: Joi.string().required(),
            target: Joi.number().min(1).max(max).required(),
            pass: Joi.boolean(),
            active: Joi.boolean()
        }
    }
};

export default {
    create,
    get,
    getForId,
    update,
    deleteById,
    getDefaultIcon,
    getUrgesForHabit,
    getAllUrges,
    createUrge,
    createGoal,
    getGoalsForHabit,
    getAllGoals,
    schema,
    urgeSchema,
    goalSchema
}