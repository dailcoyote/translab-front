export const state = () => ({    
    form: {
        open: false,
        user: {
            uuid: '',
            firstname: '',
            lastname: '',
            age: '',
            email: '',
            phone: '',
            address: ''
        }
    }
});

export const mutations = {
    TOGGLE_FORM (state) {
        state.form.open = !state.form.open;
    }
}

export const getters = {
    user(state) {
        return {...state.form.user};
    }
}
