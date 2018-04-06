import * as React from 'react';
import AuthService from './authService';
import Login from './login';
import Register from './register';
import { AuthStatus, RegisterUserinfo } from '../typings';

interface IAuthState {
  authStatus: AuthStatus;
  errors: string[];
  isRegister: boolean;
}

class Auth extends React.Component<any, IAuthState> {
  constructor(props) {
    super(props);
    this.state = {
      authStatus: AuthService.checkAuth(),
      errors: [],
      isRegister: false,
    };
  }

  signUp = (userData: RegisterUserinfo) => {
    this.setState({
      authStatus: AuthStatus.Pending
    });
    AuthService.signUp(userData)
      .then(() => this.tryAuthorize(userData.username, userData.password, true))
      .catch(errors => {
        this.setState({ errors: errors, authStatus: AuthStatus.Fail });
      })
  }

  tryAuthorize = (username, password, afterRegister?) => {
    if (this.state.authStatus === AuthStatus.Pending && !afterRegister)
      return;
    this.setState({
      isRegister: false,
      authStatus: AuthStatus.Pending
    });
    return AuthService.auth(username, password)
      .then(authStatus => this.setState({ authStatus }))
      .catch(errors => this.setState({
        errors: errors,
        authStatus: AuthStatus.Fail,
      }));
  }

  toggleRegisterModal = () => this.setState(prev => ({ isRegister: !prev.isRegister }))

  render() {
    const { authStatus, errors, isRegister } = this.state;
    if (authStatus === AuthStatus.Success)
      return this.props.children;
    return isRegister
      ?
      <Register
        onBack={this.toggleRegisterModal}
        authStatus={authStatus}
        onRegister={this.signUp}
        errors={errors}
      />
      :
      <Login
        authStatus={authStatus}
        errors={errors}
        onLogin={this.tryAuthorize}
        onRegister={this.toggleRegisterModal}
      />
  }
}

export default Auth;