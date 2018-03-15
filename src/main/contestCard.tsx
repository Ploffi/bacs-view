import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Typography from 'material-ui/Typography';
import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  format,
  FormatType,
  getDateDiff,
  padToTwoDigit,
  TimeDiffType
  } from '../DateFormats';
import ProblemTable from '../problem/problemTable';
import { ContestInfo } from '../typings';

import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from 'material-ui/ExpansionPanel';


interface IContestCardProps {
  contest: ContestInfo;
  isExpanded: boolean;
  onExpand: (event, expand?) => void;
  classes?: any;
}

function formatContinuingContestTime(now: Date, finish: Date) {
  const minDiff = getDateDiff(finish, now, TimeDiffType.Minutes);
  const hour = minDiff / 60 | 0;
  const min = minDiff % 60;
  return (hour ? (hour + 'ч. ') : '') + padToTwoDigit(min) + 'мин.';
}

const ContestCard = (props: IContestCardProps) => {
  const { contest, isExpanded, onExpand } = props;
  const start = new Date(contest.startTime);
  const finish = new Date(contest.finishTime);
  const now = new Date();
  const isNotStarted = now < start;
  return (
    <ExpansionPanel disabled={isNotStarted} expanded={isExpanded} onChange={onExpand}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <div>
          <Typography variant='headline' >
            {contest.name}
          </Typography>
          <Typography variant='subheading'>
            {
              now < start &&
              'Начнется ' + format(start)
            }
            {
              now > finish &&
              'Закончился ' + (
                getDateDiff(now, finish, TimeDiffType.Day) > 1
                  ? format(finish, FormatType.Date)
                  : getDateDiff(now, finish, TimeDiffType.Hour) <= 1
                    ? 'менее часа назад'
                    : getDateDiff(now, finish, TimeDiffType.Hour) + 'часов назад'
              )
            }
            {
              now > start && now < finish && (
                getDateDiff(finish, now, TimeDiffType.Day) > 1
                  ? 'Закончится ' + format(finish)
                  : 'До конца контеста осталось ' +
                  formatContinuingContestTime(now, finish)
              )
            }
          </Typography>
        </div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <div>
          {
            <Link to={`/contest/${contest.id}`}>
              Войти в контест
            </Link>
          }
          <div>
            <ProblemTable
              problems={contest.problems} />
          </div>
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
};

export default ContestCard;