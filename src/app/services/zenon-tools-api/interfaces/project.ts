import { Phase } from './phase';

export interface Project {
    projectId: string;
    owner: string;
    name: string;
    description: string;
    url: string;
    znnFundsNeeded: number;
    qsrFundsNeeded: number;
    creationTimestamp: number;
    lastUpdateTimestamp: number;
    status: number;
    yesVotes: number;
    noVotes: number;
    totalVotes: number;
    phases: Phase[];
}
