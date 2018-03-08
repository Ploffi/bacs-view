import grey from 'material-ui/colors/grey';
import red from 'material-ui/colors/red';
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import * as React from 'react';


const muiTheme = createMuiTheme({
  typography: {
    fontFamily: 'Segoe UI',
  },
  palette: {
    primary: {
      light: '#63a4ff',
      main: '#1976d2',
      dark: '#004ba0',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ffddc1',
      main: '#ffab91',
      dark: '#c97b63',
      contrastText: '#000',
    },
    error: red,
    grey: grey,
    text: {
      secondary: '#7B7B7B'
    }
  },
});


const Theme = (props) => (
  <MuiThemeProvider theme={muiTheme}>
    {
      props.children
    }
  </MuiThemeProvider>
);

export default Theme;