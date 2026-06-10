import API from "../../../services/api";

export const authServices = {

    registerUser: async (name, email, password) => {
        const response = await API.post('/auth/register', { name, email, password })
        return response.data
    },

    loginUser: async (email, password) => {
        const response = await API.post('/auth/login', { email, password });
        return response.data;
    },


    getMeProfile: async () => {
        const response = await API.get('/auth/me');
        return response.data;
    }
}