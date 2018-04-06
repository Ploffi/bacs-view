import { TextField } from 'material-ui';
import AddIcon from 'material-ui-icons/Add';
import Remove from 'material-ui-icons/Remove';
import IconButton from 'material-ui/IconButton';
import * as React from 'react';
import { ArchiveProblem, ContestProblem, ProblemInfo } from '../../typings';


interface IContestProblemsEnhanceProps {
    onRemoveClick: (problem: ProblemInfo) => () => void;
}

export const createContestProblemsEnhance = ({ onRemoveClick }: IContestProblemsEnhanceProps) => [{
    title: '',
    width: 50,
    renderCell: (problem: ContestProblem) => (
        <IconButton onClick={onRemoveClick(problem)} >
            <Remove />
        </IconButton>
    )
}];


interface IAllProblemsEnhance {
    isProblemDisabled: (problem: ProblemInfo) => boolean;
    onAddProblem: (problem: ProblemInfo) => () => void;
    getHashByProblem: (problem: ProblemInfo) => string;
    getIndexByProblem: (problem: ProblemInfo) => string;
    onProblemIndexChange: (e) => void;    
}

export const createAllProblemsEnhance = ({ isProblemDisabled, onAddProblem, getHashByProblem, getIndexByProblem, onProblemIndexChange }: IAllProblemsEnhance) => [
    {
        title: '',
        width: 50,
        renderCell: (problem: ArchiveProblem) => (
            <IconButton disabled={isProblemDisabled(problem)} onClick={onAddProblem(problem)} >
                <AddIcon />
            </IconButton>
        )
    },
    {
        title: 'Индекс задачи',
        width: 150,
        key: (problem) => getHashByProblem(problem),
        renderCell: (problem: ArchiveProblem) => {
            const index = getIndexByProblem(problem);
            return <TextField
                error={index === ''}
                name={getHashByProblem(problem)}
                value={index}
                onChange={onProblemIndexChange}
            />
        },
    },
    {
        title: 'Resourse Id',
        renderCell: (problem: ArchiveProblem) => {
            return problem && problem.problemId &&
                <span>{
                    `${problem.problemId.resourceName}: ${problem.problemId.resourceProblemId}`
                }</span>
        },
    },
];