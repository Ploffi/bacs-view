import { Typography } from 'material-ui';
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import { StyleRules } from 'material-ui/styles';
import withStyles from 'material-ui/styles/withStyles';
import TextField from 'material-ui/TextField';
import * as React from 'react';
import { Fragment } from 'react';
import { AuthStatus } from '../typings';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';


interface ILoginProps {
  onLogin: (login: string, password: string) => void;
  onRegister: () => void;
  authStatus: AuthStatus;
  errors?: string[];
  classes?: any;
}

interface ILoginState {
  login: string;
  password: string;
}

class Login extends React.Component<ILoginProps, ILoginState> {
  constructor(props) {
    super(props);
    this.state = {
      login: undefined,
      password: undefined,
    };
  }

  handleInputKeyPressed = (event) => {
    if (event.key === 13 || event.key === 'Enter')
      this.handleLogin();
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleLogin = () => {
    this.props.onLogin(
      this.state.login,
      this.state.password,
    )
  }

  render() {
    const { password, login } = this.state;
    const { authStatus, errors, onRegister } = this.props;
    const isFailed = authStatus === AuthStatus.Fail;
    const loading = authStatus === AuthStatus.Pending;
    return <Dialog
      className={this.props.classes.root}
      disableBackdropClick
      disableEscapeKeyDown
      open
    >
      <DialogTitle>Вход</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          placeholder='Логин'
          value={login}
          error={isFailed || login === ''}
          onChange={this.handleInputChange}
          onKeyPress={this.handleInputKeyPressed}
          name='login'
        />
        <TextField
          fullWidth
          placeholder='Пароль'
          value={password}
          error={isFailed || password === ''}
          onChange={this.handleInputChange}
          onKeyPress={this.handleInputKeyPressed}
          name='password'
          type='password'
        />
        <span>
          {
            errors &&
            errors.map((error, index) => <Typography variant='subheading' color='error' key={index}> {error}</Typography>)
          }
        </span>
      </DialogContent>
      <DialogActions>
        {
          !loading
          &&
          <Fragment>
            <Button variant='raised' disabled={!login} onClick={this.handleLogin} color='primary'>
              Войти
            </Button>
            <Button onClick={onRegister}>
              Зарегистрироваться
            </Button>
          </Fragment>
          ||
          <CircularProgress className={this.props.classes.progress} size={30} />
        }
      </DialogActions>
    </Dialog>
  }
}

const styles: StyleRules = {
  root: {
    height: 'inherit !important'
  },
  progress: {
    minWidth: 'initial',
    marginRight: 40,
  }
}

export default withStyles(styles)<ILoginProps>(Login as any);