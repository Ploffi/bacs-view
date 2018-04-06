import { History, Location } from 'history';
import Paper from 'material-ui/Paper/Paper';
import * as React from 'react';
import {
  match,
  Redirect,
  Route,
  Switch
  } from 'react-router';
import AllSubmits from './allSubmits';
import ContestMenu from './contestMenu';
import Standings from './standings';
import SubmitForm from './submitForm';
import Submits from './submits';
import ContestApi from '../api/contestApi';
import AuthService from '../auth/authService';
import ProblemTable from '../problem/problemTable';
import { ContestInfo, SessionInfo, Submission } from '../typings';

interface IContestControllerProps {
  match: match<any>;
  history: History;
  location: Location;
}

interface IContestControllerState {
  contestInfo: ContestInfo;
  currentTab: Tab['pathTo'];
  standing: any;
  userSubmits: Submission[];
  allSubmits: Submission[];
  sessionInfo: SessionInfo;
}

export type Tab = {
  name: string;
  pathTo: string;
  needAdminsRight?: boolean;
}

enum PagePath {
  Problems = 'problems',
  Standings = 'standings',
  Submits = 'submits',
  Submit = 'submit',
  AllSubmits = 'submitsList',
}

const tabs: Tab[] = [
  {
    name: 'Задачи',
    pathTo: PagePath.Problems
  },
  {
    name: 'Монитор',
    pathTo: PagePath.Standings
  },
  {
    name: 'Отправка',
    pathTo: PagePath.Submit
  },
  {
    name: 'Посылки',
    pathTo: PagePath.Submits
  },
  {
    name: 'Список посылок',
    pathTo: PagePath.AllSubmits,
    needAdminsRight: true,
  },
];

export default class ContestController extends React.Component<IContestControllerProps, IContestControllerState> {
  fetchBypageName;
  constructor(props: IContestControllerProps) {
    super(props);
    const currentTab = tabs.find(link => props.location.pathname.endsWith(link.pathTo))
      || tabs[0];

    this.state = {
      contestInfo: null,
      currentTab: currentTab.pathTo,
      standing: null,
      userSubmits: [],
      allSubmits: [],
      sessionInfo: null,
    };

    this.fetchBypageName = (pageName) => {
      pageName = pageName || this.state.currentTab;
      switch (pageName) {
        case PagePath.Submits: return this.fetchUserSubmits();
        case PagePath.AllSubmits: return this.fetchAllSubmits();
        case PagePath.Standings: return this.fetchStanding();
      }
    }
  }

  handleTabChange = (_, value) => {
    this.fetchBypageName(value);

    this.setState({ currentTab: value }, () =>
      this.props.history.push(this.props.match.url + '/' + value)
    );
  }

  fetchContestInfo() {
    const contestId = this.props.match.params.contestId;
    return ContestApi.GetContestInfo(contestId)
      .then(contestInfo => this.setState({ contestInfo }));
  }

  fetchStanding() {
    if (this.state.contestInfo)
      ContestApi.GetStandings(this.state.contestInfo.id)
        .then(standing => this.setState({ standing }))
        .catch(console.log);
  }

  fetchUserSubmits() {
    if (this.state.contestInfo)
      ContestApi.GetUserSubmissions(this.state.contestInfo.id, this.state.sessionInfo.sub)
        .then(userSubmits => this.setState({ userSubmits }))
        .catch(console.log);
  }

  fetchAllSubmits() {
    if (this.state.contestInfo)
      ContestApi.GetAllSubmissions(this.state.contestInfo.id)
        .then(allSubmits => this.setState({ allSubmits }))
        .catch(console.log);
  }

  componentDidMount() {
    this.fetchContestInfo()
      .then(() => this.fetchBypageName());
    this.setState({
      sessionInfo: AuthService.getSessionInfo()
    });
  }

  to = (to) => this.props.match.url + '/' + to;

  render() {
    const { match, } = this.props;
    const { currentTab, contestInfo, allSubmits, standing, userSubmits, sessionInfo } = this.state;
    const problems = contestInfo && contestInfo.problems || [];
    const current = match.url + '/';
    const isAdmin = AuthService.isAdmin(sessionInfo);
    const isContestFinished = contestInfo && new Date(contestInfo.finishTime) < new Date();

    return <div>
      <div>
        <ContestMenu
          currentTab={currentTab}
          handleTabChange={this.handleTabChange}
          isAdmin={isAdmin}
          tabs={tabs}
        />
      </div>
      <Switch>
        <Redirect exact from={current} to={this.to(PagePath.Problems)} />
        <Route
          exact
          path={this.to(PagePath.Problems)}
          render={() => <Paper>
            <ProblemTable problems={problems} />
          </Paper>} />
        <Route
          exact
          path={this.to(PagePath.Submit)}
          render={() => <SubmitForm contestId={contestInfo && contestInfo.id} problems={problems} />} />
        <Route
          exact
          path={this.to(PagePath.Submits)}
          render={() => <Submits submissions={userSubmits} />} />
        <Route
          exact
          path={this.to(PagePath.Standings)}
          render={
            () => <Standings problems={problems} standing={standing} />
          } />
        {
          (isContestFinished || isAdmin)
          &&
          <Route
            exact
            path={this.to(PagePath.AllSubmits)}
            render={
              () => <AllSubmits problems={problems} submissions={allSubmits} />
            } />
        }
      </Switch>
    </div>
  }
} 