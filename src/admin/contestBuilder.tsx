import DeleteIcon from 'material-ui-icons/Delete';
import SaveIcon from 'material-ui-icons/Save';
import Button from 'material-ui/Button';
import Checkbox from 'material-ui/Checkbox';
import { FormControlLabel } from 'material-ui/Form';
import Paper from 'material-ui/Paper/Paper';
import { StyleRules } from 'material-ui/styles';
import withStyles from 'material-ui/styles/withStyles';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography/Typography';
import * as React from 'react';
import { createAllProblemsEnhance, createContestProblemsEnhance } from './contestBuilder/problemTableEnhances';
import ContestInfoEditer from './contestInfoEditor';
import contestApi from '../api/contestApi';
import problemsApi from '../api/problemsApi';
import { hashHistory } from '../app/history';
import authService from '../auth/authService';
import { dateToISOFormat } from '../DateFormats';
import ProblemTable from '../problem/problemTable';
import {
  ArchiveProblem,
  ContestInfo,
  ContestProblem,
  Enhance,
  ProblemInfo
  } from '../typings';

interface IContestBuilderProps {
  classes?: any;
  match: any;
}

interface IContestBuilderState {
  allProblems: Map<string, ArchiveProblem>;
  includeExternal: boolean;
  contestInfo: ContestInfo;
  error: boolean;
  fetchAllProblemsPromise: Promise<any>;
  filterName: string;
  filterResourseId: string;
}


const createDefaultContestTimes = (): { startTime: string, finishTime: string } => {
  const start = new Date();
  const finish = new Date();
  finish.setHours(start.getHours() + 5);
  return {
    startTime: dateToISOFormat(start),
    finishTime: dateToISOFormat(finish),
  }
};

class ContestBuilder extends React.Component<IContestBuilderProps, IContestBuilderState> {
  indexes = new Map<string, string>();
  catch = (e) => console.log(e) || this.setState({ error: true })
  contestProblemsEnhance: Enhance<ProblemInfo>[];
  allProblemsEnhance: Enhance<ProblemInfo>[];
  constructor(props) {
    super(props);
    this.state = {
      filterName: '',
      filterResourseId: '',
      fetchAllProblemsPromise: null,
      allProblems: new Map(),
      includeExternal: false,
      contestInfo: {
        ...createDefaultContestTimes(),
        name: '',
        problems: [],
        id: null,
      },
      error: false,
    };
    this.handleProblemIndexChange = this.handleProblemIndexChange.bind(this);
    this.initializeEnhances();
  }

  private initializeEnhances() {
    this.contestProblemsEnhance = createContestProblemsEnhance({ onRemoveClick: this.handleRemoveProblem });
    this.allProblemsEnhance = createAllProblemsEnhance({
      isProblemDisabled: (problem) => !this.indexes.get(hashByProblem(problem)),
      onAddProblem: this.handleAddProblem,
      getHashByProblem: hashByProblem,
      getIndexByProblem: (problem) => this.indexes.get(hashByProblem(problem)),
      onProblemIndexChange: this.handleProblemIndexChange,
    })
  }

  fetchContestInfo = async (contestId) => {
    if (!contestId)
      return;

    const contestInfo = await contestApi.GetContestInfo(contestId)
    this.setState({
      contestInfo
    });
    const problems = contestInfo && contestInfo.problems;
    if (!problems)
      return;
    await this.patchProblems(problems);
  }

  private patchProblem = (problem) => {
    if (problem.problemId)
      return Promise.resolve(problem);
    return problemsApi.getArchiveProblem(problem.contestId, problem.index);
  }

  private async patchProblems(problems: ContestProblem[]) {
    const archiveProblems = await Promise.all(problems.map(this.patchProblem));
    const updatedByArchiveIdsProblems = problems.map((p, index) => ({
      ...p,
      ...(archiveProblems[index][0])
    }));
    this.setState(prevState => ({
      contestInfo: {
        ...prevState.contestInfo,
        problems: updatedByArchiveIdsProblems,
      }
    }));
  }

  fetchAllProblems = () => {
    const fetchAllProblemsPromise = problemsApi.getProblems(this.state.includeExternal)
      .then(allProblems => {
        const hashes = allProblems.map(p => hashByProblem(p));
        this.setState({
          allProblems: new Map(
            allProblems.map<[string, ArchiveProblem]>((p, index) => [hashes[index], p])
          )
        });
      });
    this.setState({
      fetchAllProblemsPromise
    });
  }

  updateContest = (contestInfo: ContestInfo) => {
    if (this.props.match.params.contestId)
      return contestApi.EditContest(contestInfo);

    return contestApi.CreateContest(contestInfo)
      .then((id) => hashHistory.push('/admin/contest/' + id));
  }

  deleteContest = () => {
    contestApi.DeleteContest(this.state.contestInfo.id)
      .then(() => hashHistory.push('/admin/'));
  }

  componentWillReceiveProps(nextProps) {
    this.fetchContestInfo(
      nextProps.match.params.contestId
    );
  }

  componentDidMount() {
    this.fetchContestInfo(
      this.props.match.params.contestId
    );
  }

  render() {
    if (!authService.isAdmin()) {
      return <Typography variant='headline'>
        Упс, кажется у вас недостаточно прав
      </Typography>;
    }
    const { classes } = this.props;
    const { contestInfo, allProblems, includeExternal, fetchAllProblemsPromise, filterName, filterResourseId } = this.state;
    const contestProblemsNamesSet = new Set(contestInfo.problems.map(p => hashByProblem(p)));
    const nameInlowerCase = filterName.toLowerCase(), resourseIdInLower = filterResourseId.toLowerCase();
    const otherProblems = Array.from(allProblems.values())
      .filter(p => !contestProblemsNamesSet.has(hashByProblem(p)))
      .filter(problem => problem.name.toLowerCase().startsWith(nameInlowerCase))
      .filter(problem => problem.problemId.resourceProblemId.toLowerCase().startsWith(resourseIdInLower));

    return (
      <Paper className={classes.container}>
        <div>
          <ContestInfoEditer
            onChangeContestInfo={this.handleInfoChanged}
            contestInfo={contestInfo}
          />
          <Button onClick={() => this.updateContest(this.state.contestInfo)}>
            <SaveIcon />
            Сохранить общую информацию
          </Button>
          <Button disabled={!(this.state.contestInfo && this.state.contestInfo.id)} onClick={this.deleteContest}>
            <DeleteIcon />
            Удалить контест
          </Button>
        </div>
        <div>
          <Typography >
            Задачи в контесте
          </Typography>
          <ProblemTable
            problems={contestInfo.problems}
            enhance={this.contestProblemsEnhance}
          />
        </div>
        <div>
          <div className={classes.tableControl}>
            <Typography variant='subheading'>
              Все задачи
          </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeExternal}
                  onChange={this.handleCheckboxChange}
                  name='includeExternal'
                />
              }
              label='External'
            />
            <Button onClick={this.fetchAllProblems}>
              Загрузить все задачи (будет больно)
            </Button>
          </div>
        </div>
        <div>
          <div className={classes.allProblemsFiltersWrapper}>
            <TextField name='filterName' onChange={this.handleFilterChange} value={filterName} placeholder='Фильтр по имени' />
            <TextField name='filterResourseId' onChange={this.handleFilterChange} value={filterResourseId} placeholder='Фильтр по Resourse id' />
          </div>
          <ProblemTable
            problems={otherProblems}
            enhance={this.allProblemsEnhance}
            fetchingPromsie={fetchAllProblemsPromise}
            withPaging
          />
        </div>
      </Paper >
    );
  }

  handleFilterChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleCheckboxChange = (event) => {
    this.setState({
      [event.target.name]: event.target.checked
    });
  }

  handleInfoChanged = (contestInfo: ContestInfo) => {
    this.setState({
      contestInfo
    })
  }

  handleAddProblem = (problem: ArchiveProblem) => () => {
    const patchedProblem = {
      ...problem,
      index: this.indexes.get(hashByProblem(problem)),
    }
    const newProblems = [...this.state.contestInfo.problems, patchedProblem];
    const newInfo = {
      ...this.state.contestInfo,
      problems: newProblems,
    };

    this.updateContest(newInfo)
      .then(() => this.setState(prevState => {
        prevState.allProblems.delete(hashByProblem(problem));
        return {
          contestInfo: newInfo,
        };
      }))
      .catch(this.catch);
  }

  handleRemoveProblem = (problem: ContestProblem) => () => {
    const newProblems = this.state.contestInfo.problems.filter(p => p.index !== problem.index);
    const newInfo = {
      ...this.state.contestInfo,
      problems: newProblems,
    };
    this.updateContest(newInfo)
      .then(async () => {
        const patched = await this.patchProblem(problem);
        this.setState(prevState => {
          prevState.allProblems.set(hashByProblem(patched), patched);
          return {
            contestInfo: newInfo
          };
        })
      })
  }

  handleProblemIndexChange(event) {
    this.indexes.set(event.target.name, event.target.value);
    this.setState({});
  }
}


const styles: StyleRules = {
  container: {
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 20,
    '& > div': {
      marginBottom: 30,
    }
  },
  tableControl: {
    marginBottom: 5,
  },
  allProblemsFiltersWrapper: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    '& > div': {
      marginRight: 35,
    }
  },
};

const hashByProblem = (p: ProblemInfo) => {
  const problemId = (p as ArchiveProblem).problemId;
  if (problemId)
    return problemId.resourceName + problemId.resourceProblemId;
  return p.name;
}

export default withStyles(styles)<IContestBuilderProps>(ContestBuilder as any);