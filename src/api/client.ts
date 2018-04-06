import axiosPackage from 'axios';

const client = axiosPackage.create({
    baseURL: 'https://bacs007.herokuapp.com/',
    headers: {
        'Content-Type': 'application/json',
    }
})

export default client;