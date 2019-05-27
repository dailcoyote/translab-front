import { Users } from "./storage";

const getUserById = (uuid) => {
    return (uuid === undefined) ? Users[0] : Users.find(item => item.uuid === uuid);
};

const getUsers = (offset = 0, limit) => {
    return (limit) ? Users.slice(offset, limit + offset) : Users;
};

const getUsersBySearch = (searchStr, offset = 0, limit = 10) => {
    const filtered = searchStr
        ? Users.filter(item => {
            return item.firstname.toLowerCase().indexOf(searchStr.toLowerCase()) >= 0 
                || item.lastname.toLowerCase().indexOf(searchStr.toLowerCase()) >= 0
                || item.email.toLowerCase().indexOf(searchStr.toLowerCase()) >= 0
        })
        : []
    return {
        users: filtered.slice(offset, limit + offset),
        count: filtered.length
    }
};

const getUsersByAge = (ageFrom, ageTo = 100, offset = 0, limit = 10) => {
    Users.filter(item => {
        return item.age >= ageFrom && item.age <= ageTo
    }).slice(offset, limit + offset)
};

export default {
    getUsers,
    getUserById,
    getUsersBySearch,
    getUsersByAge
};