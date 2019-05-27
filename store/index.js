import UserAPI from "@/api/users";

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
        offset: 0
    },
    pagination: {
        offset: 0,
        limit: 10,
        end: false
    },
});

export const actions = {
    async FETCH_USER({ state, commit }, uuid) {
        const user = { ...UserAPI.getUserById(uuid) }
        user["address"] = typeof user["address"] === 'object' ? user["address"].full : "";
        commit('SET_USER', user)
    },
    async LOAD_USERS({ state, commit }, newly) {
        if (newly) {
            commit('RESET_PAGINATION');
            commit('RESET_USERS');
        }
        if (!state.pagination.end && !state.users.loading) {
            commit('USERS_LOAD_INDICATOR');
            const finded = await UserAPI.getUsers(
                state.pagination.offset,
                state.pagination.limit
            );
            commit('USERS_LOADED', finded)
        }
    },
    SEARCH_BY({ state, commit, dispatch }, searchStr) {
        commit('RESET_USERS')
        if (!searchStr) return dispatch('LOAD_USERS');
        const response = UserAPI.getUsersBySearch(
            searchStr,
            state.searchFilter.offset,
            state.pagination.limit
        );
        commit('SET_USER_SEARCH_RESULT', response)
    },
    SAVE_USER({ state, commit, dispatch }, user) {
        if (!user.uuid) UserAPI.createUser({ ...user })
        else UserAPI.updateUser({ ...user })
        dispatch('LOAD_USERS', true)
    },
    REMOVE_USER({state, dispatch}, uuid) {
        UserAPI.removeUser(uuid);
        dispatch('LOAD_USERS', true);
    }
}

export const mutations = {
    USERS_LOAD_INDICATOR(state) {
        state.users.loading = true;
    },
    USERS_LOADED(state, users) {
        if (users.length) {
            state.users.items = [...state.users.items, ...users]; // join
            state.pagination.offset =
                state.pagination.offset + state.pagination.limit;
        } else {
            state.pagination.end = true;
        }
        state.users.loading = false;
    },
    SET_USER_SEARCH_RESULT(state, result) {
        if (result.users.length) {
            state.users.items = [...state.users.items, ...result.users]; // join
            state.searchFilter.offset =
            state.searchFilter.offset + state.pagination.limit;
        }
    },
    RESET_USERS(state) {
        state.users.items = [];
    },
    TOGGLE_FORM(state) {
        state.form.open = !state.form.open;
    },
    RESET_SEARCH_FILTER(state) {
        state.searchFilter.offset = 0;
    },
    RESET_PAGINATION(state) {
        state.pagination.offset = 0;
        state.pagination.end = false;
    },
    CLEAR_USER(state) {
        for (let key in state.form.user)
            state.form.user[key] = '';
        state.form.user = { ...state.form.user };
    },
    SET_USER(state, user) {
        state.form.user = user;
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
