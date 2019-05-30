import UserAPI from "@/api/users";
import { timeout } from "@/helper";

export const state = () => ({
    form: {
        open: false,
        user: {
            uuid: '',
            firstname: '',
            lastname: '',
            email: '',
            age: '',
            phone: '',
            address: ''
        }
    },
    users: {
        loading: false,
        items: []
    },
    searchFilter: {
        searchText: '',
        ageInterval: {
            from: undefined,
            to: undefined
        }
    },
    pagination: {
        offset: 0,
        limit: 10,
        end: false
    },
    notification: {
        message: "",
        color: "primary",
        show: false
    }
});

export const actions = {
    async FETCH_USER({ state, commit }, uuid) {
        const user = { ...UserAPI.getUserById(uuid) }
        user["address"] = typeof user["address"] === 'object' ? user["address"].full : "";
        commit('SET_USER', user)
    },
    async LOAD_USERS({ state, commit }) {
        if (!state.pagination.end && !state.users.loading) {
            commit('USERS_TOGGLE_INDICATOR');
            const finded =
                !state.searchFilter.searchText
                    && !state.searchFilter.ageInterval.from
                    && !state.searchFilter.ageInterval.to
                    ? await UserAPI.getUsers(
                        state.pagination.offset,
                        state.pagination.limit)
                    : UserAPI.getUsersByFilter(
                        state.searchFilter,
                        state.pagination.offset,
                        state.pagination.limit
                    );
            commit('SET_USERS', finded.users);
            commit('USERS_TOGGLE_INDICATOR');
        }
    },
    SEARCH_BY_TEXT({ state, commit, dispatch }, searchText) {
        commit('RESET_USERS');
        commit("RESET_PAGINATION");
        commit("SET_SEARCH_TEXT", searchText);
        dispatch("LOAD_USERS");
    },
    SEARCH_BY_AGE_INTERVAL({ state, commit, dispatch }, interval) {
        commit('RESET_USERS');
        commit("RESET_PAGINATION");
        commit("SET_SEARCH_AGE_INTERVAL", interval);
        dispatch("LOAD_USERS");
    },
    RESET_SEARCH_FILTER({ state, commit, dispatch }) {
        if (state.searchFilter.ageInterval.from
            && state.searchFilter.ageInterval.to) {
            commit('RESET_USERS');
            commit("RESET_PAGINATION");
            commit("RESET_SEARCH_FILTER");
            dispatch("LOAD_USERS");
        }
    },
    SAVE_USER({ state, commit, dispatch }, user) {
        if (!user.uuid) UserAPI.createUser({ ...user })
        else UserAPI.updateUser({ ...user })
        dispatch('PUSH_NOTIFICATION', `User ${user.email} saved!`);
        dispatch('LOAD_USERS', true)
    },
    REMOVE_USER({ state, dispatch }, uuid) {
        UserAPI.removeUser(uuid);
        dispatch('PUSH_NOTIFICATION', `User with uuid:${uuid} removed!`);
        dispatch('LOAD_USERS', true);
    },
    async PUSH_NOTIFICATION({ commit }, msg) {
        commit('NOTIFICATION_COMMIT', msg)
        await timeout(4500);
        commit('NOTIFICATION_CLEAR')
    }
}

export const mutations = {
    TOGGLE_FORM(state) {
        state.form.open = !state.form.open;
    },
    USERS_TOGGLE_INDICATOR(state) {
        state.users.loading = !state.users.loading;
    },
    SET_USERS(state, users) {
        if (users.length) {
            state.users.items = [...state.users.items, ...users]; // join
            state.pagination.offset =
                state.pagination.offset + state.pagination.limit;
        } else {
            state.pagination.offset = 0;
            state.pagination.end = true;
        }
    },
    RESET_USERS(state) {
        state.users.items = [];
    },
    SET_USER(state, user) {
        state.form.user = user;
    },
    CLEAR_USER(state) {
        for (let key in state.form.user)
            state.form.user[key] = '';
        state.form.user = { ...state.form.user };
    },
    SET_SEARCH_TEXT(state, searchText) {
        state.searchFilter.searchText = searchText;
    },
    SET_SEARCH_AGE_INTERVAL(state, interval) {
        state.searchFilter.ageInterval.from = parseInt(interval[0]);
        state.searchFilter.ageInterval.to = parseInt(interval[1]);
    },
    RESET_SEARCH_FILTER(state) {
        state.searchFilter.ageInterval.from = undefined;
        state.searchFilter.ageInterval.to = undefined;
    },
    RESET_PAGINATION(state) {
        state.pagination.offset = 0;
        state.pagination.end = false;
    },
    NOTIFICATION_COMMIT(state, msg) {
        state.notification.message = msg;
        state.notification.show = true;
    },
    NOTIFICATION_CLEAR(state) {
        state.notification.message = "";
        state.notification.show = false;
    }
}

export const getters = {
    user(state) {
        return { ...state.form.user };
    },
    users(state) {
        return { ...state.users }
    },
    pagination(state) {
        return { ...state.pagination }
    }
}
