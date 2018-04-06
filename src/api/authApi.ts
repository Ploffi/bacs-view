import { AxiosPromise } from 'axios';
import client from './client';
import { RegisterUserinfo } from '../typings';

function getErrorsFromResponse(response) {
  const data: string | string[] = response && response.response && response.response.data;
  return Array.isArray(data)
    ? Array.from(new Set(data).values())
    : data
      ? [data]
      : ['Неизвестная ошибка, пожалуйста, попробуйте повторить позже'];
}

const authApi = {
  signUp(userData: RegisterUserinfo): AxiosPromise<any> {
    return client.post('/auth/register', { ...userData })
      .catch(response => Promise.reject(getErrorsFromResponse(response)));
  },

  auth(username, password): AxiosPromise<any> {
    return client.post('/auth/login', { username, password })
      .catch(response => Promise.reject(getErrorsFromResponse(response)));
  },

  setHeader(headerName, headerValue): void {
    client.defaults.headers[headerName] = headerValue;
  }
}

export default authApi;