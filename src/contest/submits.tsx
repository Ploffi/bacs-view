import Paper from 'material-ui/Paper';
import Table from 'material-ui/Table';
import TableBody from 'material-ui/Table/TableBody';
import TableCell from 'material-ui/Table/TableCell';
import TableHead from 'material-ui/Table/TableHead';
import TableRow from 'material-ui/Table/TableRow';
import Collapse from 'material-ui/transitions/Collapse';
import * as React from 'react';
import { Fragment } from 'react';
import { Verdict } from './verdict';
import Highlighter from '../common/highlighter';
import { formatProblemName } from '../problem/problemTable';
import { Enhance, Submission, SubmissionResult } from '../typings';

interface ISubmitProps {
  submissions: Submission[];
  enhance?: Enhance<Submission>[];
  withSorting?: boolean;
}

interface ISubmitState {
  opened: {
    [key: number]: boolean,
  };
}

const toMB = (byte) => Math.floor(byte / (1024 * 1024));
const toSeconds = (ms) => Math.floor(ms / 1000);

const buildVerdictRow = (result: SubmissionResult) => {
  const { verdict, testsPassed } = result;
  const localizedVerdict = Verdict.rus(verdict) || Verdict.short(verdict);
  const testsPassedStr = testsPassed || testsPassed === 0
    ? ` на тесте ${testsPassed + 1}`
    : '';

  return localizedVerdict + testsPassedStr;
}



class Submits extends React.Component<ISubmitProps, ISubmitState> {
  constructor(props: ISubmitProps) {
    super(props);
    this.state = {
      opened: {},
    };
    this.toggleSolution = this.toggleSolution.bind(this);
  }

  toggleSolution(submissionId) {
    return () =>
      this.setState(prevState => ({
        opened: {
          ...prevState.opened,
          [submissionId]: !prevState.opened[submissionId],
        }
      }))
  }

  render() {
    const { enhance, submissions } = this.props;
    return (
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              {
                enhance &&
                enhance.map((add, index) => <TableCell key={index}>{add.title}</TableCell>)
              }
              <TableCell> Имя задачи </TableCell>
              <TableCell> Результат  </TableCell>
              <TableCell> Язык решения </TableCell>
              <TableCell> Потрачено </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              submissions &&
              submissions
                .map((submission) => (
                  <Fragment key={submission.id}>
                    <TableRow title={'id посылки: ' + submission.id} style={{ cursor: 'pointer' }} onClick={this.toggleSolution(submission.id)}>
                      {
                        enhance &&
                        enhance.map((add, index) => <TableCell key={index}>{add.renderCell(submission)}</TableCell>)
                      }
                      <TableCell>
                        {formatProblemName(submission.problem)}
                      </TableCell>
                      <TableCell>
                        {
                          buildVerdictRow(submission.result)
                        }
                      </TableCell>
                      <TableCell>{submission.language}</TableCell>
                      <TableCell>
                        {toMB(submission.result.memoryUsed)} из {toMB(submission.problem.memoryLimitBytes)} MB
                        <br />
                        {submission.result.timeUsed || 0} мс из {toSeconds(submission.problem.timeLimitMillis)} сек.
                      </TableCell>
                    </TableRow>
                    <TableRow style={{ visibility: this.state.opened[submission.id] ? 'visible' : 'collapse' }} >
                      <TableCell colSpan={enhance ? enhance.length + 4 : 4}>
                        <Collapse in={this.state.opened[submission.id]}
                          timeout='auto'
                          unmountOnExit
                        >
                          <Highlighter code={submission.solution} />
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                ))
            }
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default Submits;

