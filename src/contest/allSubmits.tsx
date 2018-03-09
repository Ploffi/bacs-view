import { FormGroup } from 'material-ui/Form';
import Paper from 'material-ui/Paper';
import { StyleRules, withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import * as React from 'react';
import Submits from './submits';
import NativeSelect from '../common/select';
import { ContestProblem, Enhance, Submission } from '../typings';


interface IAllSubmitsProps {
  submissions: Submission[];
  problems: ContestProblem[];
  classes?: any;
}

interface IAllSubmitsState {
  selectedProblem: string;
  username: string;
}

class AllSubmits extends React.Component<IAllSubmitsProps, IAllSubmitsState> {
  enhance: Enhance<Submission>[];
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      selectedProblem: '',
    };
    this.enhance = [{
      title: 'Участник',
      renderCell: this.renderUserCell,
    }];
  }

  renderUserCell = (submission: Submission) => `${submission.author.username}`;

  handleProblemSelect = (e) => {
    const selectedProblem = e.target.value;
    this.setState(prevState => ({
      selectedProblem: prevState.selectedProblem === selectedProblem ? null : selectedProblem
    }));
  }

  handleChange = (event) => this.setState({ [event.target.name]: event.target.value });

  render() {
    const { submissions, problems, classes } = this.props;
    const { selectedProblem, username } = this.state;
    const filteredSubmissions = submissions && submissions
      .filter(submission => !selectedProblem || selectedProblem === submission.problem.index)
      .filter(submission => !username || submission.author.username.toLowerCase().startsWith(username.toLowerCase()));

    return <Paper className={classes.paper}>
      <FormGroup className={classes.formGroup}>
        <TextField
          name={'username'}
          value={this.state.username}
          onChange={this.handleChange}
          label={'Имя пользователя'}
        />
        <NativeSelect
          values={problems.map(p => p.index)}
          selectedValue={this.state.selectedProblem}
          onChange={this.handleProblemSelect}
          name='problemSelect'
          label='Задача'
        />
      </FormGroup>
      <div>
        <Submits
          submissions={filteredSubmissions}
          enhance={this.enhance}
        />
      </div>
    </Paper>;
  }
}

const styles: StyleRules = {
  formGroup: {
    width: 200,
    paddingLeft: 10,
    marginBottom: 15,
  },
  paper: {
    marginBottom: 20,
  }
};

export default withStyles(styles)<IAllSubmitsProps>(AllSubmits as any);