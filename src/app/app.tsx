import { StyleRules, withStyles } from 'material-ui/styles';
import * as React from 'react';
import { Switch } from 'react-router';
import { HashRouter as Router, Route } from 'react-router-dom';
import Header from './header';
import NoMatch from './nomatch';
import Theme from './theme';
import ContestBuilder from '../admin/contestBuilder';
import Auth from '../auth/auth';
import ContestController from '../contest/contestController';
import ContestList from '../main/contestList';
// import Paper from 'material-ui/Paper';

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
      <Router>
        <>
          <Header />
          <div className={props.classes.main}>
            <div className={props.classes.contestListWrapper}>
              <Switch>
                <Route path='/' exact component={ContestList} />
                <Route path='/admin/contest/:contestId?' component={ContestBuilder} />
                <Route path='/contest/:contestId/' component={ContestController} />
                <Route component={NoMatch} />
              </Switch>
            </div>
          </div>
        </>
      </Router>
    </Auth>
  </Theme>
);

export default withStyles(styles)<IAppProps>(App);
