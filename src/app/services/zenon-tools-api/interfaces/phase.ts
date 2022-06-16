export interface Phase {
    phaseId: string;
    name: string;
    description: string;
    url: string;
    znnFundsNeeded: number;
    qsrFundsNeeded: number;
    creationTimestamp: number;
    status: number;
    yesVotes: number;
    noVotes: number;
    totalVotes: number;
}
