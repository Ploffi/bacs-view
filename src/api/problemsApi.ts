import client from './client';
import { ArchiveProblem } from '../typings';

const problemsApi = {
  //TODO: включить external 
  getProblems(_external?: boolean): Promise<ArchiveProblem[]> {
    return client.get('problems')
      .then(response => response.data);
  },
  getArchiveProblem(contestId, problemIndex): Promise<ArchiveProblem> {
    return client.get('problems', {
      params: {
        contestId,
        problemIndex
      }
    }).then(r => r.data);
  }
}

export default problemsApi;