import Update from 'material-ui-icons/Update';
import IconButton from 'material-ui/IconButton';
import { StyleRules } from 'material-ui/styles';
import withStyles from 'material-ui/styles/withStyles';
import * as React from 'react';
import ContestCard from './contestCard';
import contestApi from '../api/contestApi';
import { ContestInfo } from '../typings';
// import Typography from 'material-ui/Typography/';

interface IContestListState {
  contests: ContestInfo[];
  expandedContestIndx: number;
}

interface IContestListProps {
  classes?: any;
}


class ContestList extends React.Component<IContestListProps, IContestListState> {
  constructor(props) {
    super(props);
    this.state = {
      contests: [],
      expandedContestIndx: -1,
    }
  }

  fetchContests = () => {
    contestApi.GetAllContests()
      .then(contests => this.setState({ contests }));
  }

  componentDidMount() {
    this.fetchContests();
  }

  handleExpandContest(_, expand, index) {
    this.setState(prevState => ({
      expandedContestIndx: prevState.expandedContestIndx === index && !expand
        ? -1
        : index,
    }));
  }

  render() {
    const { classes } = this.props;
    return (<div className={classes.contestListWrapper}>
      <div>
        <IconButton className={classes.reload} color='secondary' onClick={this.fetchContests}>
          <Update />
        </IconButton>
      </div>
      <div className={classes.contestList}>
        {
          this.state.contests &&
          this.state.contests
            .map(
              (contest, index) => <div key={contest.id} className={classes.cardWrapper}>
                <ContestCard
                  isExpanded={this.state.expandedContestIndx === index}
                  contest={contest}
                  onExpand={(event, expand) => this.handleExpandContest(event, expand, index)} />
              </div>
            )
        }
      </div>
    </div>
    )
  }
}

const boxShadow = '2px 2px 8px rgba(0, 0,0, 0.2)';
const styles: StyleRules = {
  contestListWrapper: {
    display: 'flex',
  },
  contestList: {
    flex: 1,
  },
  cardWrapper: {
    borderLeft: '3px solid #bd0d12',
    marginBottom: '20px',
    '-webkit-box-shadow': boxShadow,
    '-moz-box-shadow': boxShadow,
    boxShadow: boxShadow,
    borderRadius: 3,
  },

  reload: {
    paddingRight: 20,
    fontSize: 35,
  }
}

export default withStyles(styles)<IContestListProps>(ContestList as any);