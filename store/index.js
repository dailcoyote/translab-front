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
        commit('SET_USER', user)
    },
    SAVE_USER({state, commit}, user) {
        // commit('SET_USER', {...user})
        if(!user.uuid) UserAPI.createUser({...user})
        else UserAPI.updateUser({...user})
    }
}

export const mutations = {
    TOGGLE_FORM (state) {
        state.form.open = !state.form.open;
    },
    CLEAR_USER (state) {
        for(let key in state.form.user)
            state.form.user[key] = '';
        state.form.user = {...state.form.user};
    },
    SET_USER(state, user) {
        state.form.user = user;
    }
}

export const getters = {
    user(state) {
        return {...state.form.user};
    }
}
