import axios from 'axios';
import {
  ContestInfo,
  ContestProblem,
  Standings,
  Submission
  } from '../typings';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

axios.defaults.baseURL = 'https://bacs007.herokuapp.com/';
axios.defaults.headers = defaultHeaders;

const contestApi = {
  GetContests(): Promise<ContestInfo[]> {
    return axios.get('contests')
      .then(response => response.data);
  },

  GetContestInfo(id: ContestInfo['id']): Promise<ContestInfo> {
    return axios.get(`contests/${id}`)
      .then(response => response.data);
  },

  SubmitSolution(problemIndex: ContestProblem['index'], solution: string, language: string, contestId: ContestInfo['id']) {
    return axios.post(`/submissions`, {
      language,
      solution,
      problemIndex,
      contestId
    })
  },

  GetStandings(contestId): Promise<Standings> {
    return axios.get(`contests/${contestId}/standings`)
      .then(response => response.data);
  },

  GetUserSubmissions(contestId, author): Promise<Submission[]> {
    return axios.get(`submissions`, {
      params: {
        author,
        contestId
      }
    })
      .then(response => response.data);
  },

  GetAllSubmissions(contestId): Promise<Submission[]> {
    return axios.get(`/submissions?contestId=${contestId}`)
      .then(response => response.data);
  },

  EditContest(contest: ContestInfo): Promise<any> {
    return axios.put(`contests/${contest.id}`, contest).then(r => r.data);
  },

  CreateContest(contest: ContestInfo): Promise<any> {
    return axios.post(`contests/`, contest).then(r => r.data);
  },

  DeleteContest(contestId): Promise<any> {
    return axios.delete(`contests/${contestId}`);
  }
}

export default contestApi;