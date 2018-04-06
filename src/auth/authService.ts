import AuthApi from '../api/authApi';
import {
  AuthStatus,
  RegisterUserinfo,
  SessionInfo,
  UserRole
  } from '../typings';

function parseJwt(token): SessionInfo {
  if (!token)
    return null;
  token = token.split(' ')[1];
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}


const findParam = (paramName: string) => (
  document.cookie
    .split(';')
    .map(str => str.trimLeft())
    .find(value => value.startsWith(paramName))
  || '');

const getFromCookies = (paramName: string) => {
  return findParam(paramName)
    .substring(1 + paramName.length);
}

const clearCookieParam = (paramName: string) => {
  document.cookie = paramName + '=';
}

const authCookieJWT = 'AuthBacsToken';
const authHeaderName = 'authorization';

const authService = {
  signUp(userData: RegisterUserinfo) {
    return AuthApi.signUp(userData).then();
  },
  auth(login: string, password: string): Promise<AuthStatus> {
    return AuthApi.auth(login, password)
      .then(response => {
        const token = response.headers[authHeaderName];
        AuthApi.setHeader(authHeaderName, token);
        document.cookie = authCookieJWT + '=' + token;
        return AuthStatus.Success;
      })
      .catch(() => Promise.resolve(AuthStatus.Fail));
  },
  getSessionInfo(): SessionInfo {
    const token = getFromCookies(authCookieJWT);
    return parseJwt(token);
  },
  checkAuth(): AuthStatus {
    try {
      const token = getFromCookies(authCookieJWT);
      const info = parseJwt(token);
      const expiresIn = info && info.exp
        ? new Date(info.exp * 1000)
        : null;

      const now = new Date();
      if (expiresIn && now < expiresIn) {
        AuthApi.setHeader(authHeaderName, token);
        return AuthStatus.Success;
      }
    }
    catch (e) {
      console.log(e);
    }
    return AuthStatus.None;
  },
  logout() {
    clearCookieParam(authCookieJWT);
  },
  isAdmin(sessionInfo?: SessionInfo): boolean {
    return (
      sessionInfo || this.getSessionInfo()
    ).roles.includes(UserRole.Admin);
  }
}

export default authService;