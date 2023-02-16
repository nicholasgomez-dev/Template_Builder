import axios from 'axios';

const newAxios = axios.create({
    baseURL: process.env.API,
    transformRequest: [(data, headers) => {
	delete headers.common.Authorization;
	return data
    }]
});

//delete newAxios.defaults.headers.common['Authorization'];

export default newAxios;
