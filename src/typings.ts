import { Verdict } from './contest/verdict';

export type ContestInfo = {
  id: number;
  name: string;
  startTime: string;
  finishTime: string;
  problems: ContestProblem[];
};

export interface ProblemInfo {
  name: string;
  statementUrl: string;
  timeLimitMillis: number;
  memoryLimitBytes: number
};

export interface ContestProblem extends ProblemInfo {
  index: string;
  contestId?: ContestInfo['id'];
}

export interface ArchiveProblem extends ProblemInfo {
  problemId: {
    resourceName: string;
    resourceProblemId: string;
  }
}

export enum AuthStatus {
  Pending,
  Success,
  Fail,
  None,
};

export enum UserRole {
  Admin = 'ROLE_ADMIN',
  User = 'ROLE_USER',
}

export type SessionInfo = {
  userid: number,
  roles: UserRole[],
  sub: string,
  exp?: number,
}

export type RegisterUserinfo = {
  username: string;
  password: string;
  email: string;
  birthDate: string;
  firstname: string;
  lastname: string;
  middlename: string;
}

export type User = {
  username: string;
};

export enum Language {
  C = 'C',
  CPP = 'C++',
  Delphi = 'Delphi',
  FPC = 'Free Pascal',
  Python2 = 'Python 2',
  Python3 = 'Python 3',
  Mono = 'C# Mono',
  Java = 'Java',
}

export namespace Language {
  export function _keyOf(language: Language) {
    return Object.keys(Language).find(k => Language[k] === language);
  }
}

export type Submission = {
  id: number;
  problem: ContestProblem;
  author: User;
  created: string;
  language: Language;
  solution: string;
  result: SubmissionResult;
}

export type SubmissionResult = {
  buildInfo?: string;
  verdict: Verdict;
  testsPassed?: number;
  timeUsed: number;
  memoryUsed: number;
}

export type ContestantProblemResult = {
  problemIndex: ContestProblem['index'];
  solved: boolean;
  failTries: number;
  solvedAt: number;
}

export type StandingsRow = {
  author: User;
  place: number,
  solvedCount: number;
  penalty: number;
  results: ContestantProblemResult[];
};

export type Standings = {
  rows: StandingsRow[];
  contest: ContestInfo;
}

export type Enhance<T> = {
  title: string;
  width?: number;
  renderCell: (submission: T) => React.ReactNode;
  key?: (T) => string;
};
