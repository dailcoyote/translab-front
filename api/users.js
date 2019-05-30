import { Users } from "./storage";
import { timeout, uuid } from "@/helper";

const getUserById = (uuid) => {
    return (uuid === undefined) ? Users[0] : Users.find(item => item.uuid === uuid);
};

const getUsers = async (offset = 0, limit) => {
    await timeout();
    const items = (limit) ? Users.slice(offset, limit + offset) : Users;
    return {
        users: items,
        count: Users.length
    }
};

const getUsersByAge = (items, ageFrom = 18, ageTo = 60) => {
    return items.filter(item => {
        return item.age >= ageFrom && item.age <= ageTo
    })
};

const getUsersByFilter = ({ searchText, ageInterval }, offset = 0, limit = 10) => {
    let filtered = searchText
        ? Users.filter(item => {
            return item.firstname.toLowerCase().indexOf(searchText.toLowerCase()) >= 0
                || item.lastname.toLowerCase().indexOf(searchText.toLowerCase()) >= 0
                || item.email.toLowerCase().indexOf(searchText.toLowerCase()) >= 0
                || item.phone.toLowerCase().indexOf(searchText.toLowerCase()) >= 0
                || item.address.full.toLowerCase().indexOf(searchText.toLowerCase()) >= 0
        }) : Users;
    if (ageInterval.from && ageInterval.to) {
        filtered = getUsersByAge(filtered, ageInterval.from, ageInterval.to)
    }
    return {
        users: filtered.slice(offset, limit + offset),
        count: filtered.length
    }
};

const createUser = (user) => {
    user["uuid"] = uuid();
    Users.unshift(user);
    return true;
}

const updateUser = (user) => {
    for (let index = 0; index < Users.length; index++) {
        if (user.uuid === Users[index].uuid) {
            if (user.address) {
                user.address = {
                    full: user.address
                }
            }
            Users[index] = user;
            break;
        }
    }
}

const removeUser = (uuid) => {
    for (let index = 0; index < Users.length; index++) {
        if (uuid === Users[index].uuid) {
            Users.splice(index, 1);
            break;
        }
    }
}

export default {
    getUsers,
    getUserById,
    getUsersByFilter,
    getUsersByAge,
    createUser,
    updateUser,
    removeUser
};