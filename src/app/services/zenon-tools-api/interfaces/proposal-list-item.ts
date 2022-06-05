export interface ProposalListItem {
    projectName: string;
    phaseName: string;
    projectId: string;
    creationTimestamp: number;
    url: string;
    status: number;
    yesVotes: number;
    noVotes: number;
    totalVotes: number;
    znnFundsNeeded: number;
    qsrFundsNeeded: number;
}

export type ProposalListItems = Array<ProposalListItem>;
