import { toCurrentDate } from './../DateFormats';
import client from './client';
import {
  ContestInfo,
  ContestProblem,
  Standings,
  Submission
  } from '../typings';


const patchTimes = (patcher: (string) => string) => ({ startTime, finishTime, ...others }: ContestInfo): ContestInfo => ({
  ...others,
  startTime: patcher(startTime),
  finishTime: patcher(finishTime),
});

const contestTimesToISO = patchTimes(date => new Date(date).toISOString());
const contestTimesFromISO = patchTimes(toCurrentDate);

const contestApi = {
  GetAllContests(): Promise<ContestInfo[]> {
    return client.get('contests')
      .then(response => response.data)
      .then(infos => infos.map(contestTimesFromISO));
  },

  GetContestInfo(id: ContestInfo['id']): Promise<ContestInfo> {
    return client.get(`contests/${id}`)
      .then(response => response.data)
      .then(contestInfo => contestTimesFromISO(contestInfo));
  },

  SubmitSolution(problemIndex: ContestProblem['index'], solution: string, language: string, contestId: ContestInfo['id']) {
    return client.post(`/submissions`, {
      language,
      solution,
      problemIndex,
      contestId
    })
  },

  GetStandings(contestId): Promise<Standings> {
    return client.get(`contests/${contestId}/standings`)
      .then(response => response.data);
  },

  GetUserSubmissions(contestId, author): Promise<Submission[]> {
    return client.get(`submissions`, {
      params: {
        author,
        contestId
      }
    })
      .then(response => response.data);
  },

  GetAllSubmissions(contestId): Promise<Submission[]> {
    return client.get(`/submissions?contestId=${contestId}`)
      .then(response => response.data);
  },

  EditContest(contest: ContestInfo): Promise<any> {
    const patched = contestTimesToISO(contest);
    return client.put(`contests/${contest.id}`, patched).then(r => r.data);
  },

  CreateContest(contest: ContestInfo): Promise<any> {
    const patched = contestTimesToISO(contest);
    return client.post(`contests/`, patched).then(r => r.data);
  },

  DeleteContest(contestId): Promise<any> {
    return client.delete(`contests/${contestId}`);
  }
}

export default contestApi;