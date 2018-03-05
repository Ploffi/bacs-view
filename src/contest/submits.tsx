import Paper from 'material-ui/Paper';
import TableBody from 'material-ui/Table/TableBody';
import TableCell from 'material-ui/Table/TableCell';
import TableHead from 'material-ui/Table/TableHead';
import TableRow from 'material-ui/Table/TableRow';
import * as React from 'react';
import { Verdict } from './verdict';
import { formatProblemName } from '../problem/problemTable';
import { Enhance, Submission, SubmissionResult } from '../typings';
import Table, {  } from 'material-ui/Table';

interface ISubmitProps {
  submissions: Submission[];
  enhance?: Enhance<Submission>[];
  withSorting?: boolean;
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

const Submits = ({ submissions, enhance }: ISubmitProps) => {
  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            {
              enhance &&
              enhance.map(add => <TableCell>{add.title}</TableCell>)
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
                <TableRow key={submission.id}>
                  {
                    enhance &&
                    enhance.map(add => <TableCell>{add.renderCell(submission)}</TableCell>)
                  }
                  <TableCell>{formatProblemName(submission.problem)}</TableCell>
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
              ))
          }
        </TableBody>
      </Table>
    </Paper>
  );
}

export default Submits;

