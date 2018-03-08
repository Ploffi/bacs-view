import Paper from 'material-ui/Paper';
import { StyleRules, withStyles } from 'material-ui/styles';
import * as React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Header from './header';
import Theme from './theme';
import ContestBuilder from '../admin/contestBuilder';
import Auth from '../auth/auth';
import ContestController from '../contest/contestController';
import ContestList from '../main/contestList';

type classes = {
  main: string,
  contestListWrapper: string,
};

const styles: StyleRules = {
  main: {
    margin: 'auto',
    maxWidth: '1500px',
  },

  contestListWrapper: {
    padding: '15px 20px',
  },
};

interface IAppProps {
  classes?: classes;
}

const App = (props: IAppProps) => (
  <Theme>
    <Auth>
      <div className={props.classes.main}>
        <Router>
          <>
            <Header />
            <Paper className={props.classes.contestListWrapper}>
              <Route path='/' exact component={ContestList} />
              <Route path='/admin/contest/:contestId?' component={ContestBuilder} />
              <Route path='/contest/:contestId/' component={ContestController} />
            </Paper>
          </>
        </Router>
      </div>
    </Auth>
  </Theme>
);

export default withStyles(styles)<IAppProps>(App);
