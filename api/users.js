import { Users } from "./storage";
import { timeout, uuid } from "@/helper";

const getUserById = (uuid) => {
    return (uuid === undefined) ? Users[0] : Users.find(item => item.uuid === uuid);
};

const getUsers = async (offset = 0, limit) => {
    await timeout();
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

const createUser = (user) => {
    user["uuid"] = uuid();
    Users.unshift(user);
    return true;
}

const updateUser = (user) => {
    for (let index = 0; index < Users.length; index++) {
        if(user.uuid === Users[index].uuid){
            if(user.address) {
                user.address = {
                    full: user.address
                }
            }
            Users[index] = user;
            break;
        }        
    }
}

export default {
    getUsers,
    getUserById,
    getUsersBySearch,
    getUsersByAge,
    createUser,
    updateUser
};