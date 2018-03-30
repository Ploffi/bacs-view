import { Typography } from 'material-ui';
import Button from 'material-ui/Button';
import { FormGroup } from 'material-ui/Form';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/Progress/CircularProgress';
import { StyleRules } from 'material-ui/styles';
import withStyles from 'material-ui/styles/withStyles';
import * as React from 'react';
import ContestApi from '../api/contestApi';
import NativeSelect from '../common/select';
import { formatProblemName } from '../problem/problemTable';
import { ContestInfo, ContestProblem, Language } from '../typings';

interface ISubmitProps {
  contestId: ContestInfo['id'],
  problems: ContestProblem[];
  classes?: any;
}

interface ISubmitState {
  problemIndex: ContestProblem['index'];
  language: Language;
  solution: string;
  status: SentStatus;
}

const availableLanguages: string[] = Object.keys(Language)
  .filter(key => !key.startsWith('_'))
  .map(key => Language[key]);

enum SentStatus {
  Initial,
  Sending,
  Success,
  Fail,
}

class SubmitForm extends React.Component<ISubmitProps, ISubmitState> {
  constructor(props) {
    super(props);
    this.state = {
      problemIndex: '',
      language: null,
      solution: '',
      status: SentStatus.Initial,
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      status: SentStatus.Initial,
    });
  }

  submit = () => {
    this.setState({
      status: SentStatus.Sending,
    })
    const unFormattedLanguage = Language._keyOf(this.state.language);
    ContestApi.SubmitSolution(
      this.state.problemIndex,
      this.state.solution,
      unFormattedLanguage,
      this.props.contestId
    ).then(() =>
      this.setState({ solution: '', status: SentStatus.Success, })
    ).catch(() =>
      this.setState({
        status: SentStatus.Fail,
      })
    );
  }

  render() {
    const { problems, classes } = this.props;
    const { language, problemIndex, solution, status } = this.state;
    return (
      <Paper className={classes.wrapper}>
        <FormGroup className={classes.formGroup}>
          <NativeSelect
            label={'Задача'}
            name={'problemIndex'}
            onChange={this.handleChange}
            selectedValue={problemIndex}
            values={problems.map(p => [p.index, formatProblemName(p)])}
          />
          <NativeSelect
            label={'Язык'}
            name={'language'}
            onChange={this.handleChange}
            selectedValue={language || ''}
            values={availableLanguages}
          />
        </FormGroup>
        <textarea
          className={classes.codePlace}
          name='solution'
          rows={20}
          value={solution}
          onChange={this.handleChange}
          placeholder='print(1)'
        />
        <Button disabled={!(
          solution &&
          language &&
          problemIndex
        ) || status === SentStatus.Sending}
          className={classes.submitButton}
          onClick={this.submit}>
          {
            status === SentStatus.Sending &&
            <CircularProgress size={30} />
          }
          {
            status === SentStatus.Initial
            &&
            'Отправить решение'
          }
          {
            status === SentStatus.Fail
            &&
            <Typography color='error' variant='button'>
              К сожалению что-то пошло не так, попробуйте отправить еще раз
            </Typography>
          }
          {
            status === SentStatus.Success
            &&
            'Задача отправлена'
          }
        </Button>
      </Paper>
    );
  }
}

const styles: StyleRules = {
  wrapper: {
    padding: '15px 10px',
    '&>*': {
      marginBottom: 15,
    }
  },
  formGroup: {
    maxWidth: '20%',
    minWidth: 70,
    '&>*': {
      marginBottom: 15,
    }
  },
  codePlace: {
    maxWidth: '100%',
    width: '100%',
  },
  submitButton: {
    width: '100%',
  }
}

export default withStyles(styles)<ISubmitProps>(SubmitForm as any);