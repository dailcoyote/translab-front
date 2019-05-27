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
    }
});

export const actions = {
    FETCH_USER({state, commit}, uuid) {
        const user = {...UserAPI.getUserById(uuid)}
        user["address"] = typeof user["address"] === 'object' ? user["address"].full : "";        
        commit('SET_USER_FORM', user)
    }
}

export const mutations = {
    TOGGLE_FORM (state) {
        state.form.open = !state.form.open;
    },
    RESET_FORM (state, payload) {
        state.form.user = payload;
    },
    SET_USER_FORM(state, user) {
        state.form.user = user;
    }
}

export const getters = {
    user(state) {
        return {...state.form.user};
    }
}
