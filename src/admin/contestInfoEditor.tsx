import { FormControl, FormGroup } from 'material-ui/Form/';
import { StyleRules } from 'material-ui/styles';
import withStyles from 'material-ui/styles/withStyles';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import * as React from 'react';
import { ContestInfo } from '../typings';

interface IContestInfoEditorProps {
  onChangeContestInfo: (contestInfo: ContestInfo) => void;
  contestInfo: ContestInfo;
  classes?: any;
}

const substringToDateAndTime = (dateInISO: string) => [dateInISO.substring(0, 10), dateInISO.substring(11, 16)];
const combainDate = (date: string, time: string) => date + 'T' + time;

class ContestInfoEditor extends React.Component<IContestInfoEditorProps, any> {
  constructor(props: IContestInfoEditorProps) {
    super(props);
    this.state = {
      ...this.destructTime(props.contestInfo),
      name: '',
    };
  }

  destructTime = (contestInfo: ContestInfo) => {
    if (!contestInfo)
      return {};
    const [startDate, startTime] = substringToDateAndTime(contestInfo.startTime);
    const [finishDate, finishTime] = substringToDateAndTime(contestInfo.finishTime);
    return {
      startDate, startTime, finishDate, finishTime
    }
  }

  constructTime = () => {
    const { startDate, startTime, finishDate, finishTime } = this.state;
    return {
      startTime: combainDate(startDate, startTime),
      finishTime: combainDate(finishDate, finishTime),
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.destructTime(nextProps.contestInfo)
    })
  }

  updateInfo = () => {
    this.props.onChangeContestInfo({
      ...this.props.contestInfo,
      ...this.constructTime(),
      name: this.state.name,
    });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    }, this.updateInfo)
  }

  render() {
    const { classes, contestInfo } = this.props;
    const [startDate, startTime] = substringToDateAndTime(contestInfo.startTime);
    const [finishDate, finishTime] = substringToDateAndTime(contestInfo.finishTime);

    return <FormGroup className={classes.group}>
      <Typography variant='headline'>
        Контест билдер, йоу!
    </Typography>
      <FormControl className={classes.nameForm}>
        <TextField
          onChange={this.handleChange}
          name='name'
          value={contestInfo.name}
          label='Название контеста'
          autoFocus
        />
      </FormControl>
      <FormControl className={classes.form}>
        <TextField
          name='startDate'
          type='date'
          onChange={this.handleChange}
          value={startDate}
          label='Дата начала'
        />
        <TextField
          name='startTime'
          type='time'
          onChange={this.handleChange}
          value={startTime}
          label='Время начала'
        />
      </FormControl>
      <FormControl className={classes.form}>
        <TextField
          name='finishDate'
          type='date'
          onChange={this.handleChange}
          value={finishDate}
          label='Дата окончания'
        />
        <TextField
          name='finishTime'
          type='time'
          onChange={this.handleChange}
          value={finishTime}
          label='Время окончания'
        />
      </FormControl>
    </FormGroup>
  }
}

const selectWidth = 170;

const styles: StyleRules = {
  group: {
    width: selectWidth * 2 + 20,
  },
  form: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    '& > div': {
      width: selectWidth,
    },
    marginBottom: 10,
  },
  nameForm: {
    marginBottom: 15,
  }
};

export default withStyles(styles)<IContestInfoEditorProps>(ContestInfoEditor as any);